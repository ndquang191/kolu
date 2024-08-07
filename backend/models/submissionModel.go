package models

import (
	"gorm.io/gorm"
	"time"
)

type Submission struct {
	gorm.Model
	StudentID      uint      `json:"student_id"`
	Student        Student   `gorm:"foreignKey:StudentID"`
	QuestionID     uint      `json:"question_id"`
	Question       Question  `gorm:"foreignKey:QuestionID"`
	Answer         string    `json:"answer"`
	Score          uint      `json:"score"`
	SubmissionDate time.Time `json:"submission_date"`
	Status         string    `json:"status"`
}
