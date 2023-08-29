const queryBldSupOrdMList_api =
  getOrigin() + "/tbsf-api/bs/bldSupOrdMService/queryBldSupOrdMList";
const checkEDI_api = getOrigin() + "/tbsf-api/bs/bldSupOrdMService/checkEDI";

buildPluginStatus();

// Server methods
function getOrigin() {
  return document.location.origin;
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
