# GULL Database Schema Documentation

## Overview

This document describes the database schema for the GULL Accounting Management System using Supabase (PostgreSQL).

---

## Tables

### 1. `projects`

Stores user projects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique project identifier |
| `user_id` | UUID | FOREIGN KEY → auth.users(id), NOT NULL | Owner of the project |
| `name` | VARCHAR(255) | NOT NULL | Project name |
| `description` | TEXT | NULLABLE | Project description |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_projects_user_id` on `user_id`
- `idx_projects_created_at` on `created_at DESC`

**Constraints:**
- `projects_name_not_empty`: Name must not be empty after trimming

---

### 2. `transactions`

Stores transaction entries for Akra (2-digit) and Ring (3-digit) numbers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique transaction identifier |
| `project_id` | UUID | FOREIGN KEY → projects(id), NOT NULL | Associated project |
| `user_id` | UUID | FOREIGN KEY → auth.users(id), NOT NULL | Owner of the transaction |
| `number` | VARCHAR(10) | NOT NULL | The number (2 or 3 digits) |
| `entry_type` | VARCHAR(10) | CHECK IN ('akra', 'ring'), NOT NULL | Type of entry |
| `first_amount` | DECIMAL(15, 2) | DEFAULT 0, NOT NULL | First column amount |
| `second_amount` | DECIMAL(15, 2) | DEFAULT 0, NOT NULL | Second column amount |
| `notes` | TEXT | NULLABLE | Optional notes |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_transactions_project_id` on `project_id`
- `idx_transactions_user_id` on `user_id`
- `idx_transactions_number` on `number`
- `idx_transactions_entry_type` on `entry_type`
- `idx_transactions_created_at` on `created_at DESC`

**Constraints:**
- `transactions_number_format`: 
  - If `entry_type = 'akra'`, `number` length must be 2
  - If `entry_type = 'ring'`, `number` length must be 3
- `transactions_amounts_positive`: Both amounts must be >= 0

---

### 3. `action_history`

Stores history of user actions for undo/redo functionality.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique history entry identifier |
| `project_id` | UUID | FOREIGN KEY → projects(id), NOT NULL | Associated project |
| `user_id` | UUID | FOREIGN KEY → auth.users(id), NOT NULL | User who performed the action |
| `action_type` | VARCHAR(20) | CHECK IN ('add', 'edit', 'delete', 'batch'), NOT NULL | Type of action |
| `description` | TEXT | NOT NULL | Human-readable description |
| `affected_numbers` | TEXT[] | NULLABLE | Array of affected numbers |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Action timestamp |

**Indexes:**
- `idx_action_history_project_id` on `project_id`
- `idx_action_history_user_id` on `user_id`
- `idx_action_history_created_at` on `created_at DESC`

---

### 4. `filter_presets`

