# infrastructure/global/variables.tf
# Shared variable definitions referenced across environments

variable "neon_api_key" {
  description = "Neon API key for authentication"
  type        = string
  sensitive   = true
}

variable "source_neon_project_id" {
  description = "ID of the existing source Neon project to copy schema from"
  type        = string
}

variable "source_neon_branch_id" {
  description = "Branch ID of the source Neon project (find in Neon Console > Branches)"
  type        = string
}

variable "source_database_connection_uri" {
  description = "Full PostgreSQL connection URI for the source database (for schema copy)"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "project_name" {
  description = "Project name used for naming resources"
  type        = string
  default     = "axioquan"
}

variable "neon_region" {
  description = "Neon region for the new database (e.g. aws-us-east-1, aws-eu-central-1)"
  type        = string
  default     = "aws-us-east-1"
}