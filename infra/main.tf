variable "aws_access_key_id" {
  type = "string"
}

variable "aws_secret_access_key" {
  type = "string"
}

provider "aws" {
  access_key  = "${var.aws_access_key_id}"
  secret_key  = "${var.aws_secret_access_key}"
  region      = "ap-northeast-2"
}

#
# Lambda resources
#
resource "aws_lambda_alias" "proxy" {
    name             = "proxy"

    function_name    = "lynlab-api_proxy"
    function_version = "$LATEST"
}


#
# DynamoDB resources
#
resource "aws_dynamodb_table" "auths-table" {
  name           = "LYnLabAPIAuths"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "Username"

  attribute {
    name = "Username"
    type = "S"
  }
}

#
# API Gateway resources
#
resource "aws_api_gateway_rest_api" "lynlab-api" {
  name        = "lynlab-api"
  description = "LYnLab API endpoint"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.lynlab-api.id}"
  parent_id   = "${aws_api_gateway_rest_api.lynlab-api.root_resource_id}"

  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = "${aws_api_gateway_rest_api.lynlab-api.id}"
  resource_id   = "${aws_api_gateway_resource.proxy.id}"
  http_method   = "ANY"

  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_integration" {
    rest_api_id             = "${aws_api_gateway_rest_api.lynlab-api.id}"
    resource_id             = "${aws_api_gateway_resource.proxy.id}"
    http_method             = "${aws_api_gateway_method.proxy.http_method}"

    type                    = "AWS_PROXY"
    content_handling        = "CONVERT_TO_TEXT"
    uri                     = "arn:aws:apigateway:ap-northeast-2:lambda:path/2015-03-31/functions/${aws_lambda_alias.proxy.arn}/invocations"
    integration_http_method = "POST"
}

resource "aws_api_gateway_deployment" "prod" {
  depends_on  = ["aws_api_gateway_integration.lambda_integration"]

  rest_api_id = "${aws_api_gateway_rest_api.lynlab-api.id}"
  stage_name  = "prod"
}
