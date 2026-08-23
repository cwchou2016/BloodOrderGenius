window.addEventListener("load", async function() {
    if(await isExtensionOff()) return;
    buildPluginStatus();


});