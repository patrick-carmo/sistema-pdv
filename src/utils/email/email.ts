import nodemailer from 'nodemailer'
import env from '../../config/envConfig'

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  },
})

export default transporter