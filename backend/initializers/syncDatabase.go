package initalizers

import (
	"github.com/ndquang191/kolu-be/models"
)

func SyncDatabase() {
	DB.AutoMigrate(&models.Student{})
	DB.AutoMigrate(&models.Admin{})
	DB.AutoMigrate(&models.Course{})
	DB.AutoMigrate(&models.Enrollment{})
	DB.AutoMigrate(&models.Language{})
	DB.AutoMigrate(&models.Question{})
	DB.AutoMigrate(&models.LanguageTopic{})
	DB.AutoMigrate(&models.Role{})
	DB.AutoMigrate(&models.Testcase{})
	DB.AutoMigrate(&models.Topic{})
	DB.AutoMigrate(&models.Submission{})

}
