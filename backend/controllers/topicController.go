package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	initializers "github.com/ndquang191/kolu-be/initializers"
	models "github.com/ndquang191/kolu-be/models"
)

func CreateOneTopic(c *gin.Context) {
	var input struct {
		TopicName   string `json:"topic_name" binding:"required"`
		Description string `json:"description"`
		LanguageIDs []uint `json:"language_ids"`
		AdminID     uint   `json:"admin_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find the admin
	var admin models.Admin
	if err := initializers.DB.First(&admin, input.AdminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	// Find the languages
	var languages []models.Language
	if len(input.LanguageIDs) > 0 {
		if err := initializers.DB.Where("id IN ?", input.LanguageIDs).Find(&languages).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error finding languages"})
			return
		}
	}

	// Create the topic
	topic := models.Topic{
		TopicName:   input.TopicName,
		Description: input.Description,
		AdminID:     input.AdminID,
		Languages:   languages,
		Admin:       admin,
	}

	if err := initializers.DB.Create(&topic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating topic"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Topic created successfully", "topic": topic})
}

func CreateManyTopics(c *gin.Context) {
	var topics []models.Topic

	if err := c.ShouldBindJSON(&topics); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to bind JSON",
		})
		return
	}

	if err := initializers.DB.Create(&topics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to add topics to the database",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Topics added successfully",
		"count":   len(topics),
	})
}

func UpdateTopic(c *gin.Context) {
	var body struct {
		TopicName   string `json:"topic_name"`
		Description string `json:"description"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	id := c.Param("id")
	var topic models.Topic

	if err := initializers.DB.First(&topic, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Topic not found",
		})
		return
	}

	topic.TopicName = body.TopicName
	topic.Description = body.Description

	if err := initializers.DB.Save(&topic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update topic",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Topic updated successfully",
		"topic":   topic,
	})
}

func GetAllTopics(c *gin.Context) {
	var topics []models.Topic

	if err := initializers.DB.Preload("Languages").Preload("Questions").Preload("Admin").Find(&topics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve topics",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"topics": topics,
	})
}

func GetTopicByID(c *gin.Context) {
	topicID := c.Param("id")
	var topic models.Topic

	log.Printf("Querying topic_id: %s", topicID)

	// Preload Questions and Admin
	if err := initializers.DB.Preload("Questions").Preload("Languages").Preload("Admin").First(&topic, topicID).Error; err != nil {
		log.Printf("Error finding topic: %v", err)
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Topic not found",
		})
		return
	}

	log.Printf("Found topic: %+v", topic)

	c.JSON(http.StatusOK, gin.H{
		"topic": topic,
	})
}

func DeleteTopicByID(c *gin.Context) {
	topicID := c.Param("id")
	var topic models.Topic

	if err := initializers.DB.First(&topic, topicID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Topic not found",
		})
		return
	}

	if err := initializers.DB.Delete(&topic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete topic",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Topic deleted successfully",
	})
}

func GetTopicsWithQuestions(c *gin.Context) {
	var topics []models.Topic

	if err := initializers.DB.Preload("Questions").Find(&topics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve topics with questions",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"topics": topics,
	})
}

func GetTopicsByLanguage(c *gin.Context) {
	languageID := c.Param("language_id")
	var topics []models.Topic

	if err := initializers.DB.Joins("JOIN language_topics ON topics.id = language_topics.topic_id").
		Where("language_topics.language_id = ?", languageID).
		Find(&topics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve topics for the specified language",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"topics": topics,
	})
}
