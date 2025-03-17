import React, { useState, useEffect } from "react";

interface ClipboardItem {
  text: string;
  timestamp: number;
}

const SmartClipboard: React.FC = () => {
  const [clipboard, setClipboard] = useState<ClipboardItem[]>([]);
  const [search, setSearch] = useState<string>("");

  // Poll clipboard every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && !clipboard.some((item) => item.text === text)) {
          setClipboard((prevClipboard) => [
            { text, timestamp: Date.now() },
            ...prevClipboard,
          ]);
        }
      } catch (error) {
        console.error("Clipboard access error:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [clipboard]);

  // Load from local storage on mount
  useEffect(() => {
    const savedClipboard: ClipboardItem[] = JSON.parse(
      localStorage.getItem("clipboard") || "[]"
    );
    setClipboard(savedClipboard);
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("clipboard", JSON.stringify(clipboard));
  }, [clipboard]);

  // Copy text to clipboard
  const handleCopy = async () => {
    try {
      if ("clipboard" in navigator) {
        const text = await navigator.clipboard.readText();
        if (text && !clipboard.some((item) => item.text === text)) {
          setClipboard([{ text, timestamp: Date.now() }, ...clipboard]);
        }
      } else {
        const textarea = document.createElement("textarea");
        document.body.appendChild(textarea);
        textarea.focus();
        document.execCommand("paste");
        const text = textarea.value;
        document.body.removeChild(textarea);
        if (text && !clipboard.some((item) => item.text === text)) {
          setClipboard([{ text, timestamp: Date.now() }, ...clipboard]);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Clipboard access is restricted. Try granting permissions.");
    }
  };

  // Auto-delete items after 24 hours (86400000 milliseconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const oneDayAgo = Date.now() - 86400000; // 24 hours in milliseconds
      setClipboard((prev) => prev.filter((item) => item.timestamp > oneDayAgo));
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Filter clipboard history
  const filteredClipboard = clipboard.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 min-w-[400px] mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Smart Clipboard Manager</h2>
      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4"
      >
        Copy from Clipboard
      </button>
      <input
        type="text"
        placeholder="Search clipboard..."
        className="w-full p-2 mb-4 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {filteredClipboard.length > 0 ? (
          filteredClipboard.map((item, index) => (
            <li
              key={index}
              className="p-2 border-b cursor-pointer hover:bg-gray-200"
              onClick={() => navigator.clipboard.writeText(item.text)}
            >
              {item.text}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No clipboard history</p>
        )}
      </ul>
    </div>
  );
};

export default SmartClipboard;
