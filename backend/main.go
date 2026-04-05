package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Load .env file if it exists (it might fail in some deployment environments and that's okay, we'll try to load it first)
	_ = godotenv.Load()

	// Initialize the Database
	InitDB()

	// Initialize Auth (JWT Key)
	InitAuth()

	// Set up REST Router
	mux := http.NewServeMux()

	// Open Endpoint
	mux.HandleFunc("/api/login", LoginHandler)

	// Protected Endpoint using AuthMiddleware
	mux.HandleFunc("/api/results", AuthMiddleware(ResultsHandler))

	// Get port from environment or fallback to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173", "http://localhost:3000", "*"}, // * is for simplicity in development
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Authorization", "Content-Type"},
	})

	// Wrap Router with CORS middleware
	handler := c.Handler(mux)

	log.Printf("Server running on port %s...\n", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
