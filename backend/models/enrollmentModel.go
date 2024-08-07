package models

import (
	"gorm.io/gorm"
)

type Enrollment struct {
	gorm.Model
	StudentID uint
	Student   Student `gorm:"foreignKey:StudentID"`
	CourseID  uint
	Course    Course `gorm:"foreignKey:CourseID"`
	// StartDate time.Time
	// EndDate   time.Time
	Status string
}
