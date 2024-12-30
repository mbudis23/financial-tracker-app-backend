package controllers

import (
	"income-outcome-tracker/services"
	"income-outcome-tracker/utils"
	"net/http"
)

func GetMonthlyReport(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("UserID") // Dummy UserID; replace with JWT authentication
	report, err := services.GetMonthlyReport(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, report)
}

func GetYearlyReport(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("UserID") // Dummy UserID; replace with JWT authentication
	report, err := services.GetYearlyReport(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, report)
}
