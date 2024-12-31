window.addEventListener("load", () => {
  initExtension();
});

document.getElementById("isActivate").addEventListener("click", () => {
  let check = document.getElementById("isActivate").checked;
  if (check) {
    turnOn();
  } else {
    turnOff();
  }

  refresh();
});

async function initExtension() {
  let deactivate = await isExtensionOff();
  console.log(deactivate);
  if (deactivate) {
    turnOff();
    return;
  }
  turnOn();
}

function turnOn() {
  chrome.storage.sync.set({ ["deactivate"]: false });
  document.getElementById("status").innerText = "血庫小精靈工作中......";
  document.getElementById("isActivate").checked = true;
}

function turnOff() {
  chrome.storage.sync.set({ ["deactivate"]: true });
  document.getElementById("status").innerText = "休息中.....";
  document.getElementById("isActivate").checked = false;
}

async function refresh() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  let isMatch = tab.url.match(
    /^(https:\/\/(dh\.)?blood\.org\.tw\/hospital\/)(.*)?$/
  );

  if (isMatch) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        location.reload();
      },
    });
  }
}
