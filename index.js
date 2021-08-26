const Express = require('express')
const Morgan = require('morgan')


const app = Express()

app.use(Express.json())

app.use(Morgan('combined'))

app.use(headersLogger())

app.use(bodyLogger())


app.get('/_all_docs', (req, res) => {
  return res.sendStatus(501)
})


app.get('/:pkg_name', (req, res) => {
  return res.sendStatus(501)
})


const server = app.listen(9090, () => {
  console.log('GitHub API mock server is listening at %j',
    server.address())
})


function bodyLogger() {
  return (req, res, next) => {
    console.log()
    console.log('body:');
    console.dir(req.body, { depth: 32 })
    console.log()

    return next()
  }
}


function headersLogger() {
  return (req, res, next) => {
    console.log()
    console.log('headers:');
    console.dir(req.headers, { depth: 32 })
    console.log()

    return next()
  }
}

