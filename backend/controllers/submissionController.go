package controllers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	initializers "github.com/ndquang191/kolu-be/initializers"
	models "github.com/ndquang191/kolu-be/models"
)

func GetSubmission(c *gin.Context) {
	studentID := c.Param("student_id")
	questionID := c.Param("question_id")

	if studentID == "" || questionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Both student_id and question_id are required",
		})
		return
	}

	var submission models.Submission

	// Log the query parameters for debugging
	log.Printf("Querying submission for student_id: %s, question_id: %s", studentID, questionID)

	// Try to find the existing submission
	result := initializers.DB.Where("student_id = ? AND question_id = ?", studentID, questionID).First(&submission)

	if result.Error == nil {
		// Submission found, return it
		log.Printf("Found submission: %+v", submission)
		c.JSON(http.StatusOK, gin.H{
			"submission": submission,
		})
		return
	}

	uintStudentID, err := strconv.ParseUint(studentID, 10, 32)
	if err != nil {
		fmt.Println("Error converting string to uint64:", err)
		return
	}

	uintQuestionID, err := strconv.ParseUint(questionID, 10, 32)
	if err != nil {
		fmt.Println("Error converting string to uint64:", err)
		return
	}

	if result.Error.Error() == "record not found" {
		// Submission not found, create a new one
		newSubmission := models.Submission{
			StudentID:      uint(uintStudentID),
			QuestionID:     uint(uintQuestionID),
			SubmissionDate: time.Now(),
			// Initialize other fields as needed
		}

		result := initializers.DB.Create(&newSubmission)
		if result.Error != nil {
			log.Printf("Error creating submission: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create submission",
			})
			return
		}

		log.Printf("Created new submission: %+v", newSubmission)
		c.JSON(http.StatusCreated, gin.H{
			"message":    "New submission created",
			"submission": newSubmission,
		})
		return
	}

	// Handle other potential errors
	log.Printf("Error querying submission: %v", result.Error)
	c.JSON(http.StatusInternalServerError, gin.H{
		"error": "An error occurred while processing the request",
	})
}
func CreateSubmission(c *gin.Context) {
	var body struct {
		StudentID  uint   `json:"student_id"`
		QuestionID uint   `json:"question_id"`
		Answer     string `json:"answer"`
		Score      uint   `json:"score"`
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	// Check if the Student exists
	var student models.Student
	if err := initializers.DB.First(&student, body.StudentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Student not found",
		})
		return
	}

	// Check if the Question exists
	var question models.Question
	if err := initializers.DB.First(&question, body.QuestionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Question not found",
		})
		return
	}

	submission := models.Submission{
		StudentID:      body.StudentID,
		QuestionID:     body.QuestionID,
		Answer:         body.Answer,
		Score:          body.Score,
		SubmissionDate: time.Now(),
		Status:         "Submitted",
	}

	result := initializers.DB.Create(&submission)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create submission",
		})
		return
	}

	// Fetch the complete submission with associated Student and Question
	initializers.DB.Preload("Student").Preload("Question").First(&submission, submission.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message":    "Submission created successfully",
		"submission": submission,
	})
}

func GetSubmissionsByQuestionID(c *gin.Context) {
	questionID := c.Param("question_id")
	studentID := c.Param("student_id")
	if questionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "question_id is required",
		})
		return
	}
	if studentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "student_id is required",
		})
		return
	}
	var submissions []models.Submission
	result := initializers.DB.Where("question_id = ? AND student_id = ?", questionID, studentID).Find(&submissions)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to query submissions",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"submissions": submissions,
	})
}
func GetSubmissionsByCourseID(c *gin.Context) {
	// Get the course ID from the URL parameter
	// courseID := c.Param("id")

	var submissions []models.Submission

	// Perform the query using the Enrollment table
	result := initializers.DB.Table("enrollments").
		Select("submissions.*").
		Joins("JOIN submissions ON enrollments.student_id = submissions.student_id").
		Joins("JOIN questions ON submissions.question_id = questions.id").
		Joins("JOIN topics ON questions.topic_id = topics.id").
		Where("enrollments.course_id = ?", 1).
		Find(&submissions)

	// Check for errors
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch submissions",
		})
		return
	}

	// Check if any submissions were found

	// Return the submissions
	c.JSON(http.StatusOK, gin.H{
		"submissions": submissions,
	})
}
