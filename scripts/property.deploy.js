(async () => {
  const script = compile(file('property.ride'));
  const dappSeed = env.dappSeed;
  if (dappSeed == null)
    throw new Error(`Please provide dappSedd`);
  const ssTx = setScript(
    { script },
    dappSeed);
  await broadcast(ssTx);
  await waitForTx(ssTx.id);
  console.log(ssTx.id);
})();
