insertClickEvents();
buildPluginStatus();

function formatDate(date) {
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  return `${year}/${month}/${day} ${h}:${m}`;
}

function getRbcAg() {
  let rbc = [];
  for (let i = 1; i <= 10; i++) {
    let value = document.getElementById(`select_redBD2_${i}`).value;
    if (value == "") continue;
    rbc.push(value);
  }
  return rbc;
}

function getHla() {
  let keys = [
    "txt_hlaBdType_A1",
    "txt_hlaBdType_A2",
    "txt_hlaBdType_B1",
    "txt_hlaBdType_B2",
    "txt_hlaBdType_C1",
    "txt_hlaBdType_C2",
    "txt_hlaBdType_Bw1",
    "txt_hlaBdType_Bw2",
  ];

  let hla = {};

  for (let k of keys) {
    let value = document.getElementById(k).value;
    if (Number(value) == 0) {
      hla[k] = "";
    } else {
      hla[k] = value;
    }
  }

  return hla;
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
    hla: {},
    rbcLastUpdate: "",
    hlaLastUpdate: "",
  };

  return pt;
}

async function updateRbc(ptid, rbc) {
  let data = await loadPatientData(ptid);
  data = data[ptid];

  data.rbc = rbc;
  data.rbcLastUpdate = formatDate(new Date());
  await savePatientData(ptid, data);
}

async function updateHla(ptid, hla) {
  let data = await loadPatientData(ptid);
  data = data[ptid];
  data.hla = hla;
  data.hlaLastUpdate = formatDate(new Date());
  await savePatientData(ptid, data);
}

// Click events
async function cbg1_0Click(event) {
  let pt = getPatient();
  if (pt == "") {
    alert("請先選擇病人");
    event.preventDefault();
    return;
  }

  // check patient data exist
  if (await patientNotExist(pt)) return;

  let ptData = await loadPatientData(pt);
  let rbc = ptData[pt].rbc;
  let update = ptData[pt].rbcLastUpdate;

  let i = 1;
  for (let ag of rbc) {
    const select = document.getElementById(`select_redBD2_${i}`);
    select.value = ag;
    i += 1;
  }
  document.getElementById(
    "rbcUpdateInfo"
  ).innerText = `資料更新時間：${update}`;
}

async function cbg1_3Click(event) {
  let pt = getPatient();
  if (pt == "") {
    alert("請先選擇病人");
    event.preventDefault();
    return;
  }

  // check patient data exist
  if (await patientNotExist(pt)) return;

  let ptData = await loadPatientData(pt);
  let hla = ptData[pt].hla;
  let update = ptData[pt].hlaLastUpdate;

  for (let k in hla) {
    console.log(k, hla[k]);
    document.getElementById(k).value = hla[k];
  }
  document.getElementById(
    "hlaUpdateInfo"
  ).innerText = `資料更新時間：${update}`;
}

async function btn_saveClick(event) {
  let ptid = getPatient();
  if (ptid == "") return;

  // check patient data exist
  if (await patientNotExist(ptid)) {
    await savePatientData(ptid, createPatient(ptid));
  }

  // check cbg1_0 RBC ag
  if (document.getElementById("cbg1_0").checked) {
    let rbc = getRbcAg();
    await updateRbc(ptid, rbc);
    await loadPatientData(ptid);
  }

  // check cbg1_3 HLA
  if (document.getElementById("cbg1_3").checked) {
    let hla = getHla();
    await updateHla(ptid, hla);
    await loadPatientData(ptid);
  }
}

// Modify UI
function insertClickEvents() {
  const updateInfo = document.createElement("div");
  updateInfo.setAttribute("id", "rbcUpdateInfo");
  updateInfo.classList.add("updateInfo")
  document.getElementById("select_redBD2_group").appendChild(updateInfo);

  const updateInfo2 = document.createElement("div");
  updateInfo2.setAttribute("id", "hlaUpdateInfo");
  updateInfo2.classList.add("updateInfo")
  document.getElementById("txt_hlaBdType_group").appendChild(updateInfo2);

  document.getElementById("cbg1_0").addEventListener("click", (event) => {
    cbg1_0Click(event);
  });
  document.getElementById("cbg1_3").addEventListener("click", (event) => {
    cbg1_3Click(event);
  });
  document.getElementById("btn_save").addEventListener("click", (event) => {
    btn_saveClick(event);
  });
}
