terraform {
  backend "azurerm" {
    key = "cio/200827/strategy-proof-of-concept/cf-autoapi/autoapi.ciotfstate"
  }
}

provider "google" {
  access_token = data.google_service_account_access_token.sa.access_token
  project      = var.project_id
  region       = "us-east1"
}

provider "google" {
  credentials = file(var.gcp_credential_path)
  alias       = "impersonated"
}

data "google_service_account_access_token" "sa" {
  provider               = "google.impersonated"
  target_service_account = "${var.iac_deployer_service_account}@${var.project_id}.iam.gserviceaccount.com"
  lifetime               = "3600s"
  scopes = [
    "https://www.googleapis.com/auth/cloud-platform",
  ]
}

module "gcp_storage_cf-source" {
  source        = "acnciotfregistry.accenture.com/accenture-cio/storage/google"
  version       = "2.0.9"
  project_id    = var.project_id
  location      = var.region
  storage_class = "REGIONAL"
  versioning    = "false"
  storage_name  = "cf-source"
}

module "gcp_function_autoapi" {
  source                            = "acnciotfregistry.accenture.com/accenture-cio/function/google"
  version                           = "2.0.5"
  project_id                        = var.project_id
  region                            = var.region
  google_function_name              = "autoapi"
  google_function_entrypoint        = "autoapi"
  google_storage_bucket_name        = module.gcp_storage_cf-source.storage_name
  google_storage_bucket_object_name = "autoapi"
  app_execution_service_account     = var.app_execution_service_account
  available_memory_mb               = 256
  timeout                           = 60
  environment_variables             = var.environment_variables
  max_instances                     = "10"
  min_instances                     = "0"
  path_to_data_to_upload            = "autoapi.zip"
  runtime                           = "nodejs16"
  source_dir                        = "dist"
  trigger_http                      = "true"
  #labels                            = var.function_labels
  #trigger_event                     = var.trigger_event
  #connector_name                    = ""  # for vpc connection to redis cache
}