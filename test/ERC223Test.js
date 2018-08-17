const ERC223 = artifacts.require("ERC223");
const assertJump = require("./helpers/assertJump");

contract("ERC223", accounts => {
  const [firstAccount, purchaser1] = accounts;

  it("sets an owner", async () => {
    const erc223 = await ERC223.new();

    assert.equal(await erc223.owner.call(), firstAccount);
  });

  it("sets an token name", async () => {
    const erc223 = await ERC223.new();

    assert.equal(await erc223.name.call(), "LED Token");
  });

  it("sets an token symbol", async () => {
    const erc223 = await ERC223.new();

    assert.equal(await erc223.symbol.call(), "LED");
  });

  it("sets a total supply", async () => {
    const erc223 = await ERC223.new();
    const supplyBN = await erc223.totalSupply.call();
    assert.equal(supplyBN.toNumber(), 10000000000000000000);
  });

  it("intially transfers entire supply to owner", async () => {
    const erc223 = await ERC223.new();
    const initialOwnerSupply = await erc223.balanceOf(firstAccount);
    assert.equal(initialOwnerSupply.toNumber(), 10000000000000000000);
  });

  it("should be unfrozen at the beginning", async () => {
    let token = await ERC223.new();
    let frozen = await token.isFrozen();

    assert.equal(frozen, false, "");
  });

  it("should change frozen status", async () => {
    let token = await ERC223.new();
    let frozen = await token.isFrozen();

    token.toggleFreeze({ from: firstAccount });

    let newStatus = await token.isFrozen();
    console.log("newStatus", newStatus);
    assert.equal(frozen, !newStatus, "");
  });

  //In order to even transfer token it needs to be unlocked except it's airdrop distribution
  it("should be unlocked forever", async function() {
    let token = await ERC223.new();
    await token.unlockForever();
    let isUnlocked = await token.isUnlocked();
    assert.equal(isUnlocked, true, "Token is not unlocked");
  });

  it("should return the correct allowance amount after approval", async function() {
    let token = await ERC223.new();
    await token.unlockForever();

    let approve = await token.approve(accounts[1], 100);
    let allowance = await token.allowance(firstAccount, accounts[1]);

    assert.equal(allowance, 100);
  });

  it("should return correct balances after transfer", async function() {
    let token = await ERC223.new();
    await token.unlockForever();

    let approve = await token.approve(accounts[1], 100);
    let transfer = await token.transfer(accounts[1], 100);

    let balance1 = await token.balanceOf(accounts[1]);
    assert.equal(balance1, 100);
  });

  it("should throw an error when trying to transfer more than balance", async function() {
    let token = await ERC223.new();
    await token.unlockForever();
    let approve = await token.approve(accounts[1], 1000000000000000000);
    try {
      let transfer = await token.transfer(accounts[1], 100000000000000000011, {
        from: firstAccount
      });
    } catch (error) {
      console.log("Caught - Expected : " + error);
      assert.equal(true, true, "Should fail");
      return;
    }
    assert.fail("should have thrown before");
  });

  it("should throw an error when trying to transfer more than allowed", async function() {
    let token = await ERC223.new();

    await token.unlockForever();
    let approve = await token.approve(accounts[1], 100);
    try {
      //If you put less than 101, test should fail
      let transfer = await token.transferFrom(firstAccount, accounts[1], 101, {
        from: accounts[1]
      });
    } catch (error) {
      console.log("Caught - Expected : " + error);
      assert.equal(true, true, "Should have an error");
      return;
    }
    assert.fail("should have thrown before");
  });

  it("should distribute airdrop", async () => {
    let token = await ERC223.new();
    let addresses = [accounts[1], accounts[2], accounts[3]];

    await token.distributeAirdrop(addresses, 100);

    let balance0 = await token.balanceOf(firstAccount);

    let balance1 = await token.balanceOf(accounts[1]);
    let balance2 = await token.balanceOf(accounts[2]);
    let balance3 = await token.balanceOf(accounts[3]);

    assert.equal(parseInt(balance1.c[0], 10), parseInt(balance2.c[0], 10), "");
    assert.equal(parseInt(balance2.c[0], 10), parseInt(balance3.c[0], 10), "");
  });

  it("distribution should fail if token is unlocked", async () => {
    let token = await ERC223.new();
    let addresses = [accounts[1], accounts[2], accounts[3]];

    await token.unlockForever();
    try {
      await token.distributeAirdrop(addresses, 100);
    } catch (error) {
      console.log("Caught - Expected : " + error);
      assert.equal(true, true, "");
      return;
    }
    assert.fail("Should have failed before");
  });
});
