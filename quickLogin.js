window.addEventListener("load", async () => {
  if (await isExtensionOff()) return;

  buildPluginStatus();
});
