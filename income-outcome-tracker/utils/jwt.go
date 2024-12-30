package utils

import (
	"time"

	"income-outcome-tracker/config"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey string

func InitJWTSecret() {
	jwtKey = config.GetEnv("JWT_SECRET")
	if jwtKey == "" {
		panic("JWT_SECRET is not set in .env")
	}
}

func GenerateJWT(userID string) (string, error) {
	claims := &jwt.StandardClaims{
		Subject:   userID,
		ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtKey))
}
