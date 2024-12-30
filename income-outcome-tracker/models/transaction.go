package models

type Transaction struct {
	TransactionID string  `json:"transaction_id"`
	UserID        string  `json:"user_id"`
	Amount        float64 `json:"amount"`
	Type          string  `json:"type"`
	Date          string  `json:"date"`
	Description   string  `json:"description"`
}
