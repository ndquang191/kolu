package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	initializers "github.com/ndquang191/kolu-be/initializers"
	models "github.com/ndquang191/kolu-be/models"
)

func CreateOneQuestion(c *gin.Context) {
	var body struct {
		Name string `json:"name"`
		Text string `json:"text"`
		// Difficulty string `json:"difficulty"`
		TopicID   uint `json:"topic_id"`
		Testcases []struct {
			Input          string `json:"input"`
			ExpectedOutput string `json:"expectedOutput"`
		} `json:"testcases"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	// Create question
	question := models.Question{
		Text:       body.Text,
		Name:       body.Name,
		Difficulty: "hard",
		TopicID:    body.TopicID,
	}

	result := initializers.DB.Create(&question)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create question",
		})
		return
	}

	// Create test cases
	for _, tc := range body.Testcases {
		testcase := models.Testcase{
			Input:          tc.Input,
			ExpectedOutput: tc.ExpectedOutput,
			QuestionID:     question.ID,
		}

		if err := initializers.DB.Create(&testcase).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create testcase",
			})
			return
		}
	}

	c.JSON(http.StatusAccepted, gin.H{
		"message":  "Question created successfully",
		"question": question,
	})
}

func CreateManyQuestions(c *gin.Context) {
	var questions []models.Question

	if err := c.ShouldBindJSON(&questions); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to bind JSON",
		})
		return
	}

	if err := initializers.DB.Create(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to add questions to the database",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Questions added successfully",
		"count":   len(questions),
	})
}

func UpdateQuestion(c *gin.Context) {
	var body struct {
		Text       string `json:"text"`
		Difficulty string `json:"difficulty"`
		TopicID    uint   `json:"topic_id"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	id := c.Param("id")
	var question models.Question

	if err := initializers.DB.First(&question, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Question not found",
		})
		return
	}

	question.Text = body.Text
	question.Difficulty = body.Difficulty
	question.TopicID = body.TopicID

	if err := initializers.DB.Save(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update question",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Question updated successfully",
		"question": question,
	})
}

func GetAllQuestions(c *gin.Context) {
	var questions []models.Question

	if err := initializers.DB.Find(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve questions",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"questions": questions,
	})
}

func GetQuestionByID(c *gin.Context) {
	questionID := c.Param("id")
	var question models.Question

	log.Printf("Querying question_id: %s", questionID)

	if err := initializers.DB.First(&question, questionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Question not found",
		})
		return
	}

	var testcases []models.Testcase

	if err := initializers.DB.Where("question_id = ?", questionID).Find(&testcases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve testcases",
		})
		return
	}

	question.TestCases = testcases

	log.Printf("Found question: %+v", question)

	c.JSON(http.StatusOK, gin.H{
		"question": question,
	})
}

func DeleteQuestionByID(c *gin.Context) {
	questionID := c.Param("id")
	var question models.Question

	if err := initializers.DB.First(&question, questionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Question not found",
		})
		return
	}

	if err := initializers.DB.Delete(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete question",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Question deleted successfully",
	})
}

func GetQuestionsByTopic(c *gin.Context) {
	topicID := c.Param("topic_id")
	var questions []models.Question

	if err := initializers.DB.Where("topic_id = ?", topicID).Find(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve questions",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"questions": questions,
	})
}

func GetQuestionsByDifficulty(c *gin.Context) {
	difficulty := c.Query("difficulty")
	var questions []models.Question

	if err := initializers.DB.Where("difficulty = ?", difficulty).Find(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve questions",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"questions": questions,
	})
}
