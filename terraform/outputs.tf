output "private_ecr_data" {
  description = "Private ECR data"
  value       = {for k, v in module.private_ecr : k => v.output_data}
  
}

output "vpc_data" {
  description = "VPC data"
  value = {for k, v in module.vpc : k => v.output_data}
}

output "security_groupes_data" {
  description = "VPC data"
  value = {for k, v in module.security_groupes : k => v.output_data}
}

output "eks_cluster_roles_data" {
  description = "VPC data"
  value = {for k, v in module.eks_cluster_roles : k => v.output_data}
}

output "nodegroupe_roles_data" {
  description = "VPC data"
  value = {for k, v in module.nodegroupe_roles : k => v.output_data}
}

output "eks_clusters_data" {
  description = "VPC data"
  value = {for k, v in module.eks_clusters : k => v.output_data}
}

output "eks_oidc_identity_provider_data" {
  description = "VPC data"
  value = {for k, v in module.eks_oidc_identity_provider : k => v.output_data}
}

output "irsa_roles_data" {
  description = "VPC data"
  value = {for k, v in module.irsa_roles : k => v.output_data}
}

output "eks_service_accounts_data" {
  description = "VPC data"
  value = {for k, v in module.eks_service_accounts : k => v.output_data}
}
