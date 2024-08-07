package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/ndquang191/kolu-be/models"
	"gorm.io/gorm"
)

func ExtractRoleFromJWT(secretKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(secretKey), nil
		})

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			if roleID, ok := claims["roleID"].(float64); ok { // JWT numbers are float64 by default
				c.Set("roleID", uint8(roleID))
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
				c.Abort()
				return
			}
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func AuthorizeRole(db *gorm.DB, allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleID, exists := c.Get("roleID")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "No role found"})
			c.Abort()
			return
		}

		var role models.Role
		if err := db.First(&role, roleID).Error; err != nil {
			c.JSON(http.StatusForbidden, gin.H{"error": "Invalid role"})
			c.Abort()
			return
		}

		for _, allowedRole := range allowedRoles {
			if role.RoleName == allowedRole {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to access this resource"})
		c.Abort()
	}
}
