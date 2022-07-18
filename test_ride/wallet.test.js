const wvs = 10 ** 8;

describe('wallet test suite', async function () {
  this.timeout(100000);

  before(async function () {
    await setupAccounts(
      { foo: 10 * wvs,
        bar: 2 * wvs,
        wallet: 0.05 * wvs });
    const script = compile(file('wallet.ride'));
    const ssTx = setScript(
      { script: script },
      accounts.wallet);
    await broadcast(ssTx);
    await waitForTx(ssTx.id)
  });

  it('can deposit', async function () {
    const iTxFoo = invokeScript(
      { dApp:     address(accounts.wallet),
        call:     { function: 'deposit' },
        payment:  [ { assetId: null, amount: 0.9 * wvs } ] },
      accounts.foo);

    const iTxBar = invokeScript(
      { dApp:     address(accounts.wallet),
        call:     { function: 'deposit' },
        payment:  [ { assetId: null, amount: 1.9 * wvs } ] },
      accounts.bar);

    await broadcast(iTxFoo);
    await broadcast(iTxBar);
    await waitForTx(iTxFoo.id);
    await waitForTx(iTxBar.id);
  });

  it('cannot withdraw more than was deposited', async function () {
    const iTxFoo = invokeScript(
      { dApp: address(accounts.wallet),
        call: {
          function: 'withdraw',
          args:     [ { type: 'integer', value: 2 * wvs } ]
        } },
      accounts.foo);

    expect(broadcast(iTxFoo)).to.be.rejectedWith('Not enough balance')
  });

  it('can withdraw', async function () {
    const iTxFoo = invokeScript(
      { dApp: address(accounts.wallet),
        call: {
          function: 'withdraw',
          args:     [ { type: 'integer', value: 0.9 * wvs } ]
        } },
      accounts.foo);

    await broadcast(iTxFoo)
  });
});
