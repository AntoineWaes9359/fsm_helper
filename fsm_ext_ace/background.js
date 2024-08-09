chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "openAceEditor",
      title: "Ouvrir avec Ace Editor",
      contexts: ["editable"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "openAceEditor") {
      chrome.tabs.sendMessage(tab.id, { action: 'openAceEditor' });
    }
  });
  