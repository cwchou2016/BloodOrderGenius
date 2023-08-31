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

// Data process
async function savePatientData(ptid, data) {
  await chrome.storage.local.set({ [ptid]: data });
}

async function loadPatientData(ptid) {
  let res = await chrome.storage.local.get([ptid]);
  console.log(res);
  return res;
}

async function patientNotExist(ptid) {
  let data = await loadPatientData(ptid);
  return Object.keys(data).length == 0;
}

function createPatient(ptid) {
  let pt = {
    id: ptid,
    rbc: [],
    hla: [],
    lastUpdate: Date.now(),
  };

  return pt;
}

async function updateRbc(ptid, rbc) {
  let data = await loadPatientData(ptid);
  data = data[ptid];

  data.rbc = rbc;
  data.lastUpdate = Date.now();
  await savePatientData(ptid, data);
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

async function btn_saveClick(event) {
  event.preventDefault();
  let ptid = getPatient();
  if (ptid == "") return;

  let rbc = getRbcAg();

  // check patient data exist
  if (await patientNotExist(ptid)) {
    await savePatientData(ptid, createPatient(ptid));
  }

  // check cbg1_0
  if (document.getElementById("cbg1_0").checked) {
    await updateRbc(ptid, rbc);
    await loadPatientData(ptid);
  }
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
