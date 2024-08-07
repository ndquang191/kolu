package models

import (
	"gorm.io/gorm"
)

type Language struct {
	gorm.Model
	Name    string
	Version string
	Topics  []Topic `gorm:"many2many:language_topics;"`
}
