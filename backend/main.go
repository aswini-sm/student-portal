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

	mux := http.NewServeMux()

	// Routes
	mux.HandleFunc("/api/login", LoginHandler)
	mux.HandleFunc("/api/results", AuthMiddleware(ResultsHandler))

	// Port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// CORS (allow all for now)
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Authorization", "Content-Type"},
	})

	handler := c.Handler(mux)

	log.Printf("Server running on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
