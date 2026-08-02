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
  statusDiv.innerHTML = "<label>☺ 血庫小精靈工作中....</label>";
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

// quick phrases
async function buildQuickNotes(textarea) {
  const btnBar = document.createElement("div");
  btnBar.className = "dropbtn-bar";

  // create quick phrases dropdown button
  let dropdownDiv = document.createElement('div');
  dropdownDiv.className = "dropdown";
  
  let dropdownBtn = document.createElement('a');
  dropdownBtn.className = 'btn-del dropbtn';
  dropdownBtn.innerText = '快速輸入';

  let dropdownContent = document.createElement("div");
  dropdownContent.className = "dropdown-content";

  for(let ele of await createPhraseElements()) {
    ele.addEventListener("click", e =>{
      textarea.value += e.target.innerText + " ";
      textarea.focus();
    })
    dropdownContent.appendChild(ele);
  }

  dropdownDiv.appendChild(dropdownBtn);
  dropdownDiv.appendChild(dropdownContent);

  btnBar.appendChild(dropdownDiv);

  // create date picker button
  const datepickerDiv = document.createElement('div');
  datepickerDiv.className = "dropdown";

  const datePickerBtn = document.createElement('a');
  datePickerBtn.className = "btn-del dropbtn";
  datePickerBtn.setAttribute("id", "datepicker-btn");
  datePickerBtn.innerText = "輸入日期";

  const calendarDiv = document.createElement('div');
  calendarDiv.setAttribute("id", "calendar");
  calendarDiv.className = "calendar";

  datepickerDiv.appendChild(datePickerBtn);
  datepickerDiv.appendChild(calendarDiv);
  btnBar.appendChild(datepickerDiv);


  // show dropdown menu bar
  textarea.parentNode.appendChild(btnBar);

  // jquery should be loaded after the element is created, otherwise it will not work
  $("#calendar").hide();

  $("#calendar").datepicker({
    dateFormat: "mm/dd(DD)",
    changeYear: true,
    changeMonth: true,
    dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
    dayNames: ["日", "一", "二", "三", "四", "五", "六"],
    minDate: new Date(),
    onSelect: function(dateText) {
      textarea.value += " " + dateText;
    }
  });

  $("#datepicker-btn").on("mouseenter", function() {
    $("#calendar").show();
  });

  $("#calendar").on("mouseleave", function() {
    $("#calendar").hide();
  });

  document.addEventListener("click", function(event) {
    if (!datepickerDiv.contains(event.target)) {
      $("#calendar").hide();
    }
  });
}

async function createPhraseElements() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate()+1);

  let phrases = [
    `今天(${formatSimpleDate(today)})`,
    `明天(${formatSimpleDate(tomorrow)})`,
  ];

  phrases.push(...await loadQuickPhrases());

  let phraseElements = Array();
  for(let p of phrases) {
    let element = document.createElement('a');
    element.innerText = p;
    phraseElements.push(element);
  }

  return phraseElements;
}

async function loadQuickPhrases() {
  let data = await chrome.storage.sync.get(['quick_phrases']);
  return data["quick_phrases"];
}
async function updateQuickPhrases(data) {
  await chrome.storage.sync.set({['quick_phrases']: data});
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

function formatSimpleDate(date) {
  let month = date.getMonth()+1;
  let day = date.getDate();
  return `${month}/${day}`;
}