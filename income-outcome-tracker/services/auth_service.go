package services

import (
	"context"
	"errors"
	"income-outcome-tracker/config"
	"income-outcome-tracker/models"

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

func AuthenticateUser(email, password string) (*models.User, error) {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return nil, errors.New("failed to connect to Firebase")
	}

	// Ambil user berdasarkan email
	var users map[string]models.User
	ref := client.NewRef("users")
	if err := ref.Get(ctx, &users); err != nil {
		return nil, errors.New("failed to fetch users")
	}

	// Cari user dengan email yang cocok
	for _, user := range users {
		if user.Email == email {
			// Cek password
			err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
			if err != nil {
				return nil, errors.New("invalid email or password")
			}
			return &user, nil
		}
	}

	return nil, errors.New("invalid email or password")
}
