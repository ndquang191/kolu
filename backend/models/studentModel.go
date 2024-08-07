package models

import (
	"time"

	"gorm.io/gorm"
)

type Student struct {
	gorm.Model
	StudentID string `gorm:"unique" json:"student_id" validate:"required"`
	Password  string `gorm:"not null" json:"password"`
	Name      string `gorm:"not null" json:"name"`
	Class     string `gorm:"not null" json:"class"`
	Email     string `gorm:"not null unique" json:"email" validate:"required,email" `
	// RoleID    uint8  `json:"role_id" gorm:"not null;foreignKey:RoleID"`
	DOB    time.Time
	Status string
}
