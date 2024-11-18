package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	executablePath, _ := os.Executable()
	currentDir := filepath.Dir(executablePath)
	relativePath := "../../render"

	absPath := filepath.Join(currentDir, relativePath)

	fmt.Println("Server listening absPath", absPath)
	// Set the directory to serve static files from
	fs := http.FileServer(http.Dir(absPath))

	// Register the file server handler for the root URL path
	http.Handle("/", fs)

	// Start the server on port 8080
	fmt.Println("Server listening on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
