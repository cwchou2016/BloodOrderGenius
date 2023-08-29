buildPluginStatus();

// Server events
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
