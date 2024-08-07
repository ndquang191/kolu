package controllers

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SubmissionRequest struct {
	SourceCode string `json:"source_code"`
	LanguageID int    `json:"language_id"`
	Input      string `json:"stdin"`
}

type SubmissionResponse struct {
	Stdout        string `json:"stdout"`
	StatusID      int    `json:"status_id"`
	Memory        int    `json:"memory"`
	Time          string `json:"time"`
	Stderr        string `json:"stderr"`
	CompileOutput string `json:"compile_output"`
}

func ExecuteCode(c *gin.Context) {
	var submissionReq SubmissionRequest
	if err := c.ShouldBindJSON(&submissionReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Encode source code in base64
	encodedSource := base64.StdEncoding.EncodeToString([]byte(submissionReq.SourceCode))

	// Prepare request for Judge0 API
	judgeReq := map[string]interface{}{
		"source_code": encodedSource,
		"language_id": submissionReq.LanguageID,
		"stdin":       submissionReq.Input,
	}

	jsonData, err := json.Marshal(judgeReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare request"})
		return
	}

	// Send request to Judge0 API
	client := &http.Client{}
	httpReq, err := http.NewRequest("POST", "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*", bytes.NewBuffer(jsonData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	httpReq.Header.Add("content-type", "application/json")
	httpReq.Header.Add("X-RapidAPI-Key", "775162cc34msh266cb839473209bp1501e0jsnb4272c646156")
	httpReq.Header.Add("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com")

	res, err := client.Do(httpReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send request"})
		return
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
		return
	}

	// Check if the response is an error message
	var errorResponse struct {
		Message string `json:"message"`
	}
	if err := json.Unmarshal(body, &errorResponse); err == nil && errorResponse.Message != "" {
		c.JSON(res.StatusCode, gin.H{"error": errorResponse.Message})
		return
	}

	var result SubmissionResponse
	err = json.Unmarshal(body, &result)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse response"})
		return
	}
	// Decode base64 encoded outputs
	stdout, _ := base64.StdEncoding.DecodeString(result.Stdout)
	stderr, _ := base64.StdEncoding.DecodeString(result.Stderr)
	compileOutput, _ := base64.StdEncoding.DecodeString(result.CompileOutput)

	response := SubmissionResponse{
		Stdout:        string(stdout),
		StatusID:      result.StatusID,
		Memory:        result.Memory,
		Time:          result.Time,
		Stderr:        string(stderr),
		CompileOutput: string(compileOutput),
	}

	c.JSON(http.StatusOK, response)
}
