package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

// ====================== LOGIN HANDLER ======================

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body
	var creds struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var student Student

	// ✅ PostgreSQL uses $1 instead of ?
	err = DB.QueryRow(
		"SELECT id, username, password FROM students WHERE username = $1",
		creds.Username,
	).Scan(&student.ID, &student.Username, &student.Password)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// Verify password
	if !CheckPasswordHash(creds.Password, student.Password) {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Generate JWT
	tokenString, err := GenerateJWT(student.ID, student.Username)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"token":    tokenString,
		"username": student.Username,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// ====================== RESULTS HANDLER ======================

func ResultsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get student ID from middleware
	studentID := r.Context().Value("student_id").(int)

	var res Result

	// ✅ PostgreSQL fix ($1)
	err := DB.QueryRow(`
		SELECT id, student_id, math, science, english, history, geography 
		FROM results WHERE student_id = $1`, studentID).
		Scan(&res.ID, &res.StudentID, &res.Math, &res.Science, &res.English, &res.History, &res.Geography)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Results not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// Calculate results
	total := res.Math + res.Science + res.English + res.History + res.Geography
	average := float64(total) / 5.0

	passStatus := "Pass"
	if res.Math < 40 || res.Science < 40 || res.English < 40 || res.History < 40 || res.Geography < 40 {
		passStatus = "Fail"
	}

	finalResponse := ResultResponse{
		Result:     res,
		Total:      total,
		Average:    average,
		PassStatus: passStatus,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(finalResponse)
}
