// Initialize badge count on installation and startup
chrome.runtime.onInstalled.addListener(() => {
  console.log("Smart Clipboard Extension Installed");
  updateBadgeCount();
});

// Also update badge when extension starts
chrome.runtime.onStartup.addListener(() => {
  updateBadgeCount();
});

// Helper function to update badge count
function updateBadgeCount() {
  chrome.storage.local.get(["clipboard"], (result) => {
    const count = result.clipboard?.length || 0;
    console.log("Count:", count);
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: "#4B5563" });
  });
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_CLIPBOARD") {
    chrome.storage.local.get(["clipboard"], (result) => {
      let clipboard = result.clipboard || [];

      // Avoid duplicates
      if (!clipboard.some((item) => item.text === message.text)) {
        clipboard.unshift({
          text: message.text,
          timestamp: Date.now(),
        });

        clipboard = clipboard.slice(0, 50); // Keep last 50 items

        chrome.storage.local.set({ clipboard }, () => {
          updateBadgeCount();
          // Send response to confirm update
          sendResponse({ success: true });
        });
      } else {
        sendResponse({ success: true, duplicate: true });
      }
    });

    // Return true to indicate we will send a response asynchronously
    return true;
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
          updateBadgeCount(); // Use the helper function
        });
      }
    }
  });
}, 60000);

// Update badge when storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.clipboard) {
    updateBadgeCount();
  }
});
