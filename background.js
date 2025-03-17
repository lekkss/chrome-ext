// Store clipboard items in extension storage
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "NEW_CLIPBOARD_CONTENT") {
    chrome.storage.local.get(["clipboardHistory"], (result) => {
      const history = result.clipboardHistory || [];
      const newItem = {
        id: Date.now().toString(),
        text: request.text,
        timestamp: Date.now(),
      };

      // Avoid duplicates
      if (!history.some((item) => item.text === request.text)) {
        chrome.storage.local.set({
          clipboardHistory: [newItem, ...history],
        });
      }
    });
  }
});
