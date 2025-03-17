chrome.runtime.onInstalled.addListener(() => {
  console.log("Smart Clipboard Extension Installed");
  // Initialize badge
  chrome.action.setBadgeText({ text: "0" });
  chrome.action.setBadgeBackgroundColor({ color: "#4B5563" });
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_CLIPBOARD") {
    chrome.storage.local.get(["clipboard"], (result) => {
      let clipboard = result.clipboard || [];

      if (!clipboard.some((item) => item.text === message.text)) {
        clipboard.unshift({
          text: message.text,
          timestamp: Date.now(),
        });

        // Keep only the latest 50 items
        clipboard = clipboard.slice(0, 50);

        chrome.storage.local.set({ clipboard });

        // Update badge
        chrome.action.setBadgeText({
          text: clipboard.length.toString(),
        });
      }
    });
  }
});

// Cleanup old items periodically
setInterval(() => {
  chrome.storage.local.get(["clipboard"], (result) => {
    if (result.clipboard) {
      const oneDayAgo = Date.now() - 86400000; // 24 hours
      const filtered = result.clipboard.filter(
        (item) => item.timestamp > oneDayAgo
      );

      if (filtered.length !== result.clipboard.length) {
        chrome.storage.local.set({ clipboard: filtered });
        chrome.action.setBadgeText({
          text: filtered.length.toString(),
        });
      }
    }
  });
}, 60000); // Check every minute
