package services

import (
	"context"
	"errors"
	"income-outcome-tracker/config"
	"income-outcome-tracker/models"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(user models.User) error {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return errors.New("failed to connect to Firebase")
	}

	usersRef := client.NewRef("users")

	// Query untuk mencari user dengan email yang sama
	var existingUsers map[string]models.User
	err = usersRef.OrderByChild("email").EqualTo(user.Email).Get(ctx, &existingUsers)
	if err != nil {
		return errors.New("failed to query existing users")
	}

	// Cek apakah ada user dengan email yang sama
	if len(existingUsers) > 0 {
		return errors.New("user with this email already exists")
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
	user.PasswordHash = string(hashedPassword)

	_, err = usersRef.Push(ctx, user)
	if err != nil {
		return errors.New("failed to register user")
	}
	return nil
}

func AuthenticateUser(email, password string) (string, models.User, error) {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		log.Printf("Error connecting to Firebase: %v", err)
		return "", models.User{}, errors.New("failed to connect to Firebase")
	}

	// Reference ke database users
	usersRef := client.NewRef("users")

	// Query untuk mencari user berdasarkan email
	var existingUsers map[string]models.User
	err = usersRef.OrderByChild("email").EqualTo(email).Get(ctx, &existingUsers)
	if err != nil {
		log.Printf("Error querying users: %v", err)
		return "", models.User{}, errors.New("failed to query existing users")
	}

	// Log hasil query untuk debugging
	log.Printf("Query result for email '%s': %+v", email, existingUsers)

	// Jika user tidak ditemukan, kembalikan error
	if len(existingUsers) == 0 {
		log.Printf("No user found with email: %s", email)
		return "", models.User{}, errors.New("invalid email or password")
	}

	// Ambil user pertama dari hasil query dan ID-nya
	var userId string
	var user models.User
	for id, u := range existingUsers {
		userId = id
		user = u
		break
	}

	// Log user yang ditemukan
	log.Printf("User found: ID = %s, Email = %s", userId, user.Email)

	// Verifikasi password
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		log.Printf("Password mismatch for email: %s", email)
		return "", models.User{}, errors.New("invalid email or password")
	}

	// Log jika login berhasil
	log.Printf("User authenticated successfully: ID = %s, Email = %s", userId, user.Email)

	return userId, user, nil
}
