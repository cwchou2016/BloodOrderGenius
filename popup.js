document.getElementById("isActivate").addEventListener("click", () => {
  let check = document.getElementById("isActivate").checked;
  if (check) {
    document.getElementById("status").innerText = "血庫小精靈工作中......";
  } else {
    document.getElementById("status").innerText = "休息中.....";
  }
});
