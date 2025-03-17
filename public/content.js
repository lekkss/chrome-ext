// content.js

console.log("Content script loaded"); // Debug log

function handleCopyEvent() {
  // Wait a bit for the clipboard to be updated
  setTimeout(async () => {
    try {
      const text = await navigator.clipboard.readText();
      console.log("Copied text:", text); // Debug log

      if (text) {
        chrome.runtime.sendMessage({
          type: "UPDATE_CLIPBOARD",
          text: text,
        });
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  }, 100);
}

// Listen for copy events
document.addEventListener("copy", () => {
  console.log("Copy event detected"); // Debug log
  handleCopyEvent();
});

// Listen for keyboard shortcuts (Ctrl+C or Cmd+C)
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "c") {
    console.log("Keyboard copy detected"); // Debug log
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
