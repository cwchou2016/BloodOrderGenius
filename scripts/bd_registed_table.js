window.addEventListener("load", async () => {
    if (await isExtensionOff()) return;
  
    buildPluginStatus();
    insertQuickNotes();
    insertInventoryTable();
});

function insertQuickNotes() {
  let textarea = document.getElementById('textarea_note');
  buildQuickNotes(textarea);
}

function insertInventoryTable() {
  const node = document.getElementById('queryResultBox').parentNode;
  node.parentNode.insertBefore(buildInventory(), node);
}