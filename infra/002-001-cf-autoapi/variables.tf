variable "iac_deployer_service_account" {
  description = "IaC Deployer Service Account"
  type        = string
  default     = ""
}
###### function ######

variable "google_function_name" {
  type        = string
  description = "User-defined name of the function that will be used in combination with CIO Naming convention."
  default     = ""
}

variable "google_function_entrypoint" {
  type        = string
  description = "Name of the application function that will be executed when the Google Cloud Function is triggered."
  default     = ""
}

variable "region" {
  type        = string
  description = "Region name where the Cloud Function will be created."
  default     = "us-east1"
}

variable "available_memory_mb" {
  type        = string
  description = "Memory (in MB), available to the function."
  default     = 256
}

variable "timeout" {
  type        = string
  description = "Timeout (in seconds) for the function."
  default     = 60
}

variable "runtime" {
  type        = string
  description = "Runtime in which the function is going to run."
  default     = "nodejs8"
}

variable "environment_variables" {
  type        = map(any)
  description = "Set of key/value environment variable pairs to assign to the function."
  default     = {}
}

variable "function_labels" {
  type        = map(any)
  description = "Set of key/value pairs that are assigned to the function."
  default     = {}
}

variable "trigger_http" {
  type        = string
  description = "Boolean variable that represents if Foreground Function (value = true) or Background Function (value = false) is requested."
  default     = ""
}

variable "trigger_event" {
  type        = map(any)
  description = "Event type and resource that will trigger function execution."
  default     = {}
}

variable "google_storage_bucket_name" {
  type        = string
  description = "Storage bucket containing the zip archive which contains the function."
  default     = ""
}

variable "path_to_data_to_upload" {
  type        = string
  description = "Directory where to store the archive file."
  default     = ""
}

variable "google_storage_bucket_object_name" {
  type        = string
  description = "The source archive object (file) in archive bucket."
  default     = ""
}

variable "source_dir" {
  type        = string
  description = "Source folder of Cloud functions"
  default     = ""
}

variable "app_execution_service_account" {
  type        = string
  description = "Service Account ID that wil be used for Cloud Function execution and integration with other GCP Services."
  default     = ""
}

variable "min_instances" {
  type        = string
  description = "The limit on the minimum number of function instances that may coexist at a given time."
  default     = "0"
}

variable "max_instances" {
  type        = string
  description = "The limit on the maximum number of function instances that may coexist at a given time."
  default     = "10"
}

variable "connector_name" {
  type        = string
  description = "Provide the VPC serverless Connector Name that has the same region with cloud function."
  default     = ""
}

variable "project_id" {
  type        = string
  description = "The project id to wire-up the logging."
  default     = ""
}

variable "gcp_credential_path" {
  type        = string
  description = "GCP Credential contains pk."
  default     = ""
}