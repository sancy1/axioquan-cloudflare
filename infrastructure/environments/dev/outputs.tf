# infrastructure/environments/dev/outputs.tf

# ── Neon Outputs ──────────────────────────────────────────────────────────────
output "neon_project_id" {
  description = "Neon project ID"
  value       = module.neon.project_id
}

output "neon_project_name" {
  description = "Neon project name"
  value       = module.neon.project_name
}

output "database_name" {
  description = "Database name"
  value       = module.neon.database_name
}

output "database_role" {
  description = "Database username"
  value       = module.neon.role_name
}

output "database_password" {
  description = "Generated database password"
  value       = module.neon.db_password
  sensitive   = true
}

# ── Render Outputs ────────────────────────────────────────────────────────────
output "render_service_id" {
  description = "Render service ID"
  value       = module.render.service_id
}

output "render_service_name" {
  description = "Render service name"
  value       = module.render.service_name
}

output "app_url" {
  description = "Live application URL"
  value       = module.render.app_url
}

# ── Deployment Summary ────────────────────────────────────────────────────────
output "deployment_summary" {
  description = "Full deployment summary"
  value       = <<-EOT

    ✅ Axioquan Infrastructure Ready!

    ── Database ──────────────────────────────────
    Project  : ${module.neon.project_name}
    Database : ${module.neon.database_name}
    Role     : ${module.neon.role_name}

    ── Application ───────────────────────────────
    Render Service : ${module.render.service_name}
    Live URL       : ${module.render.app_url}

    ── Next Steps ────────────────────────────────
    1. Copy Render service ID to GitHub secret RENDER_SERVICE_ID
    2. Every git push to main auto-deploys via GitHub Actions
    3. Run: terraform output -raw database_password

  EOT
}