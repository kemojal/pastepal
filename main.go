package main

import (
	"context"
	"embed"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

// Global application context
var appContext context.Context
var appInstance *App

func main() {
	// Create an instance of the app structure
	app := NewApp()
	appInstance = app

	// Create application menu
	appMenu := createMenu()
	
	// Mac-specific options
	macOptions := &mac.Options{
		TitleBar:             mac.TitleBarHidden(), // Hide title bar
		Appearance:           mac.NSAppearanceNameDarkAqua, // Dark mode
		WebviewIsTransparent: true,
		WindowIsTranslucent:  true, // Translucent window for modern look
		About: &mac.AboutInfo{
			Title:   "PastePal",
			Message: "© 2024 PastePal - Clipboard Manager",
		},
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title:             "PastePal",
		Width:             350,  // Narrower width for menu-style dropdown
		Height:            500,  // Taller to show more clipboard items
		MinWidth:          300,
		MinHeight:         400,
		Frameless:         true, // No window frame for cleaner look
		AlwaysOnTop:       true, // Stay on top of other windows
		BackgroundColour:  &options.RGBA{R: 25, G: 27, B: 33, A: 1}, // Darker background to match the CSS
		DisableResize:     true, // Disable resize for menu-like feel
		Fullscreen:        false,
		StartHidden:       true, // Start hidden as we'll control visibility from the menu
		HideWindowOnClose: true, // Don't quit when window is closed
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: func(ctx context.Context) {
			appContext = ctx // Save context for menu callbacks
			app.startup(ctx)
			
			// Set up keyboard shortcuts
			setupKeyboardShortcuts(ctx)
		},
		OnDomReady: func(ctx context.Context) {
			// Show temporary notification that app is running
			wailsRuntime.MessageDialog(ctx, wailsRuntime.MessageDialogOptions{
				Type:    wailsRuntime.InfoDialog,
				Title:   "PastePal",
				Message: "PastePal is running.\nUse the keyboard shortcut Ctrl+Alt+P to show/hide the window.",
			})
			
			// Position window near the menu bar
			positionWindowBelowMenuBar(ctx)
		},
		Menu: appMenu, // Set application menu
		Mac:  macOptions,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

// setupKeyboardShortcuts registers global keyboard shortcuts
func setupKeyboardShortcuts(ctx context.Context) {
	// Register keyboard shortcuts through the frontend to avoid runtime registration issues
	wailsRuntime.EventsOn(ctx, "toggleWindow", func(optionalData ...interface{}) {
		if appInstance != nil {
			appInstance.ToggleWindowVisibility()
		}
	})
}

// positionWindowBelowMenuBar positions the window below the menu bar
func positionWindowBelowMenuBar(ctx context.Context) {
	// Get screen size
	screenWidth, _ := wailsRuntime.ScreenGetAll(ctx)
	if len(screenWidth) > 0 {
		primaryScreen := screenWidth[0]
		
		// Position at top right of screen, just below menu bar
		menuBarHeight := 22 // Standard macOS menu bar height
		x := primaryScreen.Width - 350 - 20 // 20 pixels from right edge
		y := menuBarHeight + 5 // 5 pixels below menu bar
		
		wailsRuntime.WindowSetPosition(ctx, x, y)
	}
}

// createMenu creates the application menu
func createMenu() *menu.Menu {
	AppMenu := menu.NewMenu()
	
	// Add the application menu (macOS specific)
	if runtime.GOOS == "darwin" {
		AppMenu.Append(menu.AppMenu()) // This adds the standard macOS app menu with app name
	}
	
	// Add the File menu
	FileMenu := AppMenu.AddSubmenu("File")
	FileMenu.AddText("Show Window", keys.CmdOrCtrl("s"), func(_ *menu.CallbackData) {
		if appContext != nil && appInstance != nil {
			appInstance.ShowWindow()
		}
	})
	FileMenu.AddSeparator()
	FileMenu.AddText("Quit", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
		if appContext != nil {
			wailsRuntime.Quit(appContext)
		}
	})
	
	// Add the Edit menu with standard macOS edit functionality
	if runtime.GOOS == "darwin" {
		AppMenu.Append(menu.EditMenu()) // This enables standard keyboard shortcuts like copy/paste
	} else {
		// For other platforms, add custom edit menu
		EditMenu := AppMenu.AddSubmenu("Edit")
		EditMenu.AddText("Copy", keys.CmdOrCtrl("c"), nil)
		EditMenu.AddText("Paste", keys.CmdOrCtrl("v"), nil)
	}
	
	// Add the PastePal menu with app-specific actions
	PastepalMenu := AppMenu.AddSubmenu("PastePal")
	PastepalMenu.AddText("Show Clipboard History", keys.Combo("p", keys.ControlKey, keys.OptionOrAltKey), func(_ *menu.CallbackData) {
		if appContext != nil && appInstance != nil {
			appInstance.ShowWindow()
		}
	})
	PastepalMenu.AddSeparator()
	
	// Recently copied items submenu
	RecentMenu := PastepalMenu.AddSubmenu("Recent Items")
	RecentMenu.AddText("(No recent items)", nil, nil)
	
	// History management submenu
	HistoryMenu := PastepalMenu.AddSubmenu("History")
	HistoryMenu.AddText("Clear History", nil, nil)
	HistoryMenu.AddText("Export History", nil, nil)
	
	PastepalMenu.AddSeparator()
	PastepalMenu.AddText("Preferences...", keys.CmdOrCtrl(","), nil)
	
	// Add Help menu
	HelpMenu := AppMenu.AddSubmenu("Help")
	HelpMenu.AddText("Keyboard Shortcuts", nil, func(_ *menu.CallbackData) {
		if appContext != nil {
			wailsRuntime.MessageDialog(appContext, wailsRuntime.MessageDialogOptions{
				Type:    wailsRuntime.InfoDialog,
				Title:   "Keyboard Shortcuts",
				Message: "Ctrl+Alt+P: Show/Hide PastePal\nCmd+S: Show PastePal\nCmd+Q: Quit",
			})
		}
	})
	HelpMenu.AddText("About PastePal", nil, func(_ *menu.CallbackData) {
		if appContext != nil {
			wailsRuntime.MessageDialog(appContext, wailsRuntime.MessageDialogOptions{
				Type:    wailsRuntime.InfoDialog,
				Title:   "About PastePal",
				Message: "PastePal Clipboard Manager v1.0.0",
			})
		}
	})
	
	return AppMenu
}
