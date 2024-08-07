package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// RBACMiddleware checks if the user has the required role to access a route
func RBACMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the user's role from the context
		// This assumes the AuthMiddleware has already run and set the role
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User role not found"})
			c.Abort()
			return
		}

		// Check if the user's role is in the list of allowed roles
		userRole := role.(string)
		for _, allowedRole := range allowedRoles {
			if userRole == allowedRole {
				c.Next()
				return
			}
		}

		// If the role is not allowed, deny access
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		c.Abort()
	}
}
