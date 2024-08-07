package models

import (
	"gorm.io/gorm"
)

type Course struct {
	gorm.Model
	Name        string
	Description string
	TopicID     uint
	Topic       Topic
	TeacherID   uint
	Teacher     Admin
	Semester    string
	Year        string
	Enrollments []Enrollment
}
