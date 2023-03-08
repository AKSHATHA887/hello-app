
/**
output "detect_gcloud_result" {
  description = "Result of gcloud commands detection in uploaded code"
  value       = module.gcp_function_1.detect_gcloud_result
}


output "function_name" {
  description = "Function name of the created resource."
  value       = module.gcp_function_1.function_name
}


output "url" {
  description = "URL which triggers function execution."
  value       = module.gcp_function_1.url
}
*/