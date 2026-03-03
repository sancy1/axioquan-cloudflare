
# infrastructure/global/outputs.tf
# Placeholder for any global-level outputs
# Actual outputs are defined per environment

output "global_config_note" {
  description = "Reminder about global configuration"
  value       = "Global config loaded. Environment-specific outputs are in each environment folder."
}