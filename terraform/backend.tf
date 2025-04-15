terraform {
  backend "s3" {
    bucket = "alco24-singlestate"
    key    = "dev/terraform.tfstate"
    region = "us-east-1"
    use_lockfile = true
  }
}