window.addEventListener("load", async () => {
  if (await isExtensionOff()) return;

  buildPluginStatus();
  insertClickEvents();
});

function saveHospitalId() {
  let id = document.getElementById("txt_orgCode").value;
  chrome.storage.sync.set({ ["hosp_id"]: id });
}

// Modify UI
function insertClickEvents() {
  document.getElementById("btn_send").addEventListener("click", (event) => {
    saveHospitalId();
  });
}
