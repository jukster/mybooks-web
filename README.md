# Mybooks

## Database migrations

Database migrations are handled with Supabase CLI. To make a new migration, run the following command:

```bash
supabase migration new create-books-schema
```

This will create a new migration file in the `migrations` directory.

Add the changes you want to make to the new file, then run the following command to apply the migration:

```bash
supabase migration up
```

