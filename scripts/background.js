/**
 * Fetch html content from the Taiwan Blood Foundation website.
 * @returns {Promise<string>} The HTML content of the page.
 * @throws Will throw an error if the HTTP request fails.
 */
async function fetchBloodWebsite() {
    const response = await fetch("https://www.blood.org.tw/");

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const htmlText = await response.text();
    return htmlText;
}


async function loadQuickPhrases() {
  let data = await chrome.storage.sync.get(['quick_phrases']);
  return data["quick_phrases"];
}

async function defaultQuickPhrase() {
  let data = new Array('團供','新鮮 A2 B2 O10','大 小','早上','晚上','洗滌');
  await chrome.storage.sync.set({['quick_phrases']: data});
}


async function getLastVersion() {
  let data = await chrome.storage.local.get(['last_version']) ;
  return data['last_version'];  
}

async function updateLastVersion(version) {
  await chrome.storage.local.set({'last_version':version})
}


chrome.runtime.onInstalled.addListener(async (details) => {
    chrome.notifications.create("installNotification", {
      type: "basic",
      iconUrl: "../icons/icon.png", 
      title: "血庫小精靈已安裝成功",
      message: "感謝使用血庫小精靈。本擴充套件與台灣血液基金會無關，請謹慎使用。若有任何問題，請聯繫本套件之作者",
    });

    const version = chrome.runtime.getManifest().version;
    const lastVersion = await getLastVersion();
    let phrases = await loadQuickPhrases();

    if (version !== lastVersion && phrases === undefined) {
      await defaultQuickPhrase();
      await updateLastVersion(version);
    }
  });


  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "FETCH_INVENTORY") {
      fetchBloodWebsite()
      .then((htmlText) => {
        sendResponse({ok:true,htmlText});
      })
      .catch((error) => {
        console.error("Error fetching blood website:", error);
        sendResponse({ ok: false, error: error.message });
      }); 
    }
    return true
  });