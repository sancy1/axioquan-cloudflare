
# infrastructure/modules/neon/variables.tf

variable "source_project_id" {
  description = "ID of the existing source Neon project"
  type        = string
}

variable "source_db_connection_uri" {
  description = "Full PostgreSQL connection URI for the source database (used for pg_dump)"
  type        = string
  sensitive   = true
}

variable "target_db_connection_uri" {
  description = "Full PostgreSQL connection URI for the newly created target database (used for psql apply)"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Project name (used in Neon project naming)"
  type        = string
}

variable "environment" {
  description = "Environment name: dev, staging, or prod"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Must be dev, staging, or prod."
  }
}

variable "region" {
  description = "Neon region ID (e.g. aws-us-east-1)"
  type        = string
  default     = "aws-us-east-1"
}

variable "database_name" {
  description = "Name of the database to create in the new Neon project"
  type        = string
  default     = "axioquan"
}

variable "role_name" {
  description = "Database role (user) name"
  type        = string
  default     = "axioquan_user"
}

variable "pg_version" {
  description = "PostgreSQL major version"
  type        = number
  default     = 17
}

variable "autoscaling_min_cu" {
  description = "Minimum compute units (0.25 = 0.25 vCPU)"
  type        = number
  default     = 0.25
}

variable "autoscaling_max_cu" {
  description = "Maximum compute units"
  type        = number
  default     = 0.25
}

variable "neon_org_id" {
  description = "The Neon Organization ID"
  type        = string
}