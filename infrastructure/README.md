
# Axioquan Infrastructure

Terraform configuration for Axioquan's cloud infrastructure.

## Prerequisites

- Terraform >= 1.5.0 — [Install](https://developer.hashicorp.com/terraform/install)
- PostgreSQL client tools (`pg_dump`, `psql`)
  - macOS: `brew install libpq && brew link --force libpq`
  - Ubuntu/Debian: `sudo apt install postgresql-client`
- Neon API Token — [Neon Console → Account → API Keys](https://console.neon.tech)
- Your existing Neon Project ID: `icy-heart-13822011`

## How to Deploy (Dev Environment)

### Phase 1: Create the Neon project
```bash
cd infrastructure/environments/dev
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars: add neon_api_key, source project ID, source connection URI
# Leave target_db_connection_uri empty for now

terraform init
terraform plan
terraform apply
```

### Phase 2: Copy the schema

After Phase 1 completes:
1. Go to [Neon Console](https://console.neon.tech) → find your new project `axioquan-dev`
2. Copy the connection string for `axioquan_dev` database
3. Paste it as `target_db_connection_uri` in `terraform.tfvars`
4. Run `terraform apply` again — this triggers the schema copy

### Get outputs
```bash
terraform output neon_project_id
terraform output -json   # see all outputs
```

## Git Cleanup (Disconnect from old GitHub repo)
```bash
cd axioquan/          # your project root
rm -rf .git           # remove all git history and remote connections
git init              # fresh repo
git add .
git commit -m "Initial commit: Axioquan with Terraform infrastructure"

# After creating a NEW repo on GitHub:
git remote add origin https://github.com/yourusername/axioquan.git
git branch -M main
git push -u origin main
```

## Module Structure
```
modules/
  neon/       — Neon PostgreSQL project, database, role, schema copy
  vercel/     — (coming next)
  cloudflare/ — (placeholder for future)
```

## Security

- Never commit `terraform.tfvars` — it contains secrets
- `*.tfstate` files are gitignored — they contain plaintext passwords
- Sensitive outputs require: `terraform output -raw database_password`