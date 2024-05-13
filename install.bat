REM install wtrace dependencies and build wtrace
REM install cdp-wtrace-web dependencies
REM install cdp-wtrace-server dependencies

cd wtrace && npm i && npm run build && rm /s /q node_modules && cd .. && ^
cd cdp-wtrace-web && npm i && cd .. && ^
cd cdp-wtrace-server && npm i
