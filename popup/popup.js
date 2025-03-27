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

document.querySelectorAll(".del-btn").forEach(button => {
  button.addEventListener("click", function () {
      this.parentElement.remove(); // Remove the parent div
  });
});

document.getElementById("save-phrase").addEventListener("click", ()=>{
  phrases = Array()
  document.querySelector(".quick-phrase").querySelectorAll(".option").forEach(e => {
    phrases.push(e.innerText);
  })

  updateQuickPhrases(phrases);
})

document.getElementById("new-btn").addEventListener("click", ()=>{
  phrase_ele = document.getElementById("new-phrase");
  phrase = phrase_ele.value.trim();
  if(phrase==="") {
    phrase_ele.select();
    return;
  }

  quick_phrases_html = document.getElementsByClassName("quick-phrase")[0];

  for(let e of quick_phrases_html.getElementsByClassName("option")) {
    console.log(e.innerText);
    if(e.innerText === phrase) {
      phrase_ele.select();
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
  phrase_ele.select();
})

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
  show_quick_phrase();
}

function turnOff() {
  chrome.storage.sync.set({ ["deactivate"]: true });
  document.getElementById("status").innerText = "休息中.....";
  document.getElementById("isActivate").checked = false;
  hide_quick_phrase();
}

function hide_quick_phrase() {
  document.getElementById("quick-phrase-box").classList.add("hide")
}

function show_quick_phrase() {
  document.getElementById("quick-phrase-box").classList.remove("hide")
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
