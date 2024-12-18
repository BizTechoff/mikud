import compression from 'compression'
import session from 'cookie-session'
import express from 'express'
import fs from 'fs'
import helmet from 'helmet'
import sslRedirect from 'heroku-ssl-redirect'
import path from 'path'
import { api } from './api'

async function startup() {
  const app = express()
  app.use(sslRedirect())
  app.use(
    '/api',
    session({
      secret:
        process.env['NODE_ENV'] === 'production'
          ? process.env['SESSION_SECRET']
          : process.env['SESSION_SECRET_DEV'],
      maxAge: 365 * 24 * 60 * 60 * 1000,
    })
  )
  app.use(compression())
  app.use(helmet({ contentSecurityPolicy: false }))

  app.use(api)

  let dist = path.resolve('dist/mikud/browser')
  if (!fs.existsSync(dist)) {
    dist = path.resolve('../mikud/browser')
  }
  app.use(express.static(dist))
  app.use('/*', async (req, res) => {
    if (req.headers.accept?.includes('json')) {
      console.log(req)
      res.status(404).json('missing route: ' + req.originalUrl)
      return
    }
    try {
      res.sendFile(dist + '/index.html')
    } catch (err) {
      res.sendStatus(500)
    }
  })
  let port = process.env['PORT'] || 3002
  app.listen(port)
}
startup()
