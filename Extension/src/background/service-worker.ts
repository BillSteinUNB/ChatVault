/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
  console.log('ChatVault Extension Installed');
  // Initialize storage if needed
  chrome.storage.local.get(null, (result) => {
    if (Object.keys(result).length === 0) {
      chrome.storage.local.set({
        installedAt: Date.now(),
        settings: {
          theme: 'system',
          autoSave: true
        }
      });
    }
  });
});

// Allow opening side panel from action click if configured
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Message handling example
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ type: 'PONG' });
  }
});
