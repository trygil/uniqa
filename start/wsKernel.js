const Ws = use('Ws')

const globalMiddleware = []
const namedMiddleware = {
    auth: 'Adonis/Middleware/Auth',
}

Ws
  .registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)