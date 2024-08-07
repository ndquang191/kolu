package controllers

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	initializers "github.com/ndquang191/kolu-be/initializers"
	models "github.com/ndquang191/kolu-be/models"
)

func CreateOneCourse(c *gin.Context) {
	var body struct {
		Name      string `json:"name"`
		TopicID   string `json:"topic_id"`
		TeacherID string `json:"teacher_id"`
		Semester  string `json:"semester"`
		Year      string `json:"year"`
	}

	if c.BindJSON(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	topicID, err := strconv.ParseUint(body.TopicID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid topic ID",
		})
		return
	}

	teacherID, err := strconv.ParseUint(body.TeacherID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid teacher ID",
		})
		return
	}

	course := models.Course{
		Name:        body.Name,
		Description: "Default description: This course is created by Kolu",
		TopicID:     uint(topicID),
		TeacherID:   uint(teacherID),
		Semester:    body.Semester,
		Year:        body.Year,
	}

	result := initializers.DB.Create(&course)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create course",
		})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{
		"message": "Course created successfully",
		"course":  course,
	})
}
func CreateManyCourses(c *gin.Context) {
	var courses []models.Course

	if err := c.ShouldBindJSON(&courses); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to bind JSON",
		})
		return
	}

	if err := initializers.DB.Create(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to add courses to the database",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Courses added successfully",
		"count":   len(courses),
	})
}

func UpdateCourse(c *gin.Context) {
	var body struct {
		Name        string    `json:"name"`
		Description string    `json:"description"`
		StartDate   time.Time `json:"start_date"`
		EndDate     time.Time `json:"end_date"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	id := c.Param("id")
	var course models.Course

	if err := initializers.DB.First(&course, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Course not found",
		})
		return
	}

	course.Name = body.Name
	course.Description = body.Description

	if err := initializers.DB.Save(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update course",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Course updated successfully",
		"course":  course,
	})
}

func GetAllCourses(c *gin.Context) {
	var courses []models.Course

	if err := initializers.DB.Preload("Topic").Preload("Teacher").Preload("Enrollments").Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve courses",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"courses": courses,
	})
}

func GetCourseByID(c *gin.Context) {
	courseID := c.Param("id")
	var course models.Course

	log.Printf("Querying course_id: %s", courseID)

	if err := initializers.DB.Preload("Topic").Preload("Teacher").Preload("Enrollments").First(&course, courseID).Error; err != nil {
		log.Printf("Error finding course: %v", err)
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Course not found",
		})
		return
	}

	log.Printf("Found course: %+v", course)

	c.JSON(http.StatusOK, gin.H{
		"course": course,
	})
}

func DeleteCourseByID(c *gin.Context) {
	courseID := c.Param("id")
	var course models.Course

	if err := initializers.DB.First(&course, courseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Course not found",
		})
		return
	}

	if err := initializers.DB.Delete(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete course",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Course deleted successfully",
	})
}

func GetCourseWithEnrollments(c *gin.Context) {
	courseID := c.Param("id")
	var course models.Course

	if err := initializers.DB.Preload("Enrollments").First(&course, courseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Course not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"course": course,
	})
}

func GetActiveCourses(c *gin.Context) {
	var courses []models.Course
	now := time.Now()

	if err := initializers.DB.Where("start_date <= ? AND end_date >= ?", now, now).Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve active courses",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"active_courses": courses,
	})
}

func GetCourseByStudentID(c *gin.Context) {
	// Extract student_id from the URL parameters
	studentID := c.Param("id")

	// Convert studentID to uint
	studentIDUint, err := strconv.ParseUint(studentID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid student ID format",
		})
		return
	}

	// Define a slice to hold enrollments
	var enrollments []models.Enrollment

	// Query the database for enrollments with the specified student ID
	if err := initializers.DB.
		Where("student_id = ?", uint(studentIDUint)).
		Preload("Course").       // Preload the Course associated with each enrollment
		Preload("Course.Teacher"). // Preload the Topic associated with each enrollment
		Find(&enrollments).Error; err != nil {
		// Handle database retrieval errors
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve enrollments for the student",
		})
		return
	}

	// If no enrollments found, respond with a not found error
	if len(enrollments) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "No enrollments found for the student",
		})
		return
	}

	// Extract the courses from the enrollments
	courses := make([]models.Course, len(enrollments))
	for i, enrollment := range enrollments {
		courses[i] = enrollment.Course
	}

	// Respond with the courses data
	c.JSON(http.StatusOK, gin.H{
		"courses": courses,
	})
}
