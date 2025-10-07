# Laravel Migration & Seeding Error Documentation

This document provides a comprehensive guide to understanding and resolving common Laravel errors encountered during database migrations and seeding.

---

## Table of Contents
1. [Error 1: Class Not Found - Model Missing](#error-1-class-not-found---model-missing)
2. [Error 2: Duplicate Entry - Unique Constraint Violation](#error-2-duplicate-entry---unique-constraint-violation)
3. [Error 3: Table Not Found](#error-3-table-not-found)
4. [Error 4: Column Not Found](#error-4-column-not-found)
5. [Best Practices](#best-practices)
6. [Prevention Checklist](#prevention-checklist)

---

## Error 1: Class Not Found - Model Missing

### Error Message
```
Error: Class "App\Models\Man" not found
at database\seeders\ManSeeder.php:11
```

### What Happened?
The seeder file `ManSeeder.php` was trying to use a model class called `Man`, but Laravel couldn't find this model file in the `app/Models` directory.

### Why It Happened?
1. **Model file doesn't exist**: The `Man.php` model file was never created
2. **Wrong namespace**: The model exists but has incorrect namespace
3. **Missing import statement**: The seeder doesn't have `use App\Models\Man;` at the top
4. **Typo in class name**: Mismatched naming between import and actual class

### How It Works (Technical Explanation)
- **Eloquent ORM**: Laravel uses Eloquent as its Object-Relational Mapping (ORM) system
- **Models**: Each database table typically has a corresponding Model class
- **Autoloading**: Laravel uses PSR-4 autoloading, which maps namespaces to directory structures
- When you call `Man::create()`, PHP looks for `App\Models\Man` class
- If the file doesn't exist at `app/Models/Man.php`, it throws this error

### Solution Steps

#### Step 1: Create the Model
```bash
php artisan make:model Man
```

This creates `app/Models/Man.php` with basic structure:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Man extends Model
{
    //
}
```

#### Step 2: Add Fillable Fields (Mass Assignment Protection)
```php
class Man extends Model
{
    protected $fillable = ['name', 'email'];
}
```

**Why `$fillable` is needed:**
- Laravel has **mass assignment protection** to prevent security vulnerabilities
- Without `$fillable`, calling `Man::create(['name' => 'John'])` will throw `MassAssignmentException`
- `$fillable` is a whitelist of fields that can be mass-assigned
- Alternative: `$guarded = []` (blacklist approach - be careful with this)

#### Step 3: Verify Import in Seeder
Make sure your seeder has:
```php
use App\Models\Man;
```

### How to Prevent
- Always create models before writing seeders
- Use `php artisan make:model ModelName -m` to create model + migration together
- Use `php artisan make:model ModelName -mfs` to create model + migration + factory + seeder

---

## Error 2: Duplicate Entry - Unique Constraint Violation

### Error Message
```
Illuminate\Database\UniqueConstraintViolationException
SQLSTATE[23000]: Integrity constraint violation: 1062
Duplicate entry 'john@example.com' for key 'men_email_unique'
```

### What Happened?
The seeder tried to insert a record with an email (`john@example.com`) that already exists in the database, but the `email` column has a UNIQUE constraint.

### Why It Happened?
1. **Running seeder multiple times**: You ran `php artisan db:seed` more than once
2. **Using `create()` instead of `firstOrCreate()`**: The seeder doesn't check if record exists
3. **UNIQUE constraint in migration**: The migration defined email as unique

### How It Works (Technical Explanation)

#### Database Constraints
```php
// In migration file
$table->string('email')->unique();
```
This creates a UNIQUE index on the `email` column at the database level.

**What happens:**
1. MySQL/PostgreSQL maintains an index of all email values
2. Before inserting, it checks if the value exists
3. If exists → throws error 1062 (duplicate entry)
4. If not exists → inserts successfully

#### Laravel's Insert Methods

**`create()` - Always inserts:**
```php
Man::create(['name' => 'John', 'email' => 'john@example.com']);
// Tries to INSERT every time → fails if exists
```

**`firstOrCreate()` - Checks first:**
```php
Man::firstOrCreate(
    ['email' => 'john@example.com'],  // Search criteria
    ['name' => 'John']                 // Additional data if creating
);
```

**How `firstOrCreate()` works:**
1. Runs: `SELECT * FROM men WHERE email = 'john@example.com'`
2. If found → returns existing record (no INSERT)
3. If not found → runs INSERT with combined data

### Solution

#### Change Seeder to Use `firstOrCreate()`
**Before (Problem):**
```php
public function run(): void
{
    Man::create(['name' => 'John Doe', 'email' => 'john@example.com']);
    Man::create(['name' => 'Jane Smith', 'email' => 'jane@example.com']);
}
```

**After (Solution):**
```php
public function run(): void
{
    Man::firstOrCreate(
        ['email' => 'john@example.com'],
        ['name' => 'John Doe']
    );
    Man::firstOrCreate(
        ['email' => 'jane@example.com'],
        ['name' => 'Jane Smith']
    );
}
```

### Alternative Solutions

#### Option 1: `updateOrCreate()` - Update if exists
```php
Man::updateOrCreate(
    ['email' => 'john@example.com'],
    ['name' => 'John Doe Updated']
);
```

#### Option 2: Truncate before seeding (DANGEROUS - deletes all data)
```php
public function run(): void
{
    Man::truncate(); // Deletes all records
    Man::create(['name' => 'John Doe', 'email' => 'john@example.com']);
}
```

#### Option 3: Fresh migration (Development only)
```bash
php artisan migrate:fresh --seed
```
⚠️ **WARNING**: This drops ALL tables and recreates them!

### How to Prevent
- Use `firstOrCreate()` or `updateOrCreate()` in seeders
- Never use `create()` for records that might already exist
- In production, use migrations for schema changes, not fresh migrations

---

## Error 3: Table Not Found

### Error Message
```
Illuminate\Database\QueryException
SQLSTATE[42S02]: Base table or view not found: 1146
Table 'floretta.admins' doesn't exist
```

### What Happened?
The code is trying to query a table called `admins`, but this table doesn't exist in the database.

### Why It Happened?
1. **Migration not run**: The migration file exists but wasn't executed
2. **Different table name**: The actual table has a different name (e.g., `admin_auth` instead of `admins`)
3. **Wrong database**: Connected to wrong database that doesn't have the table
4. **Migration ran but table wasn't created**: Migration failed silently

### How It Works (Technical Explanation)

#### Eloquent Table Name Convention
Laravel automatically determines table names:
```php
class Man extends Model  → looks for 'men' table (pluralized)
class Admin extends Model → looks for 'admins' table (pluralized)
class Person extends Model → looks for 'people' table (irregular plural)
```

#### Override Table Name
```php
class Admin extends Model
{
    protected $table = 'admin_auth'; // Override default table name
}
```

#### How Laravel Finds Tables
1. Model class name → pluralize using Inflector
2. Convert to snake_case
3. Query that table in configured database

### Solution Steps

#### Step 1: Check if table exists
```bash
php artisan tinker
>>> Schema::hasTable('admins')
=> false

>>> Schema::getTableListing()
=> ["users", "admin_auth", "products", ...]
```

#### Step 2: Check migration status
```bash
php artisan migrate:status
```

Output:
```
Migration name                          Batch / Status
2025_06_21_152041_create_admins_table   [33] Ran
```

**Status meanings:**
- **Ran**: Migration executed successfully
- **Pending**: Migration not run yet

#### Step 3: Identify the issue

**Scenario A: Migration shows "Ran" but table doesn't exist**
- Migration might have errors
- Read the migration file to see what table it actually creates
- Check if table was created with different name

**Scenario B: Migration shows "Pending"**
```bash
php artisan migrate
```

**Scenario C: Different table name exists**
Update the model:
```php
class Admin extends Model
{
    protected $table = 'admin_auth'; // Use existing table
}
```

### Real Example from Your Case

**Investigation:**
```bash
>>> Schema::getTableListing()
# Found: admin_auth (not admins)
```

**Migration file showed:**
```php
Schema::create('admins', function (Blueprint $table) {
    // ...
});
```

**But actual table was `admin_auth`**

**Solution:**
```php
class Admin extends Model
{
    protected $table = 'admin_auth';
}
```

### How to Prevent
- Always run `php artisan migrate:status` to verify migrations
- Use consistent naming: if table is `admin_auth`, model should reflect this
- Check database directly using tools like phpMyAdmin or TablePlus
- Use `php artisan tinker` to verify table existence before writing code

---

## Error 4: Column Not Found

### Error Message
```
Illuminate\Database\QueryException
SQLSTATE[42S22]: Column not found: 1054
Unknown column 'name' in 'field list'
```

### What Happened?
The code is trying to insert/update a column called `name`, but this column doesn't exist in the table.

### Why It Happened?
1. **Migration doesn't define column**: The migration didn't create a `name` column
2. **Typo in column name**: Migration has `full_name` but code uses `name`
3. **Migration not run**: Column was added in a new migration that hasn't run
4. **Wrong table**: Operating on a table that has different structure

### How It Works (Technical Explanation)

#### Mass Assignment Flow
```php
Admin::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => 'hashed_password'
]);
```

**What Laravel does:**
1. Checks `$fillable` array in model
2. Filters out non-fillable fields
3. Builds SQL: `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)`
4. Database validates column existence
5. If column doesn't exist → Error 1054

#### Model Fillable vs Database Columns
```php
// Model says these are fillable
protected $fillable = ['name', 'email', 'password'];

// But database only has these columns:
// id, email, password, created_at, updated_at
// ❌ 'name' is missing!
```

### Solution Steps

#### Step 1: Check actual table structure
```bash
php artisan tinker
>>> Schema::getColumnListing('admin_auth')
=> ["id", "email", "password", "created_at", "updated_at"]
```

#### Step 2: Compare with model's `$fillable`
```php
protected $fillable = ['name', 'email', 'password'];
//                      ^^^^^^ This doesn't exist!
```

#### Step 3: Fix the mismatch

**Option A: Remove from fillable** (if column not needed)
```php
protected $fillable = ['email', 'password']; // Removed 'name'
```

**Option B: Add column to database** (if column is needed)
```bash
php artisan make:migration add_name_to_admin_auth_table
```

```php
public function up()
{
    Schema::table('admin_auth', function (Blueprint $table) {
        $table->string('name')->nullable()->after('id');
    });
}

public function down()
{
    Schema::table('admin_auth', function (Blueprint $table) {
        $table->dropColumn('name');
    });
}
```

Then run:
```bash
php artisan migrate
```

#### Step 4: Update seeder to match
```php
Admin::firstOrCreate(
    ['email' => 'admin@floretta.com'],
    ['password' => Hash::make('admin123')]
    // Removed 'name' => 'Admin'
);
```

### How to Prevent
- Always check table structure before writing seeders
- Keep `$fillable` in sync with actual database columns
- Use migrations to add new columns, don't manually alter database
- Write tests to catch schema mismatches

---

## Best Practices

### 1. Development Workflow
```bash
# Correct order:
1. php artisan make:model Product -m        # Create model + migration
2. Edit migration file (add columns)
3. php artisan migrate                      # Run migration
4. Edit model (add $fillable)
5. php artisan make:seeder ProductSeeder    # Create seeder
6. Edit seeder (add data)
7. php artisan db:seed --class=ProductSeeder
```

### 2. Migration Best Practices

#### Always be specific with column definitions
```php
// ❌ Bad
$table->string('email');

// ✅ Good
$table->string('email', 100)->unique()->index();
```

#### Add indexes for foreign keys
```php
$table->foreignId('user_id')->constrained()->onDelete('cascade');
```

#### Use nullable for optional fields
```php
$table->string('middle_name')->nullable();
```

### 3. Seeder Best Practices

#### Use firstOrCreate for unique records
```php
User::firstOrCreate(
    ['email' => 'admin@example.com'],
    [
        'name' => 'Admin',
        'password' => Hash::make('password')
    ]
);
```

#### Use factories for bulk data
```php
// Instead of manual create() calls
User::factory()->count(50)->create();
```

#### Disable events if needed
```php
Model::withoutEvents(function () {
    User::create([...]);
});
```

### 4. Model Best Practices

#### Always define fillable or guarded
```php
// Option 1: Whitelist (recommended)
protected $fillable = ['name', 'email', 'password'];

// Option 2: Blacklist (use carefully)
protected $guarded = ['id', 'created_at', 'updated_at'];
```

#### Hide sensitive fields
```php
protected $hidden = ['password', 'remember_token'];
```

#### Cast attributes
```php
protected $casts = [
    'email_verified_at' => 'datetime',
    'is_active' => 'boolean',
    'metadata' => 'array'
];
```

---

## Prevention Checklist

### Before Running Migrations
- [ ] Migration file syntax is correct
- [ ] All column types are appropriate
- [ ] Foreign keys have proper constraints
- [ ] Indexes are added where needed
- [ ] `down()` method properly reverses `up()` method

### Before Running Seeders
- [ ] All required models exist
- [ ] Models have `$fillable` or `$guarded` defined
- [ ] Database tables exist (run migrations first)
- [ ] Column names match between seeder and database
- [ ] Use `firstOrCreate()` for unique records
- [ ] Test seeders can be run multiple times safely

### After Database Changes
- [ ] Run `php artisan migrate:status` to verify
- [ ] Check actual database structure matches expectations
- [ ] Clear caches: `php artisan cache:clear && php artisan config:clear`
- [ ] Update documentation
- [ ] Commit migration files to version control

---

## Troubleshooting Commands

### Check Database Connection
```bash
php artisan tinker
>>> DB::connection()->getPdo()
```

### List All Tables
```bash
php artisan tinker
>>> Schema::getTableListing()
```

### Check Table Columns
```bash
php artisan tinker
>>> Schema::getColumnListing('table_name')
```

### Check Migration Status
```bash
php artisan migrate:status
```

### Rollback Last Migration
```bash
php artisan migrate:rollback
```

### Rollback All Migrations
```bash
php artisan migrate:reset
```

### Fresh Start (⚠️ Deletes all data)
```bash
php artisan migrate:fresh --seed
```

### Run Specific Seeder
```bash
php artisan db:seed --class=UserSeeder
```

---

## Common Error Codes Reference

| Error Code | Meaning | Common Cause |
|------------|---------|--------------|
| 1054 | Unknown column | Column doesn't exist in table |
| 1062 | Duplicate entry | Unique constraint violation |
| 1146 | Table doesn't exist | Migration not run or wrong table name |
| 1452 | Foreign key constraint fails | Referenced record doesn't exist |
| 23000 | Integrity constraint violation | Violates UNIQUE, NOT NULL, or FK constraint |
| 42S02 | Base table or view not found | Table doesn't exist |
| 42S22 | Column not found | Column doesn't exist |

---

## Your Specific Error Journey

### Timeline of Errors Fixed

1. **Error**: `Class "App\Models\Man" not found`
   - **Fix**: Created `Man` model with `php artisan make:model Man`
   - **Added**: `protected $fillable = ['name', 'email'];`

2. **Error**: `Class "App\Models\Admin" not found`
   - **Fix**: Created `Admin` model with `php artisan make:model Admin`

3. **Error**: `Duplicate entry 'john@example.com'`
   - **Fix**: Changed `create()` to `firstOrCreate()` in `ManSeeder`

4. **Error**: `Table 'floretta.admins' doesn't exist`
   - **Investigation**: Found table is actually named `admin_auth`
   - **Fix**: Added `protected $table = 'admin_auth';` to `Admin` model

5. **Error**: `Unknown column 'name'`
   - **Investigation**: Table `admin_auth` only has: id, email, password, timestamps
   - **Fix**: Removed `'name'` from `$fillable` and seeder

### Final Working Code

**app/Models/Man.php**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Man extends Model
{
    protected $fillable = ['name', 'email'];
}
```

**app/Models/Admin.php**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'admin_auth';
    protected $fillable = ['email', 'password'];
    protected $hidden = ['password'];
}
```

**database/seeders/ManSeeder.php**
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Man;

class ManSeeder extends Seeder
{
    public function run(): void
    {
        Man::firstOrCreate(
            ['email' => 'john@example.com'],
            ['name' => 'John Doe']
        );
        Man::firstOrCreate(
            ['email' => 'jane@example.com'],
            ['name' => 'Jane Smith']
        );
    }
}
```

**database/seeders/AdminSeeder.php**
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::firstOrCreate(
            ['email' => 'admin@floretta.com'],
            ['password' => Hash::make('admin123')]
        );
    }
}
```

---

## Summary

All errors were related to:
1. **Missing files** (models not created)
2. **Schema mismatches** (code expects columns/tables that don't exist)
3. **Data integrity** (trying to insert duplicates)

**Key Lessons:**
- Always create models before seeders
- Use `firstOrCreate()` for seeders with unique constraints
- Verify table/column names match between code and database
- Check actual database structure, don't assume
- Keep `$fillable` in sync with database columns

---

**Document Version**: 1.0
**Last Updated**: 2025-10-07
**Project**: Floretta India Backend
