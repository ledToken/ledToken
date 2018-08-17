# Run Tests

1.) Update and clear repo
git pull
rm -rf build

2.) Nuke & reinstall
npm install

3.) Connect
launch ganache, if not installed follow directions here: https://truffleframework.com/ganache

4.) Rebuild & test
truffle compile
truffle test
truffle migrate --network=kovan or truffle migrate --network=rinkeby
