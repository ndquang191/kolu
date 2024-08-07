package models

import (
	"gorm.io/gorm"
)

type Question struct {
	gorm.Model
	Name       string     `json:"name" gorm:"unique"`
	Text       string     `json:"text"`
	Difficulty string     `json:"difficulty"`
	TopicID    uint       `json:"topic_id"`
	Topic      Topic      `gorm:"foreignKey:TopicID"`
	TestCases  []Testcase `json:"test_cases" gorm:"foreignKey:QuestionID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
