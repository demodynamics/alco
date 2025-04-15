# Values for the private ECR repositories
private_ecrs = [
  {
    repo_name                 = "front"
    image_tag_mutability_type = "MUTABLE"
  },
  {
    repo_name                 = "back"
    image_tag_mutability_type = "MUTABLE"
  }
]

# Values for the VPCs
vpcs = [ 
  
  {
  vpc_name                = "alco24"
  vpc_cidr                = "10.0.0.0/16"
  route_cidr              = "0.0.0.0/0"
  az_desired_count        = 2
  vpc_dns                 = true
  map_public_ip_on_launch = true
  single_natgw            = false
  natgw_per_az            = false
  natgw_per_subnet        = false
  public_subnets_count    = 2
  private_subnets_count   = 0
  subnet_prefix           = 24
  per_public_sub          = false
  } 

]

# Values for the security groups
security_groupes = [

  {
    security_groupe_name = "main-sg"
    vpc_name            = "alco24"
    ingress_rules = [
      {
      cidr_ipv4       = "0.0.0.0/16" 
      from_port       = 80
      ip_protocol     = "tcp"
      to_port         = 80
      }
    ]
    egress_rules = [
      {
      cidr_ipv4   = "0.0.0.0/0"
      ip_protocol = "-1"
      }
    ]
  } 

]

# Values for the EKS cluster roles
eks_cluster_roles = [

  {
    cluster_name = "main"
    policies     = ["arn:aws:iam::aws:policy/AmazonEKSClusterPolicy", "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController", "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"]
  }

]

# Values for the EKS node group roles
eks_nodegroupe_roles = [

  {
    cluster_name = "main"
    policies     = ["arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy", "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy", "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess"]
  }

]


# Values for the EKS clusters
eks_clusters = [

  {
    cluster_name            = "main"
    vpc_name                = "alco24"
    node_scale_desired_size = 1
    node_scale_max_size     = 2
    node_scale_min_size     = 1
    node_capacity_type      = "ON_DEMAND"
    node_instance_type      = ["t2.micro"]
  }

]


# Values for the EKS OIDC providers
eks_oidc_providers = [

  {
    cluster_name    = "main"
  }

]

# Values for the EKS IRSA
irsa = [ {
    cluster_name              = "main"
    service_account_name      = "ecr-access"
    service_account_namespace = "default"
    policies                 = ["arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"]
  }

]

# Values for the EKS service accounts
eks_service_accounts = [

  {
    cluster_name              = "main"
    service_account_name      = "ecr-access"
    service_account_namespace = "default"
  }

]

github_actions_roles = [ {
    github_oidc_issuer_url          = "https://token.actions.githubusercontent.com"
    github_oidc_thumbprint_list     = [ "1f2ab83404c08ec9ea0bb99daed02186b091dbf4" ]
    github_username                 = "demodynamics"
    github_repo                     = "alco24"
    github_branch                   = "main"
    self_managed_policy_name        = "eks-access-policy"
    aws_manged_policies             = ["arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"]
    self_managed_policy_permissions = ["eks:DescribeCluster", "eks:ListClusters", "eks:AccessKubernetesApi"]
  
} ]

# Default tags for all resources
default_tags = {
  Owner       = "demodynamics"
  Environment = "dev"
  Project     = "alco24"
}