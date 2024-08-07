package models

import (
	"gorm.io/gorm"
)

type Testcase struct {
	gorm.Model
	Input          string   `json:"input"`
	ExpectedOutput string   `json:"expected_output"`
	QuestionID     uint     `json:"question_id"`
	Question       Question `json:"-" gorm:"foreignKey:QuestionID"`
}
