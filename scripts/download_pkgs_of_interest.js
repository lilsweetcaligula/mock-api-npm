const Axios = require('axios')
const app = require('commander')

const REGISTRY_URL = 'https://replicate.npmjs.com'

app
  .argument('<pkg_names...>')
  .action(async function (pkg_names) {
    for (const pkg_name of pkg_names) {
      const download_url = [REGISTRY_URL, pkg_name].join('/')
      const response = await Axios.get(download_url)

      console.dir(JSON.stringify(response.data), { depth: null })
    }
  })
  .parse(process.argv)

