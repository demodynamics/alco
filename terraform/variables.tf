# Variables for the alco24 project

variable "private_ecrs" {
  description = "values for private ECR"
  type        = list(object({
    repo_name                 = string
    image_tag_mutability_type = string
  }))
  
}

variable "vpcs" {
  description = "List of VPCs to create"
  type        = list(object({
    vpc_name                = string
    vpc_cidr                = string
    route_cidr              = string
    az_desired_count        = number
    vpc_dns                 = bool
    map_public_ip_on_launch = bool
    single_natgw            = bool 
    natgw_per_az            = bool
    natgw_per_subnet        = bool
    public_subnets_count    = number
    private_subnets_count   = number
    subnet_prefix           = number
    per_public_sub          = bool
  }))
  
}

variable "security_groupes" {
  description = "values for security groups"
  type        = list(object({
    security_groupe_name = string
    vpc_name             = string

    ingress_rules = list(object({
      cidr_ipv4       = string # VPC CIDR, or If you are using a custom CIDR or custom IP address in an ingress rule, that CIDR or IP addres must fall within the VPC CIDR block where the security group is defined.
      from_port       = number
      ip_protocol     = string
      to_port         = number
    }))
    egress_rules = list(object({
      cidr_ipv4       = string
      ip_protocol     = string
    }))
    
  }))
}


variable "eks_cluster_roles" {
  description = "values for EKS cluster roles"
  type        = list(object({
    cluster_name = string
    policies     = set(string)

  }))
}

variable "eks_nodegroupe_roles" {
  description = "values for EKS cluster roles"
  type        = list(object({
    cluster_name = string
    policies     = set(string)
  })) 
}

variable "eks_oidc_providers" {
  description = "values for EKS OIDC providers"
  type        = list(object({
    cluster_name    = string
  })) 
  
}

variable "irsa" {
  description = "values for EKS IRSA"
  type        = list(object({
    cluster_name              = string
    service_account_name      = string
    service_account_namespace = string
    policies                  = set(string)
  })) 
  
}

variable "eks_service_accounts" {
  description = "values for EKS service accounts"
  type        = list(object({
    cluster_name              = string
    service_account_name      = string
    service_account_namespace = string
  })) 
}

 variable "eks_clusters" {
  description = "values for EKS clusters"
  type        = list(object({
    cluster_name            = string
    vpc_name                = string
    node_scale_desired_size = number
    node_scale_max_size     = number
    node_scale_min_size     = number
    node_capacity_type      = string
    node_instance_type      = list(string)
 }))   
 }


 variable "github_actions_roles" {
  description                     = "values for GitHub actions roles"
  type                            = list(object({
    github_oidc_issuer_url          = string
    github_oidc_thumbprint_list     = set(string)
    github_username                 = string
    github_repo                     = string
    github_branch                   = string
    self_managed_policy_name        = string
    aws_manged_policies             = set(string)
    self_managed_policy_permissions = set(string)
  }))
   
 }


variable "default_tags" {
  description = "Default Tags to apply to all resources"
  type = map(string)
}