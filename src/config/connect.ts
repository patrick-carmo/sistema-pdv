import knex from 'knex'
import env from './envConfig'

export default knex({
  client: 'pg',
  connection: env.POSTGRES_URL,
})