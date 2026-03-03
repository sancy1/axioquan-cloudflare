terraform {
  required_providers {
    neon   = { source = "kislerdm/neon", version = "~> 0.6.3" }
    random = { source = "hashicorp/random", version = "~> 3.5" }
    null   = { source = "hashicorp/null", version = "~> 3.2" }
  }
}

resource "neon_project" "this" {
  # Temporarily remove the -${var.environment} suffix to match "axio_prod" 
  # exactly as it is in the cloud right now.
  name       = var.project_name 
  region_id  = var.region
  pg_version = var.pg_version # MUST BE 17 in your variables
  org_id     = var.neon_org_id
  
  # Set this to 0 if the cloud shows 0 to avoid a change
  history_retention_seconds = 0 

  default_endpoint_settings {
    autoscaling_limit_min_cu = var.autoscaling_min_cu
    autoscaling_limit_max_cu = var.autoscaling_max_cu
  }
}

resource "neon_role" "this" {
  project_id = neon_project.this.id
  branch_id  = neon_project.this.default_branch_id
  name       = var.role_name
}

resource "random_password" "db" {
  length           = 32
  special          = true
  # Adding these to match the "Refresh" state you saw earlier
  min_lower        = 2
  min_numeric      = 2
  min_special      = 2
  min_upper        = 2
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "neon_database" "this" {
  project_id = neon_project.this.id
  branch_id  = neon_project.this.default_branch_id
  name       = var.database_name
  owner_name = neon_role.this.name
  depends_on = [neon_role.this]
}

# DISABLED to protect existing data
/*
resource "null_resource" "copy_schema" {
  triggers = {
    target_project_id = neon_project.this.id
    target_database   = neon_database.this.name
    source_project_id = var.source_project_id
  }
}
*/