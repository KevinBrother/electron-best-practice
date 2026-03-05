package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

// Data represents the JSON structure
type Data struct {
	Name    string `json:"name"`
	Version string `json:"version"`
	Message string `json:"message"`
}

func main() {
	// Get the directory where the executable is located
	execPath, err := os.Executable()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error getting executable path: %v\n", err)
		os.Exit(1)
	}

	execDir := filepath.Dir(execPath)
	dataPath := filepath.Join(execDir, "data.json")

	// Read the JSON file
	data, err := os.ReadFile(dataPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading data.json: %v\n", err)
		os.Exit(1)
	}

	// Parse JSON to validate
	var parsed Data
	if err := json.Unmarshal(data, &parsed); err != nil {
		fmt.Fprintf(os.Stderr, "Error parsing JSON: %v\n", err)
		os.Exit(1)
	}

	// Output the JSON content (this will be captured by Electron)
	fmt.Print(string(data))
}
