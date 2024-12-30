package services

import (
	"context"
	"errors"
	"time"

	"income-outcome-tracker/config"
	"income-outcome-tracker/models"
)

type MonthlyReport struct {
	Income  float64 `json:"income"`
	Expense float64 `json:"expense"`
}

func GetMonthlyReport(userID string) (*MonthlyReport, error) {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return nil, errors.New("failed to connect to Firebase")
	}

	// Ambil semua transaksi untuk user tertentu
	var transactions map[string]models.Transaction
	ref := client.NewRef("transactions").OrderByChild("user_id").EqualTo(userID)
	if err := ref.Get(ctx, &transactions); err != nil {
		return nil, errors.New("failed to fetch transactions")
	}

	// Hitung income dan expense untuk bulan ini
	now := time.Now()
	currentMonth := now.Month()
	currentYear := now.Year()

	var report MonthlyReport
	for _, transaction := range transactions {
		// Parsing tanggal transaksi
		t, err := time.Parse("2006-01-02", transaction.Date)
		if err != nil {
			continue // Abaikan transaksi dengan format tanggal yang tidak valid
		}

		if t.Year() == currentYear && t.Month() == currentMonth {
			if transaction.Type == "income" {
				report.Income += transaction.Amount
			} else if transaction.Type == "expense" {
				report.Expense += transaction.Amount
			}
		}
	}

	return &report, nil
}

type YearlyReport struct {
	Income  float64 `json:"income"`
	Expense float64 `json:"expense"`
}

func GetYearlyReport(userID string) (*YearlyReport, error) {
	ctx := context.Background()
	client, err := config.FirebaseApp.Database(ctx)
	if err != nil {
		return nil, errors.New("failed to connect to Firebase")
	}

	// Ambil semua transaksi untuk user tertentu
	var transactions map[string]models.Transaction
	ref := client.NewRef("transactions").OrderByChild("user_id").EqualTo(userID)
	if err := ref.Get(ctx, &transactions); err != nil {
		return nil, errors.New("failed to fetch transactions")
	}

	// Hitung income dan expense untuk tahun ini
	now := time.Now()
	currentYear := now.Year()

	var report YearlyReport
	for _, transaction := range transactions {
		// Parsing tanggal transaksi
		t, err := time.Parse("2006-01-02", transaction.Date)
		if err != nil {
			continue // Abaikan transaksi dengan format tanggal yang tidak valid
		}

		if t.Year() == currentYear {
			if transaction.Type == "income" {
				report.Income += transaction.Amount
			} else if transaction.Type == "expense" {
				report.Expense += transaction.Amount
			}
		}
	}

	return &report, nil
}
