const Express = require('express')
const Morgan = require('morgan')
const Store = require('./lib/pkgs.json')
const Faker = require('faker')
const Moment = require('moment')


const app = Express()

app.use(Express.json())

app.use(Morgan('combined'))

app.use(headersLogger())

app.use(bodyLogger())


app.get('/_all_docs', (req, res) => {
  const rows = Store.map(pkg => {
    const row = {
      id: pkg._id,
      key: pkg.name,
      value: {
        rev: pkg._rev
      }
    }

    if (['true', '1'].includes(req.query.include_docs)) {
      row.doc = pkg
    }

    return row
  })

  const total_rows = Store.length


  return res.json({
    total_rows,
    offset: 0,
    rows
  })
})


app.get('/:pkg_name', (req, res) => {
  const doc = Store.find(pkg => req.params.pkg_name === pkg._id)

  if (!doc) {
    return res.status(404).json({
      error: 'not_found',
      reason: 'missing'
    })
  }

  return res.json(doc)
})


app.get('/downloads/range/:interval/:pkg_name', (req, res) => {
  const { interval } = req.params

  if (!interval.includes(':')) {
    return res.sendStatus(400)
  }


  const [start, end] = interval.split(':')
  const isValidDate = mdate => !Number.isNaN(mdate.toDate().getTime())


  const start_moment = Moment(start)

  if (!isValidDate(start_moment)) {
    return res.sendStatus(400)
  }


  const end_moment = Moment(end)

  if (!isValidDate(end_moment)) {
    return res.sendStatus(400)
  }


  const history = []
  const num_days = end_moment.diff(start_moment, 'days')
  const day_moment = Moment(start_moment)
  const formatDate = mdate => mdate.format('yyyy-mm-DD')

  for (let days = 0; days < num_days; days++) {
    day_moment.add(days, 'days')

    const entry = {
      downloads: Faker.datatype.number(),
      day: formatDate(day_moment)
    }

    history.push(entry)
  }


  const { pkg_name } = req.params


  return res.json({
    "start": start,
    "end": end,
    "package": pkg_name,
    "downloads": history
  })
})


const port = process.env.PORT

if (null == port) {
  throw new Error('missing PORT env var')
}

const server = app.listen(port, () => {
  console.log('npm API mock server is listening at %j',
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

