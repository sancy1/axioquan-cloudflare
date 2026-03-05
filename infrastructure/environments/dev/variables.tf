# infrastructure/environments/dev/variables.tf

# ── Neon ──────────────────────────────────────────────────────────────────────
variable "neon_api_key" {
  description = "Neon API key"
  type        = string
  sensitive   = true
}

variable "neon_org_id" {
  description = "Neon organization ID"
  type        = string
}

variable "source_neon_project_id" {
  description = "Source Neon project ID"
  type        = string
}

variable "source_neon_branch_id" {
  description = "Source Neon branch ID"
  type        = string
  default     = "main"
}

variable "source_db_connection_uri" {
  description = "Source database connection URI"
  type        = string
  sensitive   = true
}

variable "target_db_connection_uri" {
  description = "Target database connection URI"
  type        = string
  sensitive   = true
  default     = ""
}

variable "neon_region" {
  description = "Neon region"
  type        = string
  default     = "aws-us-east-1"
}

# ── Render ────────────────────────────────────────────────────────────────────
variable "render_api_key" {
  description = "Render API key"
  type        = string
  sensitive   = true
}

variable "render_owner_id" {
  description = "Render owner/team ID"
  type        = string
}

# ── GitHub ────────────────────────────────────────────────────────────────────
variable "github_owner" {
  description = "GitHub username"
  type        = string
}

variable "github_repo_name" {
  description = "GitHub repository name"
  type        = string
}

# ── Auth ──────────────────────────────────────────────────────────────────────
variable "nextauth_secret" {
  description = "NextAuth secret key"
  type        = string
  sensitive   = true
}

variable "nextauth_url" {
  description = "Full deployed app URL"
  type        = string
}

# ── Cloudinary ────────────────────────────────────────────────────────────────
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

# ── SMTP ──────────────────────────────────────────────────────────────────────
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

# ── Google OAuth ──────────────────────────────────────────────────────────────
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

# ── General ───────────────────────────────────────────────────────────────────
variable "project_name" {
  description = "Project name"
  type        = string
  default     = "axio_prod"
}

variable "environment" {
  description = "Environment: dev, staging, prod"
  type        = string
  default     = "dev"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Must be dev, staging, or prod."
  }
}