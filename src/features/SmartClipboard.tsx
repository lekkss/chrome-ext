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
    <div className="p-6 min-w-[400px] bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Clipboard History
        </h2>
        <button
          onClick={handleCopy}
          className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Refresh
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search in clipboard..."
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {filteredClipboard.length > 0 ? (
          <ul className="space-y-2">
            {filteredClipboard.map((item, index) => (
              <li
                key={index}
                className="group relative p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200"
                onClick={() => navigator.clipboard.writeText(item.text)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p className="text-gray-700 break-all line-clamp-2">
                      {item.text}
                    </p>
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="p-2 hover:bg-blue-100 rounded-full"
                      title="Copy to clipboard"
                    >
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-lg font-medium">No clipboard history</p>
            <p className="text-sm">Copy some text to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartClipboard;
