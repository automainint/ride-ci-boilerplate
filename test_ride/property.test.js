const wvs = 10 ** 8;

describe('property', async function () {
  this.timeout(100000);

  before(async function () {
    await setupAccounts(
      { storage:  10 * wvs,
        foo:      10 * wvs });
    const script = compile(file('property.ride'));
    const ssTx = setScript(
      { script: script,
        fee:    1000000 },
      accounts.storage);
    await broadcast(ssTx);
    await waitForTx(ssTx.id)
  });

  it('can mint and read property', async function () {
    const storage = address(accounts.storage);
    const foo     = address(accounts.foo);

    const iTxMint = invokeScript(
      { dApp: storage,
        call: {
          function: 'mint',
          args:     [ { type: 'integer', value: 42 } ]
        } },
      accounts.foo);

    await broadcast(iTxMint);
    await waitForTx(iTxMint.id);

    const changes = await stateChanges(iTxMint.id);

    const assetId = changes.issues[0].assetId; 
    const key     = assetId + '_property';

    const data    = await accountDataByKey(key, storage);
    const balance = await assetBalance(assetId, foo);

    expect(data.value).to.equal(42);
    expect(balance).to.equal(1);
  });
});
