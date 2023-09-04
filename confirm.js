window.addEventListener("load", async () => {
  if (await getExtensionActivation()) {
    buildPluginStatus();
    buildBtnBatch();
  }
});

// Other functions

function getAllOrderNumber() {
  const elements = document.getElementsByClassName("btn-del");
  let numbers = [];
  for (let e of elements) {
    numbers.push(e.getAttribute("value"));
  }
  return numbers;
}

async function verifyOrder(orderNumber) {
  let result = await queryOrder(orderNumber);
  if (result["totalCount"] != 1) {
    return false;
  }
  return true;
}

async function getOrderStatus(orderNumber) {
  let result = await queryOrder(orderNumber);

  result = result["results"][0];

  if (result["bldSupOrdNo"] != orderNumber) {
    throw "Order number is not match with result";
  }

  return result["bldSupOrdStatus"];
}

async function confirmDownloadOrder(orderNumber) {
  updateStatusInfo(orderNumber, "......");

  // check order in list
  if (!(await verifyOrder(orderNumber))) {
    updateStatusInfo(orderNumber, "無此訂單");
    updateDownloadInfo(orderNumber, "無法下載");
    updateLinkInfo(orderNumber, "-");
    return;
  }

  // check order is cut
  if (await checkEDI(orderNumber)) {
    updateStatusInfo(orderNumber, "血品召回, 無法確認");
    updateDownloadInfo(orderNumber, "無法下載");
    updateLinkInfo(orderNumber, "-");
    return;
  }

  // order status on server
  let msg = await getOrderStatus(orderNumber);
  updateStatusInfo(orderNumber, msg);

  console.log(orderNumber, msg);
  if (msg == "已供出") {
    // confirm order
    responseData = await confirmOrder(orderNumber);
    if (responseData["statusCode"] != "900") {
      console.log(responseData);
      updateStatusInfo(orderNumber, "確認失敗");
      updateDownloadInfo(orderNumber, "無法下載");
      updateLinkInfo(orderNumber, "-");
      return;
    }
    updateStatusInfo(orderNumber, "已確認");
  } else if (msg != "領血確認") {
    updateDownloadInfo(orderNumber, "無法下載");
    updateLinkInfo(orderNumber, "-");
    return;
  }

  //build button and download
  updateDownloadInfo(orderNumber, "下載中");
  let url = getEdiLink(orderNumber);
  let btn = creatEdiDownloadBtn(url);
  updateLinkInfo(orderNumber, btn.outerHTML);
  btn.click();
  updateDownloadInfo(orderNumber, "已下載");
}

// Button click events

function addBtnClick() {
  const numEle = document.getElementById("bloodOutInp");

  if (getAllOrderNumber().includes(numEle.value)) {
    numEle.select();
    numEle.focus();
    return;
  }

  if (numEle.value.toString().length != 18) {
    alert(`${numEle.value} 格式錯誤`);
    numEle.select();
    numEle.focus();
    return;
  }

  addRow(numEle.value);
  numEle.value = "";
  numEle.focus();
  document.getElementById("btnStart").classList.remove("disabled");
}

async function btnStartClick() {
  const btnStart = document.getElementById("btnStart");
  btnStart.innerText = "處理中....";
  btnStart.classList.add("disabled");

  // ignore completed
  let toDoList = [];
  for (let n of getAllOrderNumber()) {
    if (document.getElementById(`status_${n}`).innerText == "") {
      toDoList.push(n);
    }
  }

  for (let n of toDoList) {
    await confirmDownloadOrder(n);
    await sleep(2000);
  }

  btnStart.innerText = "批次確認及下載EDI";
  btnStart.classList.remove("disabled");
}

// Modify UI events

function buildBtnBatch() {
  const btnBatch = document.createElement("label");
  btnBatch.setAttribute("id", "btn_batch");
  btnBatch.setAttribute("class", "btn btn-save");
  btnBatch.innerText = "批次確認及下載EDI";

  document.getElementById("submit").parentElement.appendChild(btnBatch);

  btnBatch.addEventListener("click", () => {
    buildBatchContent();
  });
}

function buildBatchContent() {
  const c = document.getElementById("queryResultBox");
  const p = document.getElementsByClassName("pager")[0];

  c.innerHTML = `
      <div id="bodyDiv">
        <div class="batch" id="inputDiv">
          <label>請輸入供血單號：</label>
          <input type="text" class="form-control" name="bloodOutInp" id="bloodOutInp" maxlength="20"/>
          <label  type="button" class="btn btn-send" id="btnAdd">加入</label>
        </div>
          <table class="form" id="tableBatch">
            <tr>
              <th name="delColumn">刪除</th>
              <th name="numColumn">供血單號</th>
              <th name="statusColumn">確認狀態</th>
              <th name="downloadColumn">下載狀態</th>
              <th name="linkColumn">下載連結</th>
            </tr>
  
            <!-- new code generated here-->
  
          </table>
        <div class="batch">
  
        <label class="btn btn-save disabled" id="btnStart">批次確認及下載EDI</label>
  
        </div>
  
      </div>`;

  p.childNodes.forEach((node) => {
    node.innerHTML = "";
  });

  document.getElementById("btnAdd").addEventListener("click", () => {
    addBtnClick();
  });
  document.getElementById("btnStart").addEventListener("click", () => {
    btnStartClick();
  });

  document.getElementById("bloodOutInp").addEventListener(
    "keydown",
    (event) => {
      if (event.key == "Enter") {
        event.preventDefault();
        addBtnClick();
      }
    },
    true
  );

  document.getElementById("bloodOutInp").focus();
}

function addRow(bloodOutNumber) {
  const tr = document.createElement("tr");
  tr.setAttribute("id", `row_${bloodOutNumber}`);

  tr.innerHTML = `
      <td><label class="btn btn-del" id="del_${bloodOutNumber}" value="${bloodOutNumber}")">刪</label></td>\
      <td>${bloodOutNumber}</td>\
      <td name="statusColumn" id="status_${bloodOutNumber}"></td>\
      <td name="downloadColumn" id="download_${bloodOutNumber}"></td>\
      <td name="linkColumn" id="link_${bloodOutNumber}"></td>\
        `;

  document.getElementById("tableBatch").appendChild(tr);

  document
    .getElementById(`del_${bloodOutNumber}`)
    .addEventListener("click", () => {
      removeRow(bloodOutNumber);
      document.getElementById("bloodOutInp").focus();
    });
}

function removeRow(bloodOutNumber) {
  const ele = document.getElementById(`row_${bloodOutNumber}`);
  ele.remove();
}

function creatEdiDownloadBtn(href) {
  const link = document.createElement("a");
  link.setAttribute("class", "btn btn-cancel download-link");
  link.innerText = "手動下載";
  link.href = href;
  return link;
}

function updateStatusInfo(bloodOutNumber, info = "") {
  const ele = document.getElementById(`status_${bloodOutNumber}`);
  ele.innerHTML = info;
}

function updateDownloadInfo(bloodOutNumber, info = "") {
  const ele = document.getElementById(`download_${bloodOutNumber}`);
  ele.innerHTML = info;
}

function updateLinkInfo(bloodOutNumber, info = "") {
  const ele = document.getElementById(`link_${bloodOutNumber}`);
  ele.innerHTML = info;
}
