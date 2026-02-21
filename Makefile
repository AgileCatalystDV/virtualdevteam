# Dev helpers — Subscription Tracker
# @Ian — Makefile voor lokale development

.PHONY: db-up db-down db-reset db-validate

db-up:
	docker compose up -d

db-down:
	docker compose down

## Reset naar verse staat: volume weg, opnieuw starten, schema draait via initdb
db-reset:
	docker compose down -v && docker compose up -d

db-validate:
	docker compose exec db psql -U postgres -d subscription_tracker -c "SELECT COUNT(*) FROM categories;"
