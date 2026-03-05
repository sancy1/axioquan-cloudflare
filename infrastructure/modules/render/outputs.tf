
# infrastructure/modules/render/outputs.tf

output "service_id" {
  description = "Render service ID"
  value       = render_web_service.app.id
}

output "service_name" {
  description = "Render service name"
  value       = render_web_service.app.name
}

output "app_url" {
  description = "Live application URL"
  value       = "https://${render_web_service.app.name}.onrender.com"
}