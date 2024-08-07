package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	initializers "github.com/ndquang191/kolu-be/initializers"
	models "github.com/ndquang191/kolu-be/models"
	"golang.org/x/crypto/bcrypt"
)

// CreateOneAdmin creates a new admin
func CreateOneAdmin(c *gin.Context) {
	var body struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
		Password string `json:"password"`
		RoleID   uint   `json:"role_id"`
		Status   string `json:"status"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	// Hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte("123456"), 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to hash password",
		})
		return
	}

	admin := models.Admin{
		Name:     body.Name,
		Email:    body.Email,
		Phone:    body.Phone,
		Password: string(hash),
		RoleID:   body.RoleID,
		Status:   "active",
	}

	result := initializers.DB.Create(&admin)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create admin",
		})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{
		"account": &admin,
	})
}

// UpdateAdmin updates an existing admin
func UpdateAdmin(c *gin.Context) {
	var body struct {
		Name   string `json:"name"`
		Email  string `json:"email"`
		Phone  string `json:"phone"`
		RoleID uint   `json:"role_id"`
		Status string `json:"status"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	id := c.Param("id")
	var admin models.Admin

	if err := initializers.DB.First(&admin, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Admin not found",
		})
		return
	}

	admin.Name = body.Name
	admin.Email = body.Email
	admin.Phone = body.Phone
	admin.RoleID = body.RoleID
	admin.Status = body.Status

	if err := initializers.DB.Save(&admin).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update admin",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Admin updated successfully",
		"admin":   admin,
	})
}

// GetAllAdmins retrieves all admins
func GetAllAdmins(c *gin.Context) {
	var admins []models.Admin

	if err := initializers.DB.Find(&admins).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve admins",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"admins": admins,
	})
}

// GetAdminByID retrieves an admin by ID
func GetAdminByID(c *gin.Context) {
	adminID := c.Param("id")
	var admin models.Admin

	if err := initializers.DB.First(&admin, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Admin not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"admin": admin,
	})
}

// DeleteAdminByID deletes an admin by ID
func DeleteAdminByID(c *gin.Context) {
	adminID := c.Param("id")
	var admin models.Admin

	if err := initializers.DB.First(&admin, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Admin not found",
		})
		return
	}

	if err := initializers.DB.Delete(&admin).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete admin",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Admin deleted successfully",
	})
}
