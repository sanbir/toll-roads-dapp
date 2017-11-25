#!/bin/bash

GREEN='\033[0;32m'
NCGREEN='\033[0m' # No Color

printf "${GREEN}sudo npm install -g n${NCGREEN}\n"
sudo npm install -g n

printf "${GREEN}sudo n 8.1.0${NCGREEN}\n"
sudo n 8.1.0

printf "${GREEN}source ~/.bashrc${NCGREEN}\n"
source ~/.bashrc

printf "${GREEN}npm install${NCGREEN}\n"
npm install

printf "${GREEN}npm install web3@0.18.2${NCGREEN}\n"
npm install web3@0.18.2

printf "${GREEN}testrpc &${NCGREEN}\n"
testrpc &

printf "${GREEN}sleep 5${NCGREEN}\n"
sleep 5

printf "${GREEN}truffle test${NCGREEN}\n"
truffle test

printf "${GREEN}truffle migrate --reset${NCGREEN}\n"
truffle migrate --reset

printf "${GREEN}npm run start${NCGREEN}\n"
npm run start