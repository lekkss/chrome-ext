chrome.runtime.onInstalled.addListener(() => {
  console.log("Smart Clipboard Extension Installed");
});

async function checkClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    if (!text) return;

    chrome.storage.local.get({ clipboard: [] }, (data) => {
      let clipboard = data.clipboard;

      // Avoid duplicates
      if (!clipboard.some((item) => item.text === text)) {
        clipboard.unshift({ text, timestamp: Date.now() });

        // Keep only the latest 20 clipboard entries
        clipboard = clipboard.slice(0, 20);

        chrome.storage.local.set({ clipboard });
      }
    });
  } catch (error) {
    console.error("Clipboard access error:", error);
  }
}

// Run clipboard check every 2 seconds
setInterval(checkClipboard, 2000);
