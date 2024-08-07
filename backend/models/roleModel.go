package models

import (
	"gorm.io/gorm"
)

type Role struct {
	gorm.Model
	RoleName    string
	Description string
	Admins      []Admin
}
