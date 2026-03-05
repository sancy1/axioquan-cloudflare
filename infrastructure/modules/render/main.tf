
# infrastructure/modules/render/main.tf
# Manages Render Web Service for Axioquan Next.js app

terraform {
  required_providers {
    render = {
      source  = "render-oss/render"
      version = "~> 1.3"
    }
  }
}

resource "render_web_service" "app" {
  name   = "${var.project_name}-${var.environment}"
  plan   = "free"
  region = "oregon"

  runtime_source = {
    docker = {
      repo_url       = "https://github.com/${var.github_owner}/${var.github_repo_name}"
      branch         = var.production_branch
      dockerfile_path = "./Dockerfile"
      context        = "."
      target         = "production"
    }
  }

  env_vars = {
    NODE_ENV = {
      value = "production"
    }
    NEXTAUTH_URL = {
      value = var.nextauth_url
    }
    DATABASE_URL = {
      value = var.database_url
    }
    NEXTAUTH_SECRET = {
      value = var.nextauth_secret
    }
    SMTP_HOST = {
      value = var.smtp_host
    }
    SMTP_PORT = {
      value = var.smtp_port
    }
    SMTP_USER = {
      value = var.smtp_user
    }
    SMTP_PASSWORD = {
      value = var.smtp_password
    }
    SMTP_FROM = {
      value = var.smtp_from
    }
    GOOGLE_CLIENT_ID = {
      value = var.google_client_id
    }
    GOOGLE_CLIENT_SECRET = {
      value = var.google_client_secret
    }
    CLOUDINARY_CLOUD_NAME = {
      value = var.cloudinary_cloud_name
    }
    CLOUDINARY_API_KEY = {
      value = var.cloudinary_api_key
    }
    CLOUDINARY_API_SECRET = {
      value = var.cloudinary_api_secret
    }
  }
}