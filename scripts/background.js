chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      chrome.notifications.create("installNotification", {
        type: "basic",
        iconUrl: "../icons/icon.png", 
        title: "血庫小精靈已安裝成功",
        message: "感謝使用血庫小精靈。本擴充套件與台灣血液基金會無關，請謹慎使用。若有任何問題，請聯繫本套件之作者",
      });
    }
  });