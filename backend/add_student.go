//go:build ignore

package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Load the .env file
	_ = godotenv.Load()
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPass, dbHost, dbPort, dbName)
	
	// Connect to Database
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error opening db: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Could not connect to database! Make sure MySQL is running. \nError: %v", err)
	}

	// Calculate the hash for the requested password
	username := "Aswini_123"
	password := "ashy123"
	
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Error hashing password: %v", err)
	}

	// Insert the Student
	res, err := db.Exec("INSERT INTO students (username, password) VALUES (?, ?)", username, string(hash))
	if err != nil {
		log.Fatalf("Error inserting student: %v. \n(Note: If it says 'Duplicate Entry', that username already exists!)", err)
	}

	// Get the auto-incremented Student ID
	studentID, err := res.LastInsertId()
	if err != nil {
		log.Fatalf("Error getting new student ID: %v", err)
	}

	fmt.Printf("✅ Successfully created student '%s'! (Student ID: %d)\n", username, studentID)

	// Add default marks so the dashboard isn't completely empty!
	_, err = db.Exec("INSERT INTO results (student_id, math, science, english, history, geography) VALUES (?, ?, ?, ?, ?, ?)", studentID, 85, 90, 88, 76, 92)
	if err != nil {
		log.Fatalf("Note: Student was added, but adding results failed: %v", err)
	}

	fmt.Println("✅ Successfully generated exam results for this student!")
	fmt.Println("\n🎉 ALL DONE! You can now log into your React app using:")
	fmt.Printf("Username: %s\nPassword: %s\n", username, password)
}
