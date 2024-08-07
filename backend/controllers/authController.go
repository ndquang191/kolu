package controllers

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	initializers "github.com/ndquang191/kolu-be/initializers"
	models "github.com/ndquang191/kolu-be/models"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Type     string `json:"type"` // "student" or "admin"
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can't read body request"})
		return
	}

	if body.Type == "student" {
		var student models.Student
		if err := initializers.DB.Where("Email = ?", body.Email).First(&student).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(student.Password), []byte(body.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		// Create token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"sub":   student.StudentID,
			"email": student.Email,
			"name":  student.Name,
			"role":  "student", // Set role to "3" for students
			"exp":   time.Now().Add(time.Hour * 24 * 30).Unix(),
		})

		key := os.Getenv("SECRET")
		tokenString, err := token.SignedString([]byte(key))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Token"})
			return
		}

		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", false, true)

		c.JSON(http.StatusOK, gin.H{
			"token": tokenString,
			"user": gin.H{
				"id":         student.ID,
				"student_id": student.StudentID,
				"email":      student.Email,
				"name":       student.Name,
				"role":       "student",
				"type":       "student",
			},
		})

	} else if body.Type == "admin" {
		var admin models.Admin
		if err := initializers.DB.Where("Email = ?", body.Email).First(&admin).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(body.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		role := "admin"
		if admin.Role.RoleName != "" {
			role = admin.Role.RoleName
		}

		// Create token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"sub":   admin.Name, // Assuming Name is used as ID for admins
			"email": admin.Email,
			"name":  admin.Name,
			"role":  role,
			"exp":   time.Now().Add(time.Hour * 24 * 30).Unix(),
		})

		key := os.Getenv("SECRET")
		tokenString, err := token.SignedString([]byte(key))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Token"})
			return
		}

		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", false, true)

		c.JSON(http.StatusOK, gin.H{
			"token": tokenString,
			"user": gin.H{
				"id":    admin.ID, // Assuming Name is used as ID for admins
				"email": admin.Email,
				"name":  admin.Name,
				"role":  role,
				"type":  "admin",
			},
		})

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user type"})
		return
	}
}
