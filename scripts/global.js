const queryBldSupOrdMList_api =
  getOrigin() + "/tbsf-api/bs/bldSupOrdMService/queryBldSupOrdMList";
const checkEDI_api = getOrigin() + "/tbsf-api/bs/bldSupOrdMService/checkEDI";
const downloadEDI_api =
  getOrigin() + "/tbsf-api/bs/bldSupOrdMService/downloadEDI";
const confirm_api = getOrigin() + "/tbsf-api/bs/bldSupOrdMService/confirm";
const checkToken_api = getOrigin() + "/tbsf-api/check_token";

// Server methods
function getOrigin() {
  return document.location.origin;
}

async function isTokenValid() {
  response = await fetch(checkToken_api, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `access_token=${getToken()}`,
  });

  let data = await response.json();

  return data["statusCode"] == "1009";
}

function getToken() {
  let cookies = document.cookie.split(";");
  for (let c of cookies) {
    c = c.trim();
    value = c.split("=");
    if (value[0] == "hos_tk_id") {
      return `${value[1]}`;
    }
  }
}

async function queryOrder(orderNumber = "") {
  let payload = {
    bagNoType: 1,
    bldSupOrdNo: orderNumber,
    bldSupOrdShipDate: "",
    bldSupOrdStatus: "",
    iDisplayStart: 0,
    iDisplayLength: 10,
  };

  response = await fetch(queryBldSupOrdMList_api, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization: `bearer ${getToken()}`,
    },
    body: new URLSearchParams(payload).toString(),
  });

  let data = await response.json();
  return data["responseData"];
}

async function confirmOrder(orderNumber) {
  let payload = `pkAk=${orderNumber}`;

  response = await fetch(confirm_api, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization: `bearer ${getToken()}`,
    },
    body: payload,
  });
  let data = await response.json();
  return data;
}
async function checkEDI(orderNumber) {
  let payload = {
    bldSupOrdNo: orderNumber,
  };

  response = await fetch(checkEDI_api, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization: `bearer ${getToken()}`,
    },
    body: new URLSearchParams(payload).toString(),
  });

  data = await response.json();
  return data["responseData"]["isCut"];
}

function getEdiLink(orderNumber) {
  let para = `?bldSupOrdNo=${orderNumber}&access_token=${getToken()}`;
  return `${downloadEDI_api}${para}`;
}

// Modify UI events
function buildPluginStatus() {
  const statusDiv = document.createElement("div");
  statusDiv.setAttribute("id", "plugin_status");
  statusDiv.innerHTML = "<label>血庫小精靈工作中....</label>";
  document.body.appendChild(statusDiv);

  statusDiv.addEventListener("click", () => hideStatus());
}

function hideStatus() {
  const statusDiv = document.getElementById("plugin_status");
  statusDiv.className = "hide";
  setTimeout(() => {
    statusDiv.className = "";
  }, 1000);
}

function buildQuickNotes(textarea) {
  let dropdownDiv = document.createElement('div');
  dropdownDiv.className = "dropdown";
  
  let dropdownBtn = document.createElement('a');
  dropdownBtn.className = 'btn-del dropbtn';
  dropdownBtn.innerText = '快速輸入';

  let dropdownContent = document.createElement("div");
  dropdownContent.className = "dropdown-content";

  let phrases = ["string1","string2","string3"];

  for(let p of phrases){
    let element = document.createElement('a');
    element.innerText = p;
    element.addEventListener("click", (e)=> {
      textarea.value += e.target.innerText;
      textarea.focus();
    })

    dropdownContent.appendChild(element);
  }

  dropdownDiv.appendChild(dropdownBtn);
  dropdownDiv.appendChild(dropdownContent);

  textarea.parentNode.appendChild(dropdownDiv);
}

// Other

function sleep(s) {
  return new Promise((resolve) => {
    setTimeout(resolve, s);
  });
}

async function isExtensionOff() {
  let data = await chrome.storage.sync.get(["deactivate"]);
  return data["deactivate"];
}

function formatDateTime(date) {
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let day = date.getDate();
  let h = `0${date.getHours()}`.slice(-2);
  let m = `0${date.getMinutes()}`.slice(-2);
  return `${year}/${month}/${day} ${h}:${m}`;
}