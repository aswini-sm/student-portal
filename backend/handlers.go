package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

// LoginHandler handles POST /api/login
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	// Only handle POST requests
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the incoming request (username and password)
	var creds struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	// Decode JSON request body
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var student Student
	// Query the database for the student using the provided username
	err = DB.QueryRow("SELECT id, username, password FROM students WHERE username = $1", creds.Username).Scan(&student.ID, &student.Username, &student.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// Check if the password matches (use bcrypt or whatever method you're using)
	if !CheckPasswordHash(creds.Password, student.Password) {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Generate JWT token
	tokenString, err := GenerateJWT(student.ID, student.Username)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	// Respond with the token
	response := map[string]string{
		"token":    tokenString,
		"username": student.Username,
	}

	// Set response header and return the token
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
