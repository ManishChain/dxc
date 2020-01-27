# DXC API

## Architecture MVP #1

<img style="float: center;" src="./public/assets/dxc-architecture.svg">

## How to run unit tests

```
$ go test -v -race ./...
```

## How to run

### Docker

Environment var:

```
# Runtime env
## development = no docker
## production = docker
GO_ENV=production

# File directories
LOCAL_FILES_DIR=/path/to/files
```

Run
```
$ docker-compose build
$ docker-compose up -d 
```
Navigate to localhost:8080

### Local

Environment var:

```
# Runtime env
## development = no docker
## production = docker
GO_ENV=development

# File directories
LOCAL_FILES_DIR=/path/to/files
```

Run
```
$ go build && ./dxc
```
Navigate to localhost:1323

## To Do

### File stuff

- [x] Upload file and make it match with file in volume
- [x] Nice error handling when file doesn't match
- [x] Store the upload event in db
- [x] Unit test the crap out of it
- [x] Add/Get products
- [x] Request redirect to Host API (GET)
- [ ] Request redirect to Host API (POST)
- [ ] Change name of file if same filename but not same content
- [ ] More clever file checker -> no delete but flag in db?
- [ ] Fully functional UI
