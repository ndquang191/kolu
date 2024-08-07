package controllers

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	initializers "github.com/ndquang191/kolu-be/initializers"
	models "github.com/ndquang191/kolu-be/models"
	"golang.org/x/crypto/bcrypt"
)

func CreateOneUser(c *gin.Context) {
	var body struct {
		StudentID string `json:"student_id"`
		Name      string `json:"name"`
		Class     string `json:"class"`
		Email     string `json:"email"`
		DOB       string `json:"dob"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	// Parse the DOB
	dob := time.Now()

	// Default password is "1"
	hash, err := bcrypt.GenerateFromPassword([]byte("1"), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to hash password",
		})
		return
	}

	student := models.Student{
		StudentID: body.StudentID,
		Password:  string(hash),
		Name:      body.Name,
		Class:     body.Class,
		Email:     body.Email,
		DOB:       dob,
	}

	result := initializers.DB.Create(&student)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create student",
		})
		return
	}

	// Respond
	c.JSON(http.StatusAccepted, gin.H{
		"message": "Done",
	})
}

func CreateManyStudents(c *gin.Context) {
	var students []models.Student

	if err := c.ShouldBindJSON(&students); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to bind JSON",
		})
		return
	}

	// Get all student IDs from the database
	var existingStudents []models.Student
	initializers.DB.Select("student_id").Find(&existingStudents)

	// Create a map of existing student IDs for quick lookup
	existingStudentIDs := make(map[string]struct{})
	for _, student := range existingStudents {
		existingStudentIDs[student.StudentID] = struct{}{}
	}

	// Filter out duplicate student IDs
	var uniqueStudents []models.Student
	for _, student := range students {
		if _, exists := existingStudentIDs[student.StudentID]; !exists {
			// Hash the default password "1" for each student
			hash, err := bcrypt.GenerateFromPassword([]byte("1"), bcrypt.DefaultCost)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Failed to hash password",
				})
				return
			}
			student.Password = string(hash)
			uniqueStudents = append(uniqueStudents, student)
		}
	}

	// Add the unique students to the database
	if len(uniqueStudents) > 0 {
		if err := initializers.DB.Create(&uniqueStudents).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to add students to the database",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Students added successfully",
		"count":   len(uniqueStudents),
	})
}

func UpdateStudent(c *gin.Context) {
	var body struct {
		Name  string `json:"name"`
		Class string `json:"class"`
		Email string `json:"email"`
		DOB   string `json:"dob"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	// Parse the DOB
	// dob, err := time.Parse("2006-01-02", body.DOB)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"error": "Failed to parse date of birth",
	// 	})
	// 	return
	// }

	id := c.Param("id")
	var student models.Student

	if err := initializers.DB.First(&student, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Student not found",
		})
		return
	}

	student.Name = body.Name
	student.Class = body.Class
	student.Email = body.Email
	student.DOB = time.Now()

	if err := initializers.DB.Save(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update student",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Student updated successfully",
		"student": student,
	})
}

func GetAllStudents(c *gin.Context) {
	var students []models.Student

	if err := initializers.DB.Find(&students).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve students",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"students": students,
	})
}

func GetStudentByID(c *gin.Context) {
	studentID := c.Param("student_id")
	var student models.Student

	// Log the studentID for debugging
	log.Printf("Querying student_id: %s", studentID)

	// Using the primary key lookup method
	if err := initializers.DB.Where("student_id = ?", studentID).First(&student).Error; err != nil {
		log.Printf("Error finding student: %v", err) // Log the error for debugging
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Student not found",
		})
		return
	}

	// Log the found student for debugging
	log.Printf("Found student: %+v", student)

	c.JSON(http.StatusOK, gin.H{
		"student": student,
	})
}

func DeleteStudentByID(c *gin.Context) {
	studentID := c.Param("student_id")
	var student models.Student

	if err := initializers.DB.Where("student_id = ?", studentID).First(&student).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Student not found",
		})
		return
	}

	if err := initializers.DB.Unscoped().Delete(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete student",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Student deleted successfully",
	})
}

func UpdateStudentByID(c *gin.Context) {
	var body struct {
		Name  string `json:"name"`
		Class string `json:"class"`
		Email string `json:"email"`
		DOB   string `json:"dob"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	// Parse the DOB
	dob, err := time.Parse("2006-01-02", body.DOB)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to parse date of birth",
		})
		return
	}

	studentID := c.Param("student_id")
	var student models.Student

	if err := initializers.DB.Where("student_id = ?", studentID).First(&student).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Student not found",
		})
		return
	}

	student.Name = body.Name
	student.Class = body.Class
	student.Email = body.Email
	student.DOB = dob

	if err := initializers.DB.Save(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update student",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Student updated successfully",
		"student": student,
	})
}
