
# Module: neon

Creates and configures a Neon PostgreSQL project for a given environment.

## What this module does

1. Creates a new Neon project (`{project_name}-{environment}`)
2. Creates a database role with a secure random password
3. Creates a named database owned by that role
4. Copies the schema (structure only, no data) from a source database using `pg_dump`

## Prerequisites

- `pg_dump` and `psql` must be installed on the machine running `terraform apply`
- Install via: `brew install libpq` (macOS) or `apt install postgresql-client` (Ubuntu/Debian)

## Inputs

| Name | Description | Required |
|------|-------------|----------|
| `source_project_id` | Existing Neon project ID | Yes |
| `source_db_connection_uri` | Source DB connection string for pg_dump | Yes |
| `target_db_connection_uri` | Target DB connection string for schema apply | Yes |
| `project_name` | Base project name | Yes |
| `environment` | dev / staging / prod | Yes |
| `region` | Neon region ID | No |
| `database_name` | Name for new database | No |
| `role_name` | Database username | No |

## Outputs

| Name | Description |
|------|-------------|
| `project_id` | New Neon project ID |
| `default_branch_id` | Default branch ID |
| `database_name` | Database name |
| `role_name` | Database role name |
| `db_password` | Generated password (sensitive) |