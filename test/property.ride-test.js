const wvs = 10 ** 8;

describe('property test suite', async function () {
  this.timeout(100000);

  before(async function () {
    await setupAccounts(
      { wallet: 10 * wvs });
    const script = compile(file('property.ride'));
    const ssTx = setScript(
      { script: script },
      accounts.wallet);
    await broadcast(ssTx);
    await waitForTx(ssTx.id)
    console.log('Script has been set')
  });

  it('Can mint and read property', async function () {
    const account = address(accounts.wallet);

    const iTxFoo = invokeScript(
      { dApp: account,
        call: {
          function: 'mint',
          args:     [ { type: 'integer', value: 42 } ]
        } },
      accounts.wallet);

    await broadcast(iTxFoo);
    await waitForTx(iTxFoo.id);

    const data = await accountData(account);

    const value = (() => {
      for (let id in data)
        return data[id].value;
    })();

    expect(value).to.equal(42);
  });
});
