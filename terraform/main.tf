terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}


# This module creates a private ECR repository with the specified name and image tag mutability type.
# It also creates a lifecycle policy for the repository, and sets the image tag mutability type to the specified value.

module "private_ecr" {
  for_each                  = {for obj in var.private_ecrs : obj.repo_name => obj}
  source                    = "github.com/demodynamics/terraform-aws-modules.git//terraform-aws-ecr/private"
  repo_name                 = each.value.repo_name
  image_tag_mutability_type = each.value.image_tag_mutability_type
  default_tags              = var.default_tags
  
}

# VPCs
# This module creates a VPC with the specified CIDR block, and creates public and private subnets in the specified availability zones.
# It also creates a NAT gateway for the public subnets, and an internet gateway for the VPC.
# The module also creates a route table for the public and private subnets, and associates the public and private subnets with the route table.
module "vpc" {
  for_each                = {for obj in var.vpcs : "${obj.vpc_name}" => obj}
  source                  = "github.com/demodynamics/terraform-aws-modules.git//terraform-aws-vpc"
  vpc_name                = each.value.vpc_name
  vpc_cidr                = each.value.vpc_cidr
  subnet_prefix           = each.value.subnet_prefix
  public_subnets_count    = each.value.public_subnets_count
  private_subnets_count   = each.value.private_subnets_count
  route_cidr              = each.value.route_cidr
  az_desired_count        = each.value.az_desired_count
  vpc_dns                 = each.value.vpc_dns
  map_public_ip_on_launch = each.value.map_public_ip_on_launch
  single_natgw            = each.value.single_natgw
  natgw_per_az            = each.value.natgw_per_az
  natgw_per_subnet        = each.value.natgw_per_subnet
  per_public_sub          = each.value.per_public_sub
  default_tags            = var.default_tags

}

# This module creates a security group(s) for the VPC, and allows ingress and egress traffic to and from the VPC.
module "security_groupes" {
  source              = "github.com/demodynamics/terraform-aws-modules.git//terraform-aws-security-group"
  for_each            = {for obj in var.security_groupes : "${obj.security_groupe_name}" => obj}
  vpc_name            = each.value.vpc_name
  vpc_id              = module.vpc[each.value.vpc_name].output_data.vpc_id
  security_group_name = each.value.security_groupe_name
  ingress_rules       = each.value.ingress_rules
  egress_rules        = each.value.egress_rules
  default_tags        = var.default_tags
}

# This module creates an IAM role for the EKS cluster, and attaches the specified policies to the role.
module "eks_cluster_roles" {
  source       = "github.com/demodynamics/terraform-aws-modules.git//terraform-aws-iam/roles/eks"
  for_each     = {for obj in var.eks_cluster_roles : "${obj.cluster_name}" => obj}
  cluster_name = each.value.cluster_name
  policies     = each.value.policies
  default_tags = var.default_tags 
}



# This module creates an IAM role for the EKS node group, and attaches the specified policies to the role.
module "nodegroupe_roles" {
  source       = "github.com/demodynamics/terraform-aws-modules.git//terraform-aws-iam/roles/nodegroup"
  for_each     = {for obj in var.eks_nodegroupe_roles : "${obj.cluster_name}" => obj}
  cluster_name = each.value.cluster_name
  policies     = each.value.policies
  default_tags = var.default_tags
}


# This module creates an EKS cluster with the specified name, role ARN, and subnet IDs.
# It also creates a node group with the specified role ARN, and subnet IDs, desired, maximum, and minimum size, and capacity type.
module "eks_clusters" {
  for_each                = { for obj in var.eks_clusters : "${obj.cluster_name}" => obj }
  source                  = "github.com/demodynamics/terraform-aws-modules.git//terraform-aws-eks"
  cluster_name            = each.value.cluster_name
  cluster_role_arn        = module.eks_cluster_roles[each.value.cluster_name].output_data.arn
  node_goup_role_arn      = module.nodegroupe_roles[each.value.cluster_name].output_data.arn
  subnet_ids              = concat(module.vpc[each.value.vpc_name].output_data.private_subnet_ids, module.vpc[each.value.vpc_name].output_data.public_subnet_ids)
  node_scale_desired_size = each.value.node_scale_desired_size 
  node_scale_max_size     = each.value.node_scale_max_size
  node_scale_min_size     = each.value.node_scale_min_size
  node_capacity_type      = each.value.node_capacity_type
  node_instance_type      = each.value.node_instance_type
  default_tags            = var.default_tags
  depends_on              = [ module.eks_cluster_roles, module.nodegroupe_roles ]
}

# This module creates an IAM OIDC identity provider for the EKS cluster, and associates the specified IAM role with the OIDC provider.
module "eks_oidc_identity_provider" {
  source       = "github.com/demodynamics/terraform-aws-modules.git//terraform-aws-iam/oidc/eks"
  for_each     = {for obj in var.eks_oidc_providers : "${obj.cluster_name}" => obj}
  cluster_name = each.value.cluster_name
  default_tags = var.default_tags
  depends_on   = [ module.eks_clusters ]
}

# This module creates an IAM role for the EKS service account, and associates the specified IAM role with the OIDC provider.
module "irsa_roles" {
  source                    = "github.com/demodynamics/terraform-aws-modules.git//terraform-aws-iam/roles/irsa"
  for_each                  = {for obj in var.irsa : "${obj.cluster_name}-${obj.service_account_namespace}-${obj.service_account_name}" => obj}
  cluster_name              = each.value.cluster_name
  oidc_provider_arn         = module.eks_oidc_identity_provider[each.value.cluster_name].output_data.arn
  service_account_name      = each.value.service_account_name
  service_account_namespace = each.value.service_account_namespace
  policies                  = each.value.policies
  default_tags              = var.default_tags
  depends_on                = [ module.eks_oidc_identity_provider ]
}

# This module creates a Kubernetes service account with the specified name and namespace, and associates the IRSA with the service account.
module "eks_service_accounts" {
  source                    = "github.com/demodynamics/terraform-aws-modules.git//terraform-aws-eks-sa"
  for_each                  = {for obj in var.eks_service_accounts : "${obj.cluster_name}-${obj.service_account_namespace}-${obj.service_account_name}" => obj}
  service_account_namespace = each.value.service_account_namespace
  service_account_name      = each.value.service_account_name
  irsa_arn                  = module.irsa_roles[each.key].output_data.arn
  depends_on                = [ module.irsa_roles ]
  
}


data "terraform_remote_state" "github_oidc_identity_provider" {
  backend = "s3"
  config  = {
    bucket = "demo-dynamics"
    key    = "shared/oidc/github/terraform.tfstate"
    region = "us-east-1"
  }
}

module "github_actions_roles" {
  source       = "github.com/demodynamics/terraform-aws-modules.git//terraform-aws-iam/roles/github_actions"
  for_each     = {for obj in var.github_actions_roles : "${obj.github_username}-${obj.github_repo}-${obj.github_branch}" => obj}
    github_oidc_arn                 = data.terraform_remote_state.github_oidc_identity_provider.outputs.github_oidc_arn
    github_oidc_issuer_url          = each.value.github_oidc_issuer_url
    github_oidc_thumbprint_list     = each.value.github_oidc_thumbprint_list
    github_username                 = each.value.github_username
    github_repo                     = each.value.github_repo
    github_branch                   = each.value.github_branch
    self_managed_policy_name        = each.value.self_managed_policy_name
    aws_manged_policies             = each.value.aws_manged_policies
    self_managed_policy_permissions = each.value.self_managed_policy_permissions
    default_tags                    = var.default_tags
}