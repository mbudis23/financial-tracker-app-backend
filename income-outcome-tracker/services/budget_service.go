package services

import (
	"context"
	"errors"
	"income-outcome-tracker/config"
	"income-outcome-tracker/models"
)

func GetBudgets(userID string) ([]models.Budget, error) {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return nil, errors.New("failed to connect to Firebase")
	}

	var budgets []models.Budget
	ref := client.NewRef("budgets").OrderByChild("user_id").EqualTo(userID)
	if err := ref.Get(ctx, &budgets); err != nil {
		return nil, errors.New("failed to fetch budgets")
	}

	return budgets, nil
}

func CreateBudget(budget models.Budget) error {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return errors.New("failed to connect to Firebase")
	}

	// Gunakan Push untuk membuat node baru di Firebase
	ref, err := client.NewRef("budgets").Push(ctx, budget)
	if err != nil {
		return errors.New("failed to create budget")
	}

	// Ambil ID node baru dan tetapkan ke BudgetID
	budget.BudgetID = ref.Key

	return nil
}

func UpdateBudget(budget models.Budget) error {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return errors.New("failed to connect to Firebase")
	}

	ref := client.NewRef("budgets/" + budget.BudgetID)
	if err := ref.Set(ctx, budget); err != nil {
		return errors.New("failed to update budget")
	}

	return nil
}
