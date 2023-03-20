@echo off
set d=%~dp0
set cmpPath=%d%TinyPNGNodeJSBatcher-master
echo %cmpPath%
cd %cmpPath%
node index.js

pause
