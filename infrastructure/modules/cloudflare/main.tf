# # infrastructure/modules/cloudflare/main.tf
# # Deploys Axioquan as a Cloudflare Pages project

# terraform {
#   required_providers {
#     cloudflare = {
#       source  = "cloudflare/cloudflare"
#       version = "~> 4.0"
#     }
#   }
# }

# # ── Cloudflare Pages Project ──────────────────────────────────────────────────
# resource "cloudflare_pages_project" "this" {
#   account_id        = var.cloudflare_account_id
#   name              = "${var.project_name}-${var.environment}"
#   production_branch = var.production_branch

#   # ── GitHub Connection ────────────────────────────────────────────────────────
#   source {
#     type = "github"
#     config {
#       owner                         = var.github_owner
#       repo_name                     = var.github_repo_name
#       production_branch             = var.production_branch
#       pr_comments_enabled           = true
#       deployments_enabled           = true
#       production_deployment_enabled = true
#       preview_deployment_setting    = "all"
#       preview_branch_excludes       = [var.production_branch]
#     }
#   }

#   # ── Build Settings ───────────────────────────────────────────────────────────
#   build_config {
#     build_command   = "npx @cloudflare/next-on-pages"
#     destination_dir = ".vercel/output/static"
#     root_dir        = ""
#   }

#   # ── Deployment Config ────────────────────────────────────────────────────────
#   deployment_configs {
#     production {
#       environment_variables = {
#         NODE_VERSION          = "20"
#         NODE_ENV              = "production"
#         NEXTAUTH_URL          = var.nextauth_url
#         SMTP_HOST             = var.smtp_host
#         SMTP_PORT             = var.smtp_port
#         SMTP_USER             = var.smtp_user
#         SMTP_FROM             = var.smtp_from
#         GOOGLE_CLIENT_ID      = var.google_client_id
#         CLOUDINARY_CLOUD_NAME = var.cloudinary_cloud_name
#         DATABASE_URL          = var.database_url
#         NEXTAUTH_SECRET       = var.nextauth_secret
#         CLOUDINARY_API_KEY    = var.cloudinary_api_key
#         CLOUDINARY_API_SECRET = var.cloudinary_api_secret
#         SMTP_PASSWORD         = var.smtp_password
#         GOOGLE_CLIENT_SECRET  = var.google_client_secret
#       }
#       compatibility_date  = "2024-09-23"
#       compatibility_flags = ["nodejs_compat"]
#     }

#     preview {
#       environment_variables = {
#         NODE_VERSION          = "20"
#         NODE_ENV              = "preview"
#         NEXTAUTH_URL          = var.nextauth_url
#         SMTP_HOST             = var.smtp_host
#         SMTP_PORT             = var.smtp_port
#         SMTP_USER             = var.smtp_user
#         SMTP_FROM             = var.smtp_from
#         GOOGLE_CLIENT_ID      = var.google_client_id
#         CLOUDINARY_CLOUD_NAME = var.cloudinary_cloud_name
#         DATABASE_URL          = var.database_url
#         NEXTAUTH_SECRET       = var.nextauth_secret
#         CLOUDINARY_API_KEY    = var.cloudinary_api_key
#         CLOUDINARY_API_SECRET = var.cloudinary_api_secret
#         SMTP_PASSWORD         = var.smtp_password
#         GOOGLE_CLIENT_SECRET  = var.google_client_secret
#       }
#       compatibility_date  = "2024-09-23"
#       compatibility_flags = ["nodejs_compat"]
#     }
#   }
# }


























# infrastructure/modules/cloudflare/main.tf
# Direct Upload mode — GitHub Actions deploys via Wrangler

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

resource "cloudflare_pages_project" "this" {
  account_id        = var.cloudflare_account_id
  name              = "${var.project_name}-${var.environment}"
  production_branch = var.production_branch

  build_config {
    build_command   = "npx @cloudflare/next-on-pages"
    destination_dir = ".vercel/output/static"
    root_dir        = ""
  }

  deployment_configs {
    production {
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
        DATABASE_URL          = var.database_url
        NEXTAUTH_SECRET       = var.nextauth_secret
        CLOUDINARY_API_KEY    = var.cloudinary_api_key
        CLOUDINARY_API_SECRET = var.cloudinary_api_secret
        SMTP_PASSWORD         = var.smtp_password
        GOOGLE_CLIENT_SECRET  = var.google_client_secret
      }
      compatibility_date  = "2024-09-23"
      compatibility_flags = ["nodejs_compat"]
    }

    preview {
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
        DATABASE_URL          = var.database_url
        NEXTAUTH_SECRET       = var.nextauth_secret
        CLOUDINARY_API_KEY    = var.cloudinary_api_key
        CLOUDINARY_API_SECRET = var.cloudinary_api_secret
        SMTP_PASSWORD         = var.smtp_password
        GOOGLE_CLIENT_SECRET  = var.google_client_secret
      }
      compatibility_date  = "2024-09-23"
      compatibility_flags = ["nodejs_compat"]
    }
  }
}

