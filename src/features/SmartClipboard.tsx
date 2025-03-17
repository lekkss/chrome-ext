/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

interface ClipboardItem {
  text: string;
  timestamp: number;
}

const SmartClipboard: React.FC = () => {
  const [clipboard, setClipboard] = useState<ClipboardItem[]>([]);
  const [search, setSearch] = useState<string>("");

  // Load from chrome storage on mount and listen for changes
  useEffect(() => {
    chrome.storage.local.get(["clipboard"], (result) => {
      if (result.clipboard) {
        setClipboard(result.clipboard);
      }
    });

    const handleStorageChange = (changes: any) => {
      if (changes.clipboard?.newValue) {
        setClipboard(changes.clipboard.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // Modified handleCopy function
  const handleCopy = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        // Send message to background script
        chrome.runtime.sendMessage({
          type: "UPDATE_CLIPBOARD",
          text: text,
        });
      }
    } catch (error) {
      console.error(error);
      alert("Clipboard access is restricted. Try granting permissions.");
    }
  };

  //   useEffect(() => {
  //     handleCopy();
  //   }, []);

  // Modified handleClear function
  const handleClear = () => {
    chrome.storage.local.set({ clipboard: [] });
    chrome.action.setBadgeText({ text: "0" });
  };

  // Filter clipboard history
  const filteredClipboard = clipboard.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase())
  );

  // Add this function inside your SmartClipboard component
  const handleDeleteItem = (text: string) => {
    chrome.storage.local.get(["clipboard"], (result) => {
      const newClipboard = result.clipboard.filter(
        (item: ClipboardItem) => item.text !== text
      );
      chrome.storage.local.set({ clipboard: newClipboard });
      chrome.action.setBadgeText({ text: newClipboard.length.toString() });
    });
  };

  return (
    <div className="p-6 min-w-[400px] bg-white rounded-xl shadow-lg">
      <div className="flex flex-col space-y-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Clipboard History
        </h2>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClear}
            className="flex items-center px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear All
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
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
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search in clipboard...."
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
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
                className="group relative p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div
                    className="flex-1 pr-4 cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(item.text)}
                  >
                    <p className="text-gray-700 break-all line-clamp-2">
                      {item.text}
                    </p>
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="p-2 hover:bg-blue-100 rounded-full"
                      title="Copy to clipboard"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(item.text);
                      }}
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
                    <button
                      className="p-2 hover:bg-red-100 rounded-full"
                      title="Delete item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.text);
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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
