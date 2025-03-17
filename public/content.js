// content.js

console.log("Content script loaded"); // Debug log

function sendToBackground(text) {
  try {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime
        .sendMessage({
          type: "UPDATE_CLIPBOARD",
          text: text,
        })
        .catch((error) => {
          // Handle any runtime errors silently
          console.log("Failed to send message:", error);
        });
    }
  } catch (error) {
    console.log("Runtime not available:", error);
  }
}

function handleCopyEvent() {
  setTimeout(async () => {
    try {
      // Try to get selected text first
      const selectedText = window.getSelection()?.toString().trim();
      if (selectedText) {
        sendToBackground(selectedText);
        return;
      }

      // Fallback to clipboard API
      const text = await navigator.clipboard.readText();
      if (text) {
        sendToBackground(text);
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  }, 100);
}

// Listen for copy events
document.addEventListener("copy", handleCopyEvent);

// Listen for keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "c") {
    handleCopyEvent();
  }
});

// Alternative method using execCommand
document.addEventListener("selectionchange", () => {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    console.log("Selection detected:", selection); // Debug log
  }
});

// Notify that content script is running
chrome.runtime.sendMessage({
  type: "CONTENT_SCRIPT_LOADED",
  message: "Content script is running",
});
