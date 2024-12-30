package config

import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

var FirebaseApp *firebase.App

func InitializeFirebase() {
	// Ambil path ke file kredensial dari .env
	credentialsPath := GetEnv("FIREBASE_CREDENTIALS")
	if credentialsPath == "" {
		log.Fatalf("Environment variable FIREBASE_CREDENTIALS not set")
	}

	credentialsJSON := os.Getenv("FIREBASE_CREDENTIALS_JSON")
	if credentialsJSON == "" {
		log.Fatalf("FIREBASE_CREDENTIALS_JSON not found in .env")
	}

	// Ambil URL database dari environment variable
	databaseURL := GetEnv("FIREBASE_DATABASE_URL")
	if databaseURL == "" {
		log.Fatalf("Environment variable FIREBASE_DATABASE_URL not set")
	}

	// Tambahkan log untuk debugging
	log.Println("Using Firebase credentials from:", credentialsPath)
	log.Println("Database URL:", databaseURL)

	// Inisialisasi Firebase dengan DatabaseURL
	ctx := context.Background()
	// opt := option.WithCredentialsFile(credentialsPath)
	opt := option.WithCredentialsJSON([]byte(credentialsJSON))
	config := &firebase.Config{
		DatabaseURL: databaseURL, // Atur URL Database dari .env
	}
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Fatalf("Failed to initialize Firebase: %v", err)
	}

	// Simpan instance Firebase ke variabel global
	FirebaseApp = app
	log.Println("Firebase initialized successfully")
}
