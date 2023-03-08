iac_deployer_service_account = "#{IAC_DEPLOYER_SERVICE_ACCOUNT}#"
project_id                   = "#{GCP_PROJECT_ID}#"
###### function ######
app_execution_service_account = "#{FUNCTION_APP_EXECUTION_SERVICE_ACCOUNT}#"
available_memory_mb           = "#{FUNCTION_AVAILABLE_MEMORY_MB}#"
environment_variables         = { "ENVIRONMENT" : "#{ENVIRONMENT}#", "AZURE_TENANT" : "#{AZURE_TENANT}#", "AZURE_CLIENT_ID" : "#{AZURE_CLIENT_ID}#", "AZURE_AUDIENCE" : "#{AZURE_AUDIENCE}#", "AZURE_SCOPES" : "#{AZURE_SCOPES}#" }
function_labels               = {}
max_instances                 = "#{FUNCTION_MAX_INSTANCES}#"
min_instances                 = "#{FUNCTION_MIN_INSTANCES}#"
region                        = "#{FUNCTION_REGION}#"
source_dir                    = "#{FUNCTION_SOURCE_DIR}#"
timeout                       = "#{FUNCTION_TIMEOUT}#"
trigger_http                  = "#{FUNCTION_TRIGGER_HTTP}#"
#connector_name                    = "#{FUNCTION_CONNECTOR_NAME}#"