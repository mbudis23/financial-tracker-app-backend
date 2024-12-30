package services

import (
	"context"
	"errors"
	"income-outcome-tracker/config"
	"income-outcome-tracker/models"
)

func GetTransactions(userID string) ([]models.Transaction, error) {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return nil, errors.New("failed to connect to Firebase")
	}

	var transactions []models.Transaction
	ref := client.NewRef("transactions").OrderByChild("user_id").EqualTo(userID)
	if err := ref.Get(ctx, &transactions); err != nil {
		return nil, errors.New("failed to fetch transactions")
	}

	return transactions, nil
}

func CreateTransaction(transaction models.Transaction) error {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return errors.New("failed to connect to Firebase")
	}

	// Gunakan Push untuk membuat node baru di Firebase
	ref, err := client.NewRef("transactions").Push(ctx, transaction)
	if err != nil {
		return errors.New("failed to create transaction")
	}

	// Ambil ID node baru dan tetapkan ke TransactionID
	transaction.TransactionID = ref.Key

	return nil
}

func GetTransactionByID(transactionID string) (*models.Transaction, error) {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return nil, errors.New("failed to connect to Firebase")
	}

	var transaction models.Transaction
	ref := client.NewRef("transactions/" + transactionID)
	if err := ref.Get(ctx, &transaction); err != nil {
		return nil, errors.New("failed to fetch transaction by ID")
	}

	return &transaction, nil
}

func UpdateTransaction(transactionID string, transaction models.Transaction) error {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return errors.New("failed to connect to Firebase")
	}

	ref := client.NewRef("transactions/" + transactionID)
	if err := ref.Set(ctx, transaction); err != nil {
		return errors.New("failed to update transaction")
	}

	return nil
}

func DeleteTransaction(transactionID string) error {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return errors.New("failed to connect to Firebase")
	}

	ref := client.NewRef("transactions/" + transactionID)
	if err := ref.Delete(ctx); err != nil {
		return errors.New("failed to delete transaction")
	}

	return nil
}
