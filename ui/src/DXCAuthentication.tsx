import React from "react";
import {
  TextField,
  Grid,
} from "@material-ui/core";
import * as R from "ramda";

interface IDXCAuth {
  dxcSecureKey: string;
  alreadyRequestedData: boolean;
}

export const DXCAuthentication = () => {

  const [body, setBody] = React.useState<IDXCAuth>({
    dxcSecureKey: "",
    alreadyRequestedData: false,
  });

  const getData = async () => {
    setBody({
      dxcSecureKey: localStorage.getItem('DXC_SECURE_KEY') || '',
      alreadyRequestedData: true,
    });
  };

  if (!body.alreadyRequestedData) {
    getData();
  }

  const handleDXCSecureKey = (event: any) => {
    localStorage.setItem('DXC_SECURE_KEY', event.target.value)
    setBody(R.assoc("dxcSecureKey", event.target.value, body));
  };

  return (
    <Grid
      container
      spacing={2}
      style={{
        marginTop: "1%",
        flexGrow: 1,
        alignItems: "normal",
      }}
      direction="column"
    >
      <Grid item>
        <TextField
          error={body?.dxcSecureKey?.length === 0}
          id="dxcSecureKey"
          label="DXC_SECURE_KEY"
          fullWidth={true}
          helperText="The DXC_SECURE_KEY is set when setting up your DXC."
          value={body?.dxcSecureKey}
          onChange={handleDXCSecureKey}
        />
      </Grid>
    </Grid>
  );
};