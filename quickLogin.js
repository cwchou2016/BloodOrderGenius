window.addEventListener("load", async () => {
  if (await isExtensionOff()) return;

  buildPluginStatus();
  autoFillHosptialId();
  autoFillValCode();
  insertClickEvents();
  document.getElementById("txt_username").focus();
});

function autoFillValCode() {
  let codeDiv = document.getElementById("txtCaptchaDiv");
  if(codeDiv === null) return;

  document.getElementById("valCode").value = codeDiv.value;
}

async function autoFillHosptialId() {
  let id = await chrome.storage.sync.get(["hosp_id"]);
  id = id["hosp_id"];
  document.getElementById("txt_orgCode").value = id;
}

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
