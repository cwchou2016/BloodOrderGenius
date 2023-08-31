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

// Modify UI
function insertClickEvents() {
  document.getElementById("cbg1_0").addEventListener("click", () => {});
}
