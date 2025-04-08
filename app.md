📌 Clipboard Manager with Search & History
App Summary:A lightweight macOS menu bar app that tracks clipboard history with timestamps and app source, searchable and optionally synced/exported.

🔧 Core Features:

1. Menu Bar Integration
   - Quick-access icon.
   - Dropdown UI with recent clipboard entries.
2. Clipboard History
   - Tracks plain text (optionally rich text, images).
   - Timestamp and app origin (via NSWorkspace).
3. Searchable UI
   - Real-time fuzzy search.
   - Keyboard shortcuts to paste previous clippings.
4. Export / iCloud Sync
   - Save/export clipboard logs as .txt or .json.
   - Optional iCloud sync with Core Data + CloudKit.

Bonus Ideas:
Pin frequently used clippings.

Dark mode & theming.

Regex filtering.

Clipboard item preview (text, image, etc.).

Auto-clear sensitive info (passwords, etc.).

## Implementation Plan for PastePal

### Branch 1: Setup Menu Bar Integration

- Configure Wails app to run as a menu bar application instead of a window
- Implement basic menu bar icon functionality
- Create dropdown UI skeleton
- Add basic navigation and layout components

### Branch 2: Core Clipboard Monitoring

- Implement clipboard monitoring service in Go
- Create basic storage mechanism for clipboard history
- Add timestamp recording
- Implement app origin detection via NSWorkspace

### Branch 3: UI for Clipboard History

- Create clipboard history list component
- Design and implement list item UI with timestamps
- Add source app information display
- Implement basic pagination/scrolling for history items

### Branch 4: Search Functionality

- Add search input component
- Implement real-time fuzzy search logic
- Create search results display
- Add keyboard navigation for search results

### Branch 5: Keyboard Shortcuts

- Implement global keyboard shortcut handling
- Add shortcuts for accessing menu
- Create shortcuts for pasting previous clippings
- Add configuration UI for custom shortcuts

### Branch 6: Export and Backup

- Implement export functionality (.txt and .json formats)
- Add export UI controls
- Create file saving dialogs and logic
- Add backup/restore functionality

### Branch 7: iCloud Sync (Optional)

- Set up Core Data + CloudKit integration
- Implement sync logic
- Add sync status indicators
- Create conflict resolution handling

### Branch 8: Bonus Features

- Implement pinned clippings
- Add dark mode & theming support
- Implement regex filtering for advanced searches
- Create previews for different content types
- Add sensitive information detection and auto-clearing

### Branch 9: Settings and Preferences

- Create settings UI
- Implement preference saving
- Add startup configuration
- Implement retention policy settings

### Branch 10: Polishing and Optimization

- Performance optimizations
- UI/UX refinements
- Error handling improvements
- Add logging for diagnostics
