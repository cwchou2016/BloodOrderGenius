window.addEventListener("load", async () => {
    if (await isExtensionOff()) return;
  
    buildPluginStatus();
    insertQuickNotes();
  });

  function insertQuickNotes() {
    let textarea = document.getElementById('textarea_note');
    buildQuickNotes(textarea);
  }