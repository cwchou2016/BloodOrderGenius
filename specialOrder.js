insertClickEvents();
buildPluginStatus();

function getRbcAg() {
  let rbc = [];
  for (let i = 1; i <= 10; i++) {
    let value = document.getElementById(`select_redBD2_${i}`).value;
    if (value == "") continue;
    rbc.push(value);
  }
  return rbc;
}

function getPatient() {
  return document.getElementById("txt_patientNum").value;
}

async function savePatientData(ptid, data) {
  chrome.storage.local.set({ [ptid]: data });

  let res = await chrome.storage.local.get([ptid]);
  console.log(res);
}

// Data process
function createPatient(ptid) {
  let pt = {
    id: ptid,
    rbc: [],
    hla: [],
    lastUpdate: Date.now(),
  };

  return pt;
}

// Click events
function cbg1_0Click(event) {
  let pt = getPatient();
  if (pt == "") {
    alert("請先選擇病人");
    event.preventDefault();
    return;
  }
}

function btn_saveClick(event) {
  event.preventDefault();
}

// Modify UI
function insertClickEvents() {
  document.getElementById("cbg1_0").addEventListener("click", (event) => {
    cbg1_0Click(event);
  });
  document.getElementById("btn_save").addEventListener("click", (event) => {
    btn_saveClick(event);
  });
}
