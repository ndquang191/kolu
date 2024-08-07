package controllers

import (
	"log"
	"net/http"
	// "strconv"
	"time"

	"github.com/gin-gonic/gin"
	initializers "github.com/ndquang191/kolu-be/initializers"
	models "github.com/ndquang191/kolu-be/models"
)

func CreateOneEnrollment(c *gin.Context) {
	var body struct {
		StudentID string `json:"student_id"`
		CourseID  uint   `json:"course_id"`
		Status    string `json:"status"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var student models.Student
	if err := initializers.DB.Where("student_id = ?", body.StudentID).First(&student).Error; err != nil {
		c.JSON(http.StatusAccepted, gin.H{
			"message": "Student not enrolled in this course",
		})
		return
	}

	enrollment := models.Enrollment{
		StudentID: student.ID,
		CourseID:  body.CourseID,
		Status:    body.Status,
	}

	if result := initializers.DB.Preload("Student").Preload("Course").Create(&enrollment); result.Error != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Student already enrolled in this course",
		})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{
		"message":    "Enrollment created successfully",
		"enrollment": enrollment,
	})
}

func CreateManyEnrollments(c *gin.Context) {
	var enrollments []models.Enrollment

	if err := c.ShouldBindJSON(&enrollments); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to bind JSON",
		})
		return
	}

	if err := initializers.DB.Create(&enrollments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to add enrollments to the database",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Enrollments added successfully",
		"count":   len(enrollments),
	})
}

func UpdateEnrollment(c *gin.Context) {
	var body struct {
		StudentID uint      `json:"student_id"`
		CourseID  uint      `json:"course_id"`
		StartDate time.Time `json:"start_date"`
		EndDate   time.Time `json:"end_date"`
		Status    string    `json:"status"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	id := c.Param("id")
	var enrollment models.Enrollment

	if err := initializers.DB.First(&enrollment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Enrollment not found",
		})
		return
	}

	enrollment.StudentID = body.StudentID
	enrollment.CourseID = body.CourseID
	// enrollment.StartDate = body.StartDate
	// enrollment.EndDate = body.EndDate
	enrollment.Status = body.Status

	if err := initializers.DB.Save(&enrollment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update enrollment",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Enrollment updated successfully",
		"enrollment": enrollment,
	})
}
func GetEnrollmentsByCourseID(c *gin.Context) {
	// Extract course_id from the URL parameters
	courseID := c.Param("course_id")

	// Convert courseID to int64
	// courseIDInt, err := strconv.ParseInt(courseID, 10, 64)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"error": "Invalid course ID format",
	// 	})
	// 	return
	// }

	// Define a slice to hold enrollments
	var enrollments []models.Enrollment

	// Query the database for enrollments with the specified course ID
	if err := initializers.DB.
		// Preload("Student").
		Where("course_id = ?::integer", courseID).
		Find(&enrollments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve enrollments for the course",
		})
		return
	}
	if len(enrollments) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"enrollments": []models.Enrollment{},
		})
		return
	}

	// Extract unique student IDs from enrollments
	studentIDMap := make(map[uint]bool)
	for _, enrollment := range enrollments {
		studentIDMap[enrollment.StudentID] = true
	}

	var studentIDs []uint
	for id := range studentIDMap {
		studentIDs = append(studentIDs, id)
	}

	// Fetch students
	var students []models.Student
	if len(studentIDs) > 0 {
		if err := initializers.DB.
			Where("id IN ?", studentIDs).
			Find(&students).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to retrieve students",
			})
			return
		}
	}

	// Respond with the enrollments and students data
	c.JSON(http.StatusOK, gin.H{
		"enrollments": enrollments,
		"students":    students,
	})
}
func GetEnrollmentsByStudentID(c *gin.Context) {
	studentID := c.Param("student_id")
	var enrollments []models.Enrollment

	if err := initializers.DB.Where("student_id = ?", studentID).Find(&enrollments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve enrollments for the student",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"enrollments": enrollments,
	})
}

func GetAllEnrollments(c *gin.Context) {
	var enrollments []models.Enrollment

	if err := initializers.DB.Find(&enrollments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve enrollments",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"enrollments": enrollments,
	})
}

func GetEnrollmentByID(c *gin.Context) {
	enrollmentID := c.Param("id")
	var enrollment models.Enrollment

	log.Printf("Querying enrollment_id: %s", enrollmentID)

	if err := initializers.DB.First(&enrollment, enrollmentID).Error; err != nil {
		log.Printf("Error finding enrollment: %v", err)
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Enrollment not found",
		})
		return
	}

	log.Printf("Found enrollment: %+v", enrollment)

	c.JSON(http.StatusOK, gin.H{
		"enrollment": enrollment,
	})
}

func DeleteEnrollmentByID(c *gin.Context) {
	enrollmentID := c.Param("id")
	var enrollment models.Enrollment

	if err := initializers.DB.First(&enrollment, enrollmentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Enrollment not found",
		})
		return
	}

	if err := initializers.DB.Delete(&enrollment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete enrollment",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Enrollment deleted successfully",
	})
}

func GetEnrollmentsByStudent(c *gin.Context) {
	studentID := c.Param("student_id")
	var enrollments []models.Enrollment

	if err := initializers.DB.Where("student_id = ?", studentID).Find(&enrollments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve enrollments for the student",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"enrollments": enrollments,
	})
}

func GetEnrollmentsByCourse(c *gin.Context) {
	courseID := c.Param("course_id")
	var enrollments []models.Enrollment

	if err := initializers.DB.Where("course_id = ?", courseID).Find(&enrollments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve enrollments for the course",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"enrollments": enrollments,
	})
}

func GetActiveEnrollments(c *gin.Context) {
	var enrollments []models.Enrollment
	now := time.Now()

	if err := initializers.DB.Where("start_date <= ? AND end_date >= ? AND status = ?", now, now, "active").Find(&enrollments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve active enrollments",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"active_enrollments": enrollments,
	})
}
