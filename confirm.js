buildBtnBatch();

// Button click events

function addBtnClick() {
  console.log("add clicked");
  const numEle = document.getElementById("bloodOutInp");

  if (numEle.value.toString().length < 2) {
    alert(`${numEle.value} 格式錯誤`);
    numEle.select();
    numEle.focus();
    return;
  }

  addRow(numEle.value);
  numEle.value = "";
  numEle.focus();
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
  
        <label type="button" class="btn btn-save" id="btnStart">批次確認及下載EDI</label>
  
        </div>
  
      </div>`;

  p.childNodes.forEach((node) => {
    node.innerHTML = "";
  });

  document.getElementById("btnAdd").addEventListener("click", () => {
    addBtnClick();
  });
  document.getElementById("btnStart").addEventListener("click", () => {});

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
