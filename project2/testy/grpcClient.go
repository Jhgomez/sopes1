package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type courserecord struct {
	Curso    string `json:"curso"`
	Facultad string `json:"facultad"`
	Carrera  string `json:"carrera"`
	Region   string `json:"region"`
}

var (
	grpcClientUrl = fmt.Sprintf("%s:%s", os.Getenv("GRPC_CLIENT_HOST"), os.Getenv("GRPC_CLIENT_PORT"))
)

func allGood(c *gin.Context) {
	c.String(http.StatusOK, "Course REST API Server Ready")
}

func postCourse(c *gin.Context) {
	var courseRecord courserecord

	if courseDataError := c.BindJSON(&courseRecord); courseDataError != nil {
		fmt.Println(courseDataError)
		c.String(http.StatusBadRequest, courseDataError.Error())
		return
	}

	courseJson, courseJsonErr := json.Marshal(courseRecord)

	if courseJsonErr != nil {
		log.Fatalf("parsing back to Json failed: %v", courseJsonErr)
		c.String(http.StatusBadRequest, courseJsonErr.Error())
		return
	}

	c.String(http.StatusOK, string(courseJson))
}

func postSin(c *gin.Context) {
	c.String(http.StatusOK, "post sin nada")
}

func getCon(c *gin.Context) {
	var courseRecord courserecord

	if courseDataError := c.BindJSON(&courseRecord); courseDataError != nil {
		fmt.Println(courseDataError)
		c.String(http.StatusBadRequest, courseDataError.Error())
		return
	}

	courseJson, courseJsonErr := json.Marshal(courseRecord)

	if courseJsonErr != nil {
		log.Fatalf("parsing back to Json failed: %v", courseJsonErr)
		c.String(http.StatusBadRequest, courseJsonErr.Error())
		return
	}

	success := fmt.Sprintf("get con json %s", string(courseJson))
	c.String(http.StatusOK, success)
}

func main() {
	router := gin.Default()
	router.GET("/", allGood)
	router.POST("/course", postCourse)
	router.GET("/gc", getCon)
	router.POST("/ps", postSin)

	router.Run(grpcClientUrl)
}
