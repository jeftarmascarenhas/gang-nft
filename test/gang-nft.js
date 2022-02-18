const GangNFT = artifacts.require("GangNFT");

const uri =
  "https://ipfs.io/ipfs/QmeUa6rJY5VCH6pcmyyaipNtbisW2egv11h26EJyUEsW8X/";

contract("GangNFT", (accounts) => {
  it("should have ipfs as base URL when it is deployed", async () => {
    const contract = await GangNFT.deployed();
    await contract.setBaseURI(uri);

    const baseURI = await contract.baseTokenURI.call();

    assert.equal(baseURI, uri);
  });

  it("should have balanceOf 1 when minted it is successful", async () => {
    const contract = await GangNFT.deployed();
    const account = accounts[1];
    const tokenAmount = 1;
    const discount = 50;
    const value = web3.utils.toWei("0.02", "ether");

    await contract.mint(account, tokenAmount, discount, {
      from: account,
      value,
    });

    const balance = (await contract.balanceOf.call(account)).toNumber();

    assert.equal(balance, tokenAmount);
  });

  it("should show a error 'Discount is not in range'", async () => {
    const contract = await GangNFT.deployed();
    const account = accounts[2];
    const tokenAmount = 1;
    const discount = 51;
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

    assert.equal(error?.message?.includes("Discount is not in range"), true);
  });

  it("should show a error 'tokenAmount is required'", async () => {
    const contract = await GangNFT.deployed();
    const account = accounts[1];
    const tokenAmount = 0;
    const discount = 50;
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

    assert.equal(error.reason, "Cannot mint, send token amount");
  });

  it("should have 50% discount of mint when isPreSale is true", async () => {
    const contract = await GangNFT.deployed();
    const account = accounts[2];
    const tokenAmount = 2;
    const discount = 50;
    const value = web3.utils.toWei("0.04", "ether");

    const isPreSale = await contract.isPreSale.call();

    await contract.mint(account, tokenAmount, discount, {
      from: account,
      value,
    });

    const balance = (await contract.balanceOf.call(account)).toNumber();
    const getSaleCost = await contract.saleCost.call();
    const saleCost = web3.utils.fromWei(getSaleCost, "ether");

    const discountCalc = (Number(saleCost) * tokenAmount * discount) / 100;

    assert.equal(isPreSale, true);
    assert.equal(balance, tokenAmount);
    assert.equal(discountCalc, 0.02);
  });

  it("should not mint when value not enough ether provided", async () => {
    const contract = await GangNFT.deployed();
    const account = accounts[3];
    const tokenAmount = 3;
    const discount = 50;
    const value = web3.utils.toWei("0.02", "ether");
    let error;

    const isPreSale = await contract.isPreSale.call();

    try {
      await contract.mint(account, tokenAmount, discount, {
        from: account,
        value,
      });
    } catch (err) {
      error = err;
    }

    assert.equal(isPreSale, true);

    assert.equal(error.reason, "Not enough ether provided");
  });
});
