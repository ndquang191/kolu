package models

import (
	"gorm.io/gorm"
)

type Admin struct {
	gorm.Model
	Name     string `json:"name"`
	Email    string `json:"email" gorm:"unique"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
	RoleID   uint   `json:"role_id"`
	Role     Role   `json:"role"`
	Status   string `json:"status"`
}
