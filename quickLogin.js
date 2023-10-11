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
  if (codeDiv == null) return;

  document.getElementById("valCode").value = codeDiv.innerText;
}

async function autoFillHosptialId() {
  let id = await chrome.storage.local.get(["hosp_id"]);
  id = id["hosp_id"];

  if (id == null || id == "") return;

  document.getElementById("txt_orgCode").value = id;
}

function saveHospitalId() {
  let id = document.getElementById("txt_orgCode").value;
  chrome.storage.local.set({ ["hosp_id"]: id });
}

// Modify UI
function insertClickEvents() {
  document.getElementById("btn_send").addEventListener("click", (event) => {
    saveHospitalId();
  });
}
