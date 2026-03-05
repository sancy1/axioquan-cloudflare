
# infrastructure/modules/render/variables.tf

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment: dev, staging, prod"
  type        = string
}

variable "github_owner" {
  description = "GitHub username"
  type        = string
}

variable "github_repo_name" {
  description = "GitHub repository name"
  type        = string
}

variable "production_branch" {
  description = "Production branch name"
  type        = string
  default     = "main"
}

variable "database_url" {
  description = "Database connection URL"
  type        = string
  sensitive   = true
}

variable "nextauth_secret" {
  description = "NextAuth secret key"
  type        = string
  sensitive   = true
}

variable "nextauth_url" {
  description = "Full deployed app URL"
  type        = string
}

variable "cloudinary_cloud_name" {
  description = "Cloudinary cloud name"
  type        = string
  default     = ""
}

variable "cloudinary_api_key" {
  description = "Cloudinary API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "cloudinary_api_secret" {
  description = "Cloudinary API secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "smtp_host" {
  description = "SMTP server host"
  type        = string
  default     = ""
}

variable "smtp_port" {
  description = "SMTP server port"
  type        = string
  default     = "587"
}

variable "smtp_user" {
  description = "SMTP username"
  type        = string
  default     = ""
}

variable "smtp_password" {
  description = "SMTP password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "smtp_from" {
  description = "SMTP from address"
  type        = string
  default     = ""
}

variable "google_client_id" {
  description = "Google OAuth client ID"
  type        = string
  default     = ""
}

variable "google_client_secret" {
  description = "Google OAuth client secret"
  type        = string
  sensitive   = true
  default     = ""
}