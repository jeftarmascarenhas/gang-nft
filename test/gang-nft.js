const GangNFT = artifacts.require("GangNFT");

contract("GangNFT", (accounts) => {
  let contract;
  const BASE_URI = "ipfs://QmTD5WoGncyMk5Hi1GyPEW6v51ajoftfN99xEKk4WYcGAy/";
  const HIDDEN_URI = "ipfs://QmQuo3JsC8CuB1tuG5kgJFsNDRSF3oTNxGWSdF3RcTmQbe";

  beforeEach(async () => {
    contract = await GangNFT.deployed();
  });

  it("should have ipfs as base URL when it is deployed", async () => {
    const baseURI = await contract.baseTokenURI.call();
    console.log(baseURI, BASE_URI);

    assert.equal(baseURI, BASE_URI);
  });

  it("should have balanceOf 1 when minted it is successful", async () => {
    const account = accounts[5];
    const tokenAmount = 1;
    const discount = 50;

    const getSaleCost = await contract.saleCost.call();
    const saleCost = web3.utils.fromWei(getSaleCost, "ether");

    const total = Number(saleCost) * tokenAmount;

    const discountCalc = (total * discount) / 100;

    const valueWithDiscount = total - discountCalc;

    await contract.mint(account, tokenAmount, discount, {
      from: account,
      value: web3.utils.toWei(valueWithDiscount.toString(), "ether"),
    });

    const balance = (await contract.balanceOf.call(account)).toNumber();

    const tokeURI = await contract.tokenURI(1);

    assert.equal(HIDDEN_URI, tokeURI);
    assert.equal(balance, tokenAmount);
  });

  it("should show a error 'Discount wrong'", async () => {
    const account = accounts[2];
    const tokenAmount = 1;
    const discount = 5;
    const value = web3.utils.toWei("0.02", "ether");
    let error;

    try {
      await contract.mint(account, tokenAmount, discount, {
        from: account,
        value,
      });
    } catch (err) {
      error = err;
    }

    assert.equal(error.reason, "Discount wrong");
  });

  it("should return a error message 'max amount per mint'", async () => {
    const account = accounts[1];
    const tokenAmount = 4;
    const discount = 50;
    const value = web3.utils.toWei("0.88", "ether");
    let error;

    try {
      await contract.mint(account, tokenAmount, discount, {
        from: account,
        value,
      });
    } catch (err) {
      error = err;
    }

    assert.equal(error.reason, "max amount per mint");
  });

  it("should have 50% discount of mint when isPreSale is true", async () => {
    const account = accounts[2];
    const tokenAmount = 2;
    const discount = 20;

    const getSaleCost = await contract.saleCost.call();
    const saleCost = web3.utils.fromWei(getSaleCost, "ether");

    const total = Number(saleCost) * tokenAmount;

    const discountCalc = (total * discount) / 100;

    const valueWithDiscount = total - discountCalc;

    await contract.mint(account, tokenAmount, discount, {
      from: account,
      value: web3.utils.toWei(valueWithDiscount.toString(), "ether"),
    });

    const balance = (await contract.balanceOf.call(account)).toNumber();

    assert.equal(balance, tokenAmount);
    assert.equal(valueWithDiscount, 0.352);
  });

  it("should not mint when value Not enough ether", async () => {
    const account = accounts[2];
    const tokenAmount = 3;
    const discount = 50;
    const value = web3.utils.toWei("0.22", "ether");
    let error;

    try {
      await contract.mint(account, tokenAmount, discount, {
        from: account,
        value,
      });
    } catch (err) {
      error = err;
    }

    assert.equal(error.reason, "Not enough ether");
  });

  it("should return error totalSupply was 25", async () => {
    const contract = await GangNFT.new(BASE_URI);
    const account = accounts[5];
    const tokenAmount = 1;
    const discount = 20;
    let error;
    const totalToken = Array.from({ length: 25 }, (k, v) => v + 1);

    const getSaleCost = await contract.saleCost.call();
    const saleCost = web3.utils.fromWei(getSaleCost, "ether");

    const total = Number(saleCost) * tokenAmount;

    const discountCalc = (total * discount) / 100;

    const valueWithDiscount = total - discountCalc;

    for await (let token of totalToken) {
      await contract.mint(account, tokenAmount, discount, {
        from: account,
        value: web3.utils.toWei(valueWithDiscount.toString(), "ether"),
      });
    }

    try {
      await contract.mint(account, tokenAmount, discount, {
        from: account,
        value: web3.utils.toWei(valueWithDiscount.toString(), "ether"),
      });
    } catch (err) {
      error = err;
    }

    assert.equal(error.reason, "Max supply exceeded");
  });

  it("shouldn't have discount when isn't Pre-sale", async () => {
    const account = accounts[4];
    const tokenAmount = 3;
    const discount = 0;
    const value = web3.utils.toWei("0.66", "ether");

    await contract.mint(account, tokenAmount, discount, {
      from: account,
      value,
    });

    const balance = (await contract.balanceOf.call(account)).toNumber();

    assert.equal(balance, tokenAmount);
  });
});
