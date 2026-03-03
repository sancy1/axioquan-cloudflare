# infrastructure/environments/dev/main.tf

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    neon = {
      source  = "kislerdm/neon"
      version = "0.6.3"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# ── Providers ─────────────────────────────────────────────────────────────────
provider "neon" {
  api_key = var.neon_api_key
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# ── Neon Database Module ──────────────────────────────────────────────────────
module "neon" {
  source = "../../modules/neon"

  source_project_id        = var.source_neon_project_id
  source_db_connection_uri = var.source_db_connection_uri
  target_db_connection_uri = var.target_db_connection_uri

  project_name       = var.project_name
  environment        = var.environment
  region             = var.neon_region
  database_name      = "axio_prod"
  role_name          = "neondb_owner"
  pg_version         = 17
  autoscaling_min_cu = 0.25
  autoscaling_max_cu = 2
  neon_org_id        = var.neon_org_id
}

# ── Cloudflare Pages Module ───────────────────────────────────────────────────
module "cloudflare" {
  source = "../../modules/cloudflare"

  cloudflare_account_id = var.cloudflare_account_id
  project_name          = "axio-prod" 
  environment           = var.environment
  github_owner          = var.github_owner
  github_repo_name      = var.github_repo_name
  production_branch     = "main"

  database_url    = var.target_db_connection_uri
  nextauth_secret = var.nextauth_secret
  nextauth_url    = var.nextauth_url

  cloudinary_cloud_name = var.cloudinary_cloud_name
  cloudinary_api_key    = var.cloudinary_api_key
  cloudinary_api_secret = var.cloudinary_api_secret

  smtp_host     = var.smtp_host
  smtp_port     = var.smtp_port
  smtp_user     = var.smtp_user
  smtp_password = var.smtp_password
  smtp_from     = var.smtp_from

  google_client_id     = var.google_client_id
  google_client_secret = var.google_client_secret
}