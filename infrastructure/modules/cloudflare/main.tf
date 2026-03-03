# infrastructure/modules/cloudflare/main.tf
# Deploys Axioquan as a Cloudflare Pages project

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# ── Step 1: Create the Pages Project ─────────────────────────────────────────
resource "cloudflare_pages_project" "this" {
  account_id        = var.cloudflare_account_id
  name              = "${var.project_name}-${var.environment}"
  production_branch = var.production_branch
}

# ── Step 2: Connect GitHub Repository ────────────────────────────────────────
resource "cloudflare_pages_project_github_repository" "this" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.this.name
  owner        = var.github_owner
  repo_name    = var.github_repo_name

  production_branch             = var.production_branch
  pr_comments_enabled           = true
  deployments_enabled           = true
  production_deployment_enabled = true
  preview_deployment_setting    = "all"
  preview_branch_excludes       = [var.production_branch]

  depends_on = [cloudflare_pages_project.this]
}

# ── Step 3: Configure Build Settings ─────────────────────────────────────────
resource "cloudflare_pages_project_build_config" "this" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.this.name

  build_command   = "npx @cloudflare/next-on-pages"
  destination_dir = ".vercel/output/static"
  root_dir        = ""

  depends_on = [cloudflare_pages_project.this]
}

# ── Step 4: Production Deployment Config ─────────────────────────────────────
resource "cloudflare_pages_project_deployment_config" "production" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.this.name
  environment  = "production"

  compatibility_date  = "2024-09-23"
  compatibility_flags = ["nodejs_compat"]

  environment_variables = {
    NODE_VERSION          = "20"
    NODE_ENV              = "production"
    NEXTAUTH_URL          = var.nextauth_url
    SMTP_HOST             = var.smtp_host
    SMTP_PORT             = var.smtp_port
    SMTP_USER             = var.smtp_user
    SMTP_FROM             = var.smtp_from
    GOOGLE_CLIENT_ID      = var.google_client_id
    CLOUDINARY_CLOUD_NAME = var.cloudinary_cloud_name
  }

  secrets = {
    DATABASE_URL          = var.database_url
    NEXTAUTH_SECRET       = var.nextauth_secret
    CLOUDINARY_API_KEY    = var.cloudinary_api_key
    CLOUDINARY_API_SECRET = var.cloudinary_api_secret
    SMTP_PASSWORD         = var.smtp_password
    GOOGLE_CLIENT_SECRET  = var.google_client_secret
  }

  depends_on = [cloudflare_pages_project.this]
}

# ── Step 5: Preview Deployment Config ────────────────────────────────────────
resource "cloudflare_pages_project_deployment_config" "preview" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.this.name
  environment  = "preview"

  compatibility_date  = "2024-09-23"
  compatibility_flags = ["nodejs_compat"]

  environment_variables = {
    NODE_VERSION          = "20"
    NODE_ENV              = "preview"
    NEXTAUTH_URL          = var.nextauth_url
    SMTP_HOST             = var.smtp_host
    SMTP_PORT             = var.smtp_port
    SMTP_USER             = var.smtp_user
    SMTP_FROM             = var.smtp_from
    GOOGLE_CLIENT_ID      = var.google_client_id
    CLOUDINARY_CLOUD_NAME = var.cloudinary_cloud_name
  }

  secrets = {
    DATABASE_URL          = var.database_url
    NEXTAUTH_SECRET       = var.nextauth_secret
    CLOUDINARY_API_KEY    = var.cloudinary_api_key
    CLOUDINARY_API_SECRET = var.cloudinary_api_secret
    SMTP_PASSWORD         = var.smtp_password
    GOOGLE_CLIENT_SECRET  = var.google_client_secret
  }

  depends_on = [cloudflare_pages_project.this]
}