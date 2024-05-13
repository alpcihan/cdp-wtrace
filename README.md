# WTrace-CDP

WTrace-CDP integration

## Getting started

### Setup
Example folder structure:

    .
    ├── ...
    ├── root                    
    │   ├── wtrace          
    │   └── cdp-wtrace-web
    │   └── cdp-wtrace-server
    └── ...


Clone the repository recursively:

```sh
git clone --recursive https://github.com/alpcihan/cdp-wtrace
```

#### 1) Setup WTrace
Install the dependencies and build the project:
```sh
cd wtrace
npm install
npm run build
```

#### 2) Setup CDP-WTrace Web Application
Install the dependencies:
```sh
cd cdp-wtrace-web
npm install
```

#### 3) Setup CDP-WTrace Server
Install the dependencies:
```sh
cd cdp-wtrace-server
npm install
```

### How to run?

#### 1) Run CDP-WTrace Server
```sh
cd cdp-wtrace-server
npm run dev
```


#### 2) Run CDP-WTrace Web Application
```sh
cd cdp-wtrace-web
npm run dev
```
   
### Development
If an update is made to the wtrace repository:

1) run ```npm run build``` at the wtrace directory.
2) run ```npm update wtrace``` at the wtrace-cdp-web directory.
