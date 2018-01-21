# lynlab-api
API server for lynlab services

## Prerequisite
  - apex (<http://apex.run>)
  - terrafom (<https://www.terraform.io>)

## Test
```
yarn test
```

## Deployment
Deploy lambda functions.

```
apex init

apex deploy --dry-run
apex deploy
```

Deploy infrastructure.

```
terraform init infra

terraform plan infra
terraform apply infra
```
