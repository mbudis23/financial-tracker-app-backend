package main

import (
	"context"
	"log"
	"net/http"

	"income-outcome-tracker/config"
	"income-outcome-tracker/routes"
	"income-outcome-tracker/utils"
)

func main() {
	// Load environment variables
	config.LoadEnv()

	// Initialize Firebase
	config.InitializeFirebase()

	// Cek koneksi Firebase
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		log.Fatalf("Failed to connect to Firebase Realtime Database: %v", err)
	}

	// Tes koneksi dengan menulis data uji
	rootRef := client.NewRef("test_connection")
	err = rootRef.Set(ctx, map[string]interface{}{
		"status": "success",
	})
	if err != nil {
		log.Fatalf("Failed to write test data to Firebase Realtime Database: %v", err)
	}
	log.Println("Successfully connected and wrote test data to Firebase Realtime Database.")

	// Initialize JWT Secret
	utils.InitJWTSecret()

	// Get port from environment
	port := config.GetEnv("PORT")
	if port == "" {
		port = "8080"
	}

	// Set up routes
	router := routes.SetupRoutes()

	// Start server
	log.Printf("Server running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
