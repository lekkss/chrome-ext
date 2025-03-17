// background.js

// Initialize badge count on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Smart Clipboard Extension Installed");
  updateBadgeCount();
});

// Helper function to update badge count
function updateBadgeCount() {
  chrome.storage.local.get(["clipboard"], (result) => {
    const count = result.clipboard?.length || 0;
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: "#4B5563" });
  });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message); // Debug log

  if (message.type === "CONTENT_SCRIPT_LOADED") {
    console.log("Content script loaded in tab:", sender.tab?.id);
  }

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

        chrome.storage.local.set({ clipboard }, () => {
          console.log("Clipboard updated:", clipboard); // Debug log
          // Update badge
          chrome.action.setBadgeText({
            text: clipboard.length.toString(),
          });
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
        chrome.storage.local.set({ clipboard: filtered }, () => {
          updateBadgeCount();
        });
      }
    }
  });
}, 60000);

// Listen for storage changes to keep badge in sync
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.clipboard) {
    updateBadgeCount();
  }
});
