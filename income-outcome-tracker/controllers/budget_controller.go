package controllers

import (
	"encoding/json"
	"income-outcome-tracker/models"
	"income-outcome-tracker/services"
	"income-outcome-tracker/utils"
	"net/http"
)

func GetBudgets(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("UserID") // Dummy UserID; replace with JWT authentication
	budgets, err := services.GetBudgets(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, budgets)
}

func CreateBudget(w http.ResponseWriter, r *http.Request) {
	var budget models.Budget
	err := json.NewDecoder(r.Body).Decode(&budget)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	err = services.CreateBudget(budget)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondWithJSON(w, http.StatusCreated, budget)
}

func UpdateBudget(w http.ResponseWriter, r *http.Request) {
	var budget models.Budget
	err := json.NewDecoder(r.Body).Decode(&budget)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	err = services.UpdateBudget(budget)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, budget)
}
