package main

import (
	"context"
	"fmt"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx            context.Context
	isWindowVisible bool
	mutex          sync.Mutex
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		isWindowVisible: false,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// ShowWindow shows the main application window
func (a *App) ShowWindow() {
	a.mutex.Lock()
	defer a.mutex.Unlock()
	
	runtime.WindowShow(a.ctx)
	runtime.WindowSetAlwaysOnTop(a.ctx, true)
	a.isWindowVisible = true
}

// HideWindow hides the main application window
func (a *App) HideWindow() {
	a.mutex.Lock()
	defer a.mutex.Unlock()
	
	runtime.WindowHide(a.ctx)
	a.isWindowVisible = false
}

// IsWindowVisible returns whether the window is currently visible
func (a *App) IsWindowVisible() bool {
	a.mutex.Lock()
	defer a.mutex.Unlock()
	
	return a.isWindowVisible
}

// ToggleWindowVisibility toggles the window visibility
func (a *App) ToggleWindowVisibility() {
	if a.IsWindowVisible() {
		a.HideWindow()
	} else {
		a.ShowWindow()
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
