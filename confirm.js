buildBtnBatch();

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

  document.getElementById("btnAdd").addEventListener("click", () => {});
  document.getElementById("btnStart").addEventListener("click", () => {});

  document.getElementById("bloodOutInp").focus();
}
