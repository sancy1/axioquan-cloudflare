
# infrastructure/backend.tf
# Terraform state backend configuration.
# Using local for now — upgrade to remote (Terraform Cloud or S3) for team use.

# terraform {
#   backend "local" {
#     path = "terraform.tfstate"
#   }

#   # ── Remote backend (uncomment when ready) ──────────────────────────────────
#   # backend "remote" {
#   #   organization = "your-org-name"
#   #   workspaces {
#   #     prefix = "axioquan-"
#   #   }
#   # }
#   # ───────────────────────────────────────────────────────────────────────────
# }


# infrastructure/environments/dev/backend.tf

terraform {
  cloud {
    organization = "axioquan"

    workspaces {
      name = "axio-dev"
    }
  }
}