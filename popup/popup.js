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

document.getElementById("edit-btn").addEventListener("click", ()=> {
  editEnable();
})

document.getElementById("save-btn").addEventListener("click", ()=>{
  phrases = Array()
  document.querySelector(".quick-phrase").querySelectorAll(".option").forEach(e => {
    phrases.push(e.innerText);
  })

  updateQuickPhrases(phrases);
  editDisable();
})

document.getElementById("new-btn").addEventListener("click", ()=>{
  phrase_ele = document.getElementById("new-phrase");
  phrase = phrase_ele.value.trim();
  if(phrase==="") {
    phrase_ele.select();
    return;
  }

  insertQuickPhrase(phrase);

  mapDelBtn();
  phrase.value = ""
  phrase_ele.select();
})

async function initExtension() {
  editDisable();
  let version = chrome.runtime.getManifest().version;

  document.getElementById("version").innerText=`v${version}`

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
  showQuickPhrase();
}

function turnOff() {
  chrome.storage.sync.set({ ["deactivate"]: true });
  document.getElementById("status").innerText = "休息中.....";
  document.getElementById("isActivate").checked = false;
  hideQickPhrase();
}

function insertQuickPhrase(phrase) {
  quick_phrases_html = document.getElementsByClassName("quick-phrase")[0];

  for(let e of quick_phrases_html.getElementsByClassName("option")) {
    console.log(e.innerText);
    if(e.innerText === phrase) {
      return
    }
  }
  
  ele = document.createElement("div");
  ele.className = "horizontal span";
  btn = document.createElement("button");
  btn.className="del-btn";
  btn.innerText="-";
  p = document.createElement("div");
  p.className="option";
  p.innerText = phrase;

  ele.appendChild(btn);
  ele.appendChild(p);

  quick_phrases_html.appendChild(ele);
}

function mapDelBtn() {
  document.querySelectorAll(".del-btn").forEach(button => {
    button.addEventListener("click", function () {
        this.parentElement.remove(); // Remove the parent div
    });
});
}

function hideQickPhrase() {
  document.getElementById("quick-phrase-box").classList.add("hide");
}

function showQuickPhrase() {
  document.getElementById("quick-phrase-box").classList.remove("hide");
  loadQickPhrases().then(arr => {
    arr.forEach(t => {
      b = insertQuickPhrase(t)
    })
  })
}

function editEnable() {
  document.documentElement.style.setProperty("--del-btn-display", "inline");
  document.documentElement.style.setProperty("--edit-display", "flex");

  document.getElementById('edit-btn').classList.add("hide");
  mapDelBtn();
}

function editDisable() {
  document.documentElement.style.setProperty("--del-btn-display", "none");
  document.documentElement.style.setProperty("--edit-display", "none");

  document.getElementById('edit-btn').classList.remove("hide");
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
