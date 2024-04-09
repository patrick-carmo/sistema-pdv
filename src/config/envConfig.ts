import env_var from 'env-var'

const env = {
  PORT: env_var.get('PORT').required().asPortNumber(),
  POSTGRES_URL: env_var.get('POSTGRES_URL').required().asUrlString(),
  SECRET: env_var.get('SECRET').required().asString(),
  // BUCKET: env_var.get('BUCKET').required().asString(),
  // BUCKET_REGION: env_var.get('BUCKET_REGION').required().asString(),
  // ENDPOINT_S3: env_var.get('ENDPOINT_S3').required().asString(),
  // KEY_ID: env_var.get('KEY_ID').required().asString(),
  // APP_KEY: env_var.get('APP_KEY').required().asString(),
  EMAIL_NAME: env_var.get('EMAIL_NAME').required().asString(),
  EMAIL_FROM: env_var.get('EMAIL_FROM').required().asString(),
  EMAIL_HOST: env_var.get('EMAIL_HOST').required().asString(),
  EMAIL_PORT: env_var.get('EMAIL_PORT').required().asPortNumber(),
  EMAIL_USER: env_var.get('EMAIL_USER').required().asString(),
  EMAIL_PASS: env_var.get('EMAIL_PASS').required().asString(),
  DRIVE_KEY: env_var.get('DRIVE_KEY').required().asString(),
  DRIVE_EMAIL: env_var.get('DRIVE_EMAIL').required().asString(),
  DRIVE_SCOPE: env_var.get('DRIVE_SCOPE').required().asString(),
  DRIVE_FOLDER: env_var.get('DRIVE_FOLDER').required().asString(),
  DRIVE_MIMETYPE: env_var.get('DRIVE_MIMETYPE').required().asString(),
  DRIVE_OWNER_EMAIL: env_var.get('DRIVE_OWNER_EMAIL').required().asString(),
}

export default env