import { createPostgresConnection } from 'remult/postgres'
import { remultExpress } from 'remult/remult-express'
import { Task } from '../app/entity/task'
import { SignInController, getUser } from '../app/users/SignInController'
import { UpdatePasswordController } from '../app/users/UpdatePasswordController'
import { User } from '../app/users/user'

export const entities = [User, Task]
export const controllers = [SignInController, UpdatePasswordController]

export const api = remultExpress({
  admin: true,
  controllers: controllers,
  entities: entities,
  getUser,
  dataProvider: async () => {
    let isProduction = (process.env['NODE_ENV'] ?? '') === 'production'
    let isLocalProduction = (process.env['DEV_MODE'] ?? '') === 'PROD'

    console.info('isProduction', isProduction, 'isLocalProduction', isLocalProduction)
    return createPostgresConnection({
      configuration: "heroku",
      sslInDev: isProduction || isLocalProduction
    })
  },//,
  initApi: async remult => { /*await seedServices(remult)*/ }
})
