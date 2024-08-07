package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	initializers "github.com/ndquang191/kolu-be/initializers"
	models "github.com/ndquang191/kolu-be/models"
)

func GetTestcaseByQuestionID(c *gin.Context) {
	questionID := c.Param("question_id")
	var testcases []models.Testcase

	if err := initializers.DB.Where("question_id = ?", questionID).Find(&testcases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve testcases",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"testcases": testcases,
	})
}
