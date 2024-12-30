package routes

import (
	"income-outcome-tracker/controllers"

	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	router := mux.NewRouter()

	// Authentication
	router.HandleFunc("/register", controllers.Register).Methods("POST")
	router.HandleFunc("/login", controllers.Login).Methods("POST")

	// Transactions
	router.HandleFunc("/transactions", controllers.GetTransactions).Methods("GET")
	router.HandleFunc("/transactions", controllers.CreateTransaction).Methods("POST")
	router.HandleFunc("/transactions/{id}", controllers.GetTransactionByID).Methods("GET")
	router.HandleFunc("/transactions/{id}", controllers.UpdateTransaction).Methods("PUT")
	router.HandleFunc("/transactions/{id}", controllers.DeleteTransaction).Methods("DELETE")

	// Budgets
	router.HandleFunc("/budgets", controllers.GetBudgets).Methods("GET")
	router.HandleFunc("/budgets", controllers.CreateBudget).Methods("POST")
	router.HandleFunc("/budgets/{id}", controllers.UpdateBudget).Methods("PUT")

	return router
}
