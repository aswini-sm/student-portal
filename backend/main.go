package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Load .env (works locally, ignored in Render)
	_ = godotenv.Load()

	// Initialize DB
	InitDB()

	// Initialize Auth
	InitAuth()

	// Initialize the mux router
	mux := http.NewServeMux()

	// Register Routes
	mux.HandleFunc("/api/login", LoginHandler)                     // Login Handler for POST /api/login
	mux.HandleFunc("/api/results", AuthMiddleware(ResultsHandler)) // Results with AuthMiddleware

	// Get Port from Environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:5173",                       // Local frontend (dev)
			"http://localhost:3000",                       // Another local frontend (if any)
			"https://student-portal-one-khaki.vercel.app", // Your deployed frontend URL
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true, // Make sure credentials are allowed
	})

	handler := c.Handler(mux)

	// Log the server status and start listening
	log.Printf("Server running on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
