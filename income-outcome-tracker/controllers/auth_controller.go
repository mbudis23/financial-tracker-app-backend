package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"income-outcome-tracker/models"
	"income-outcome-tracker/services"
	"income-outcome-tracker/utils"
)

func Register(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Printf("Error decoding request body: %v", err)
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Debugging: Log user data yang diterima
	log.Printf("User data received: %+v", user)

	err = services.RegisterUser(user)
	if err != nil {
		if err.Error() == "user with this email already exists" {
			utils.RespondWithError(w, http.StatusConflict, err.Error())
		} else {
			log.Printf("Error registering user: %v", err) // Tambahkan log error
			utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}

	utils.RespondWithJSON(w, http.StatusCreated, map[string]string{"message": "User registered successfully"})
}

func Login(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Decode JSON dari body request
	err := json.NewDecoder(r.Body).Decode(&credentials)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Autentikasi user
	userId, user, err := services.AuthenticateUser(credentials.Email, credentials.Password)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, err.Error())
		return
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(userId)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	// Kirimkan respons sukses dengan token dan userId
	utils.RespondWithJSON(w, http.StatusOK, map[string]interface{}{
		"message": "Login successful",
		"token":   token,
		"user": map[string]interface{}{
			"userId": userId,
			"email":  user.Email,
			"name":   user.Name,
		},
	})
}
