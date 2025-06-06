window.addEventListener("load", () => {
  

  document.getElementById("isActivate").addEventListener("click", () => {
    const check = document.getElementById("isActivate").checked;
    
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
    const phrases = Array()
    document.querySelector(".quick-phrase").querySelectorAll(".option").forEach(e => {
      phrases.push(e.innerText);
    })

    updateQuickPhrases(phrases);
    editDisable();
    refresh();
  })

  document.getElementById("new-btn").addEventListener("click", ()=>{
    const phraseEle = document.getElementById("new-phrase");
    let phrase = phraseEle.value.trim();
    if(phrase==="") {
      phraseEle.select();
      return;
    }

    insertQuickPhrase(phrase);

    mapDelBtn();
    phraseEle.value = ""
    phraseEle.select();
  })

  // draggable

  const quickPhraseEle = document.querySelector(".quick-phrase");
  let dragEle = null;

  quickPhraseEle.addEventListener("dragstart", (e) => {
    if(e.target.classList.contains("item")) {
      dragEle = e.target;
      dragEle.classList.add("dragging")
      // e.dataTransfer.effectAllowed = 'move';
    }
  })

  quickPhraseEle.addEventListener("dragover", (e)=>{
    e.preventDefault();
    let target = e.target.closest(".item");

    if(target!=dragEle && target && quickPhraseEle.contains(target)) {
      const rect = target.getBoundingClientRect();
      const isBelowHaf = (e.clientY - rect.top) > rect.height /2;

      if(isBelowHaf) {
        target.after(dragEle);
      } else {
        target.before(dragEle);
      }
    }
  })

  quickPhraseEle.addEventListener("drop", (e)=> {
    e.preventDefault();
    if(dragEle){
      dragEle.classList.remove("dragging")
      dragEle = null;
    }
  })


  initExtension();

});


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
  document.getElementsByClassName("quick-phrase")[0].innerHTML="";
  showQuickPhrase();
}

function turnOff() {
  chrome.storage.sync.set({ ["deactivate"]: true });
  document.getElementById("status").innerText = "休息中.....";
  document.getElementById("isActivate").checked = false;
  hideQickPhrase();
}

function insertQuickPhrase(phrase) {
  const quickPhrasesHtml = document.getElementsByClassName("quick-phrase")[0];

  for(let e of quickPhrasesHtml.getElementsByClassName("option")) {
    if(e.innerText === phrase) {
      return
    }
  }
  
  const ele = document.createElement("div");
  ele.className = "horizontal span item";
  ele.setAttribute("draggable", "True");

  const btn = document.createElement("button");
  btn.className="del-btn";
  btn.innerText="-";
  const p = document.createElement("div");
  p.className="option";
  p.innerText = phrase;

  ele.appendChild(btn);
  ele.appendChild(p);

  quickPhrasesHtml.appendChild(ele);
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
    });
    editDisable();
  })
}

function editEnable() {
  document.documentElement.style.setProperty("--del-btn-display", "inline");
  document.documentElement.style.setProperty("--edit-display", "flex");
  document.querySelectorAll(".item").forEach(ele => {
    ele.setAttribute("draggable", "True");
  })
  document.getElementById('edit-btn').classList.add("hide");
  mapDelBtn();
}

function editDisable() {
  document.documentElement.style.setProperty("--del-btn-display", "none");
  document.documentElement.style.setProperty("--edit-display", "none");
  document.querySelectorAll(".item").forEach(ele => {
    ele.setAttribute("draggable", "False");
  })
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
