const Axios = require('axios')
const Progress = require('progress')
const app = require('commander')

const REGISTRY_URL = 'https://replicate.npmjs.com'

app
  .argument('<pkg_names...>')
  .action(async function (pkg_names) {
    const progress_bar = new Progress(
      ':current/:total :bar',

      { total: pkg_names.length }
    )


    const pkgs = []

    for (const pkg_name of pkg_names) {
      const download_url = [
        REGISTRY_URL,
        encodeURIComponent(pkg_name)
      ].join('/')

      const response = await Axios.get(download_url)

      const { data: pkg_data } = response
      pkgs.push(pkg_data)

      progress_bar.tick()
    }


    process.stdout.write(JSON.stringify(pkgs))
  })
  .parse(process.argv)

