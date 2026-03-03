output "project_id" {
  value = neon_project.this.id
}

output "project_name" {
  value = neon_project.this.name
}

output "default_branch_id" {
  value = neon_project.this.default_branch_id
}

output "database_name" {
  value = neon_database.this.name
}

output "role_name" {
  value = neon_role.this.name
}

output "db_password" {
  value     = random_password.db.result
  sensitive = true
}