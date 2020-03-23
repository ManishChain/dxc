import BN from 'bn.js';

import {
  DTXTokenContract,
  DTXTokenInstance,
  DXCContract,
  DXCInstance,
  MiniMeTokenFactoryContract,
  MiniMeTokenFactoryInstance,
  OwnedUpgradeabilityProxyContract,
  OwnedUpgradeabilityProxyInstance,
} from '../types/truffle-contracts';

import {encodeCall} from './utils/encodeCall';
import {getLatestQuote} from './utils/getLatestQuote';

const TF: MiniMeTokenFactoryContract = artifacts.require('MiniMeTokenFactory');
const DTX: DTXTokenContract = artifacts.require('DTXToken');
const DXC: DXCContract = artifacts.require('DXC');
const OUP: OwnedUpgradeabilityProxyContract = artifacts.require(
  'OwnedUpgradeabilityProxy'
);

contract('DXC', async accounts => {
  describe('DXC functionalities', async () => {
    let tfInstance: MiniMeTokenFactoryInstance;
    let dtxInstance: DTXTokenInstance;
    let dxcInstance: DXCInstance;
    let oUPinstance: OwnedUpgradeabilityProxyInstance;
    let proxiedDxc: DXCInstance;
    let latestQuote: number;

    function amountOfDTXFor(amountInUSD: number) {
      return new BN(amountInUSD / latestQuote);
    }

    before(async () => {
      latestQuote = await getLatestQuote();
    });

    beforeEach(async () => {
      tfInstance = await TF.new();
      dtxInstance = await DTX.new(tfInstance.address);

      dxcInstance = await DXC.new();
      oUPinstance = await OUP.new();

      // Encode the calling of the function initialize with the argument dtxInstance.address to bytes
      const data = encodeCall('initialize', ['address'], [dtxInstance.address]);

      // point proxy contract to dxc contract and call the initialize function which is analogous to a constructor
      assert.isOk(
        await oUPinstance.upgradeToAndCall(dxcInstance.address, data, {
          from: accounts[0],
        })
      );

      // Intitialize the proxied dxc instance
      proxiedDxc = await DXC.at(oUPinstance.address);

      await dtxInstance.generateTokens(
        proxiedDxc.address,
        web3.utils.toWei('1000000')
      );

      await dtxInstance.generateTokens(
        accounts[0],
        web3.utils.toWei('1000000')
      );
      await dtxInstance.generateTokens(
        accounts[1],
        web3.utils.toWei('1000000')
      );
    });

    it('Should have a platform balance', async () => {
      expect(await (await proxiedDxc.platformBalance()).toString()).to.be.equal(
        web3.utils.toWei('1000000')
      );
    });

    it('Can read the balance of someone internally', async () => {
      const balanceResult = await proxiedDxc.balanceOf(accounts[1]);
      expect(balanceResult[0].toString()).to.be.equal('0');
    });

    it('Can convert from fiat money', async () => {
      let balanceResult = await proxiedDxc.balanceOf(accounts[1]);
      expect(balanceResult[0].toString()).to.be.equal('0');
      await proxiedDxc.convertFiatToToken(
        accounts[1],
        web3.utils.toWei(amountOfDTXFor(1))
      );
      balanceResult = await proxiedDxc.balanceOf(accounts[1]);
      expect(balanceResult[0].toString()).to.be.equal(
        web3.utils.toWei(amountOfDTXFor(1))
      );
    });

    it('Should create a deal successfully', async () => {
      // All percentages here need to add up to a 100: 15 + 70 + 10 = 95 + protocol percentage 5 = 100
      await proxiedDxc.createDeal(
        'did:databroker:deal2:weatherdata',
        accounts[1],
        15,
        accounts[2],
        70,
        accounts[3],
        accounts[4],
        10,
        5,
        0,
        0
      );
    });
  });
});
