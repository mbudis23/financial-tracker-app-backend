package models

type Budget struct {
	BudgetID     string  `json:"budget_id"`
	UserID       string  `json:"user_id"`
	MonthlyLimit float64 `json:"monthly_limit"`
}
