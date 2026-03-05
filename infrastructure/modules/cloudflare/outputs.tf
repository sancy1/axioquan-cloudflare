# infrastructure/modules/cloudflare/outputs.tf

output "pages_project_name" {
  description = "Cloudflare Pages project name"
  value       = cloudflare_pages_project.this.name
}

output "pages_project_id" {
  description = "Cloudflare Pages project ID"
  value       = cloudflare_pages_project.this.id
}

output "subdomain" {
  description = "Auto-assigned .pages.dev subdomain"
  value       = cloudflare_pages_project.this.subdomain
}

output "app_url" {
  description = "Live application URL"
  value       = "https://${cloudflare_pages_project.this.subdomain}"
}

output "custom_domain_status" {
  description = "Custom domain status"
  value       = "No custom domain configured — using auto-generated .pages.dev"
}