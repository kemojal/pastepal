import { useState, useEffect } from "react";
import "./App.css";
import {
  ShowWindow,
  HideWindow,
  ToggleWindowVisibility,
} from "../wailsjs/go/main/App";
import * as runtime from "../wailsjs/runtime";

// Import icons
const ClipboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
  </svg>
);

const HistoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
  </svg>
);

const PinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z" />
  </svg>
);

interface ClipboardItem {
  id: number;
  content: string;
  timestamp: string;
  source: string;
  pinned?: boolean;
}

type Tab = "all" | "pinned" | "settings";

function App() {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([
    // Sample data for UI development
    {
      id: 1,
      content: "Sample clipboard text 1",
      timestamp: new Date().toLocaleString(),
      source: "TextEdit",
      pinned: false,
    },
    {
      id: 2,
      content: "Another clipboard item with different content",
      timestamp: new Date().toLocaleString(),
      source: "Chrome",
      pinned: true,
    },
    {
      id: 3,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      timestamp: new Date().toLocaleString(),
      source: "Terminal",
      pinned: false,
    },
  ]);

  useEffect(() => {
    // Set up keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Alt+P to toggle window
      if (e.ctrlKey && e.altKey && e.key === "p") {
        // Send event to backend
        runtime.EventsEmit("toggleWindow");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const updateSearchText = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  // Filter clipboard items based on search and active tab
  const filteredItems = clipboardItems.filter((item) => {
    const matchesSearch =
      item.content.toLowerCase().includes(searchText.toLowerCase()) ||
      item.source.toLowerCase().includes(searchText.toLowerCase());

    if (activeTab === "pinned") {
      return matchesSearch && item.pinned;
    }

    return matchesSearch;
  });

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

  const togglePin = (id: number) => {
    setClipboardItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      )
    );
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

      <nav className="navigation">
        <button
          className={`nav-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <ClipboardIcon />
          <span>All Items</span>
        </button>
        <button
          className={`nav-button ${activeTab === "pinned" ? "active" : ""}`}
          onClick={() => setActiveTab("pinned")}
        >
          <PinIcon />
          <span>Pinned</span>
        </button>
        <button
          className={`nav-button ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <SettingsIcon />
          <span>Settings</span>
        </button>
      </nav>

      <main className="clipboard-list">
        {activeTab !== "settings" ? (
          filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`clipboard-item ${item.pinned ? "pinned" : ""}`}
              >
                <div
                  className="clipboard-content"
                  onClick={() => copyToClipboard(item.content)}
                >
                  {item.content}
                </div>
                <div className="clipboard-meta">
                  <span className="clipboard-source">{item.source}</span>
                  <span className="clipboard-timestamp">{item.timestamp}</span>
                </div>
                <div className="clipboard-actions">
                  <button
                    className="action-button pin-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(item.id);
                    }}
                  >
                    <PinIcon />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No clipboard items found</div>
          )
        ) : (
          <div className="settings-panel">
            <h2>Settings</h2>
            <div className="setting-item">
              <label>
                <input type="checkbox" defaultChecked={true} />
                Start PastePal at login
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input type="checkbox" defaultChecked={true} />
                Show in menu bar
              </label>
            </div>
            <div className="setting-item">
              <label>History retention:</label>
              <select defaultValue="30">
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
            </div>
            <div className="setting-item">
              <label>
                <input type="checkbox" defaultChecked={false} />
                Store sensitive data (passwords, credit cards)
              </label>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="status">{clipboardItems.length} items in history</div>
        <div className="version">v1.0.0</div>
      </footer>
    </div>
  );
}

export default App;