Stores saved filter presets for quick access.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique preset identifier |
| `user_id` | UUID | FOREIGN KEY → auth.users(id), NOT NULL | Owner of the preset |
| `name` | VARCHAR(100) | NOT NULL | Preset name |
| `entry_type` | VARCHAR(10) | CHECK IN ('akra', 'ring'), NOT NULL | Type of entry |
| `first_query` | TEXT | NULLABLE | FIRST column filter query |
| `second_query` | TEXT | NULLABLE | SECOND column filter query |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_filter_presets_user_id` on `user_id`
- `idx_filter_presets_entry_type` on `entry_type`

**Constraints:**
- `filter_presets_name_not_empty`: Name must not be empty after trimming

---

### 5. `user_preferences`

Stores user-specific preferences and settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | UUID | PRIMARY KEY, FOREIGN KEY → auth.users(id) | User identifier |
| `theme` | VARCHAR(10) | CHECK IN ('light', 'dark'), DEFAULT 'light' | UI theme preference |
| `language` | VARCHAR(10) | DEFAULT 'en' | Language preference |
| `notifications_enabled` | BOOLEAN | DEFAULT true | Enable/disable notifications |
| `preferences` | JSONB | DEFAULT '{}'::jsonb | Additional preferences as JSON |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

---

## Row Level Security (RLS)

All tables have RLS enabled to ensure users can only access their own data.

### Projects
- **SELECT**: Users can view their own projects (`auth.uid() = user_id`)
- **INSERT**: Users can create their own projects
- **UPDATE**: Users can update their own projects
- **DELETE**: Users can delete their own projects

### Transactions
- **SELECT**: Users can view their own transactions
- **INSERT**: Users can create their own transactions
- **UPDATE**: Users can update their own transactions
- **DELETE**: Users can delete their own transactions

### Action History
- **SELECT**: Users can view their own action history
- **INSERT**: Users can create their own action history

### Filter Presets
- **SELECT**: Users can view their own filter presets
- **INSERT**: Users can create their own filter presets
- **UPDATE**: Users can update their own filter presets
- **DELETE**: Users can delete their own filter presets

### User Preferences
- **SELECT**: Users can view their own preferences
- **INSERT**: Users can insert their own preferences
- **UPDATE**: Users can update their own preferences

---

## Functions & Triggers

### `update_updated_at_column()`

Automatically updates the `updated_at` timestamp when a row is modified.

**Triggers:**
- `update_projects_updated_at` on `projects`
- `update_transactions_updated_at` on `transactions`
- `update_user_preferences_updated_at` on `user_preferences`

---

## Data Relationships

```
auth.users (Supabase Auth)
    ├─> projects (one-to-many)
    │   └─> transactions (one-to-many)
    │   └─> action_history (one-to-many)
    ├─> filter_presets (one-to-many)
    └─> user_preferences (one-to-one)
```

---

## Migration Instructions

### Using Supabase Dashboard

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy contents from `supabase/migrations/001_initial_schema.sql`
5. Run the query
6. Verify tables in **Table Editor**

### Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push

# Or run specific migration
supabase db push supabase/migrations/001_initial_schema.sql
```

---

## Example Queries

### Get all projects for current user
```sql
SELECT * FROM projects WHERE user_id = auth.uid();
```

### Get all transactions for a project
```sql
SELECT * FROM transactions 
WHERE project_id = 'your-project-id' 
AND user_id = auth.uid()
ORDER BY created_at DESC;
```

### Get transaction summary by number
```sql
SELECT 
    number,
    COUNT(*) as entry_count,
    SUM(first_amount) as first_total,
    SUM(second_amount) as second_total
FROM transactions
WHERE project_id = 'your-project-id'
    AND user_id = auth.uid()
    AND entry_type = 'akra'
GROUP BY number
ORDER BY number;
```

### Get user's filter presets
```sql
SELECT * FROM filter_presets
WHERE user_id = auth.uid()
    AND entry_type = 'akra'
ORDER BY created_at DESC;
```

---

## Performance Considerations

1. **Indexes**: All foreign keys and frequently queried columns are indexed
2. **Partitioning**: Consider partitioning `transactions` by `created_at` for large datasets
3. **Archiving**: Implement archiving for old `action_history` records
4. **Cascading Deletes**: Deleting a project automatically deletes all related transactions and history

---

## Security Notes

1. **RLS Enabled**: All tables have Row Level Security enabled
2. **User Isolation**: Users cannot access other users' data
3. **Auth Integration**: All policies check `auth.uid()` for authentication
4. **Validated Data**: Check constraints ensure data integrity
5. **Cascade Protection**: ON DELETE CASCADE prevents orphaned records

---

## Backup & Recovery

Supabase automatically handles backups. For manual backups:

```bash
# Export database
pg_dump -h db.your-project-ref.supabase.co -U postgres -d postgres > backup.sql

# Restore database
psql -h db.your-project-ref.supabase.co -U postgres -d postgres < backup.sql
```

---

## Next Steps

After running the migration:

1. Test RLS policies
2. Insert sample data
3. Verify indexes are being used (EXPLAIN ANALYZE)
4. Set up real-time subscriptions (Phase 6)
5. Implement API service layer (Phase 6)

