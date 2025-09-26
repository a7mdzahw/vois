# Generate migrations
db_generate:
	pnpm db:generate

# Migrate the database
db_migrate:
	pnpm db:migrate

# Run the project
reservations_dev:
	pnpm nx dev reservations
