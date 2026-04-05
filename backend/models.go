package main

// Credentials struct for parsing login request JSON
type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Student represent the student table from the db
type Student struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"-"` // We don't want to expose passwords to JSON
}

// Result represent the result table from the db
type Result struct {
	ID         int `json:"id"`
	StudentID  int `json:"student_id"`
	Math       int `json:"math"`
	Science    int `json:"science"`
	English    int `json:"english"`
	History    int `json:"history"`
	Geography  int `json:"geography"`
}

// ResultResponse wraps Result with total, average, and pass/fail status
type ResultResponse struct {
	Result
	Total      int     `json:"total"`
	Average    float64 `json:"average"`
	PassStatus string  `json:"pass_status"`
}
