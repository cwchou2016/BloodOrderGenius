buildBtnBatch();

function buildBtnBatch() {
    const btnBatch = document.createElement("label");
    btnBatch.setAttribute("id", "btn_batch");
    btnBatch.setAttribute("class", "btn btn-save");
    btnBatch.innerText = "批次確認及下載EDI";
  
    document.getElementById("submit").parentElement.appendChild(btnBatch);
  
    btnBatch.addEventListener("click", ()=>{});
  }