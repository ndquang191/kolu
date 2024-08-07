package models

type LanguageTopic struct {
	LanguageID uint `gorm:"primaryKey"`
	TopicID    uint `gorm:"primaryKey"`
}
