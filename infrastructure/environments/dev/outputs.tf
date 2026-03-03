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

# ── Cloudflare Outputs ────────────────────────────────────────────────────────
output "cloudflare_project_name" {
  description = "Cloudflare Pages project name"
  value       = module.cloudflare.pages_project_name
}

output "app_url" {
  description = "Live application URL"
  value       = module.cloudflare.app_url
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
    Cloudflare Project : ${module.cloudflare.pages_project_name}
    Live URL           : ${module.cloudflare.app_url}

    ── Next Steps ────────────────────────────────
    1. Create GitHub repo: github.com/sancy1/axioquan
    2. Push your code to GitHub
    3. Cloudflare auto-deploys on every push to main
    4. Update NEXTAUTH_URL in Terraform Cloud if URL differs
    5. Run: terraform output -raw database_password

  EOT
}