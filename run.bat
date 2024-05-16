@echo off

REM run cdp-wtrace server
REM run cdp-wtrace web application

start cmd /k "cd cdp-wtrace-server && npm run dev"
start cmd /k "cd cdp-wtrace-web && npm run dev"