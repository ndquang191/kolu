package models

import (
	"gorm.io/gorm"
)

type Topic struct {
	gorm.Model
	TopicName   string `json:"topic_name" gorm:"unique"`
	Description string `json:"description"`
	Questions   []Question
	Languages   []Language `gorm:"many2many:language_topics;"`
	AdminID     uint       `gorm:"" json:"admin_id"`
	Admin       Admin      `json:"admin" gorm:"foreignKey:AdminID"`

	// AdminID     uint 	`gorm:"" json:"admin_id"`
}
