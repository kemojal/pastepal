import { useState, useEffect } from "react";
import "./App.css";
import {
  ShowWindow,
  HideWindow,
  ToggleWindowVisibility,
} from "../wailsjs/go/main/App";

interface ClipboardItem {
  id: number;
  content: string;
  timestamp: string;
  source: string;
}

function App() {
  const [searchText, setSearchText] = useState("");
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([
    // Sample data for UI development
    {
      id: 1,
      content: "Sample clipboard text 1",
      timestamp: new Date().toLocaleString(),
      source: "TextEdit",
    },
    {
      id: 2,
      content: "Another clipboard item with different content",
      timestamp: new Date().toLocaleString(),
      source: "Chrome",
    },
    {
      id: 3,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      timestamp: new Date().toLocaleString(),
      source: "Terminal",
    },
  ]);

  useEffect(() => {
    // Set up keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Alt+P to toggle window
      if (e.ctrlKey && e.altKey && e.key === "p") {
        ToggleWindowVisibility();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const updateSearchText = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  // Filter clipboard items based on search
  const filteredItems = clipboardItems.filter(
    (item) =>
      item.content.toLowerCase().includes(searchText.toLowerCase()) ||
      item.source.toLowerCase().includes(searchText.toLowerCase())
  );

  const copyToClipboard = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };

  return (
    <div id="App" className="clipboard-manager">
      <header className="header">
        <h1>PastePal</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search clipboard history..."
            value={searchText}
            onChange={updateSearchText}
            className="search-input"
          />
        </div>
      </header>

      <main className="clipboard-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="clipboard-item"
              onClick={() => copyToClipboard(item.content)}
            >
              <div className="clipboard-content">{item.content}</div>
              <div className="clipboard-meta">
                <span className="clipboard-source">{item.source}</span>
                <span className="clipboard-timestamp">{item.timestamp}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No clipboard items found</div>
        )}
      </main>

      <footer className="footer">
        <div className="status">{clipboardItems.length} items in history</div>
      </footer>
    </div>
  );
}

export default App;
