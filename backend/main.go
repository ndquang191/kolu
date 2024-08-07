package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/ndquang191/kolu-be/controllers"
	initalizers "github.com/ndquang191/kolu-be/initializers"
	"github.com/ndquang191/kolu-be/middleware"
)

func init() {
	initalizers.LoadEnvVariables()
	initalizers.ConnectToDB()
	initalizers.SyncDatabase()
}
func main() {

	// initalizers.DB.AutoMigrate(&models.User{})
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:3001"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	// config.ExposeHeaders := []string{"Content-Length"}
	// config.AllowCredentials := true

	r.Use(cors.New(config))

	r.POST("/login", controllers.Login)

	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{

		studentRoutes := api.Group("/student").Use(middleware.RBACMiddleware("student"))
		{
			studentRoutes.GET("/course/student/:id", controllers.GetCourseByStudentID)
			studentRoutes.GET("/course/:id", controllers.GetCourseByID)

			studentRoutes.GET("/question/:id", controllers.GetQuestionByID)
			studentRoutes.GET("/topic/:id", controllers.GetTopicByID)

			studentRoutes.POST("/submission", controllers.CreateSubmission)
			studentRoutes.GET("/student/:student_id/question/:question_id", controllers.GetSubmission)
			studentRoutes.GET("/fromquestion/:question_id/testcases", controllers.GetTestcaseByQuestionID)
			studentRoutes.POST("/execute", controllers.ExecuteCode)

			studentRoutes.GET("/:student_id/question/:question_id/submissions", controllers.GetSubmissionsByQuestionID)

		}

		admin := api.Group("/admin")
		admin.Use(middleware.RBACMiddleware("admin"))
		{

			// students
			admin.GET("/:student_id", controllers.GetStudentByID)
			admin.PUT("/:id", controllers.UpdateStudent)
			admin.DELETE("/:student_id", controllers.DeleteStudentByID)
			admin.GET("/students/", controllers.GetAllStudents)
			admin.POST("/student", controllers.CreateOneUser)
			admin.POST("/students", controllers.CreateManyStudents)
			// admin
			admin.POST("/admin", controllers.CreateOneAdmin)
			admin.PUT("/admin/:id", controllers.UpdateAdmin)
			admin.GET("/admins", controllers.GetAllAdmins)
			admin.GET("/admin/:id", controllers.GetAdminByID)
			admin.DELETE("/admin/:id", controllers.DeleteAdminByID)

			// topic

			admin.POST("/topic", controllers.CreateOneTopic)
			admin.PUT("/topic/:id", controllers.UpdateTopic)
			admin.GET("/topics", controllers.GetAllTopics)
			admin.GET("/topic/:id", controllers.GetTopicByID)
			admin.DELETE("/topic/:id", controllers.DeleteTopicByID)

			// question
			admin.POST("/question", controllers.CreateOneQuestion)
			admin.PUT("/question/:id", controllers.UpdateQuestion)
			admin.GET("/questions", controllers.GetAllQuestions)
			admin.GET("/question/:id", controllers.GetQuestionByID)
			admin.DELETE("/question/:id", controllers.DeleteQuestionByID)

			// course
			admin.POST("/course", controllers.CreateOneCourse)
			admin.PUT("/course/:id", controllers.UpdateCourse)
			admin.GET("/courses", controllers.GetAllCourses)
			admin.GET("/course/:id", controllers.GetCourseByID)
			admin.GET("/course/student/:id", controllers.GetCourseByStudentID)
			admin.DELETE("/course/:id", controllers.DeleteCourseByID)

			// enrollment
			admin.POST("/enrollment", controllers.CreateOneEnrollment)
			admin.PUT("/enrollment/:id", controllers.UpdateEnrollment)
			admin.GET("/enrollments", controllers.GetAllEnrollments)
			admin.GET("/enrollment/:id", controllers.GetEnrollmentByID)
			admin.DELETE("/enrollment/:id", controllers.DeleteEnrollmentByID)
			admin.GET("/enrollments/course/:course_id", controllers.GetEnrollmentsByCourseID)
			admin.GET("/enrollments/student/:student_id", controllers.GetEnrollmentsByStudentID)

			// submission
			admin.GET("/submissions/course/:id", controllers.GetSubmissionsByCourseID)

		}

		teacher := api.Group("/teacher")
		teacher.Use(middleware.RBACMiddleware("teacher"))
		{
			// teacher.GET("/courses", controllers.GetAllCourses)
			// teacher.POST("/courses", controllers.CreateCourse)
			// teacher.GET("/courses/:id", controllers.GetCourseByID)
			// teacher.PUT("/courses/:id", controllers.UpdateCourse)
			// teacher.DELETE("/courses/:id", controllers.DeleteCourseByID)
			// teacher.GET("/courses/:id/enrollments", controllers.GetCourseWithEnrollments)
			// teacher.GET("/courses/active", controllers.GetActiveCourses)
		}
		// Routes accessible by both students and admins
		// api.GET("/announcements", middleware.RBACMiddleware("teacher", "admin"), controllers.CreateManyCourses)
	}

	// r.GET("/validate", middleware.RequireAuth, controllers.Validate)

	r.Run() // listen and serve on 0.0.0.0:8080

	// CompileDaemon -command="./kolu-be"

}
