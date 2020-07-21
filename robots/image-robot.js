const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const googleCredentials = require('../credentials/google-custom-search.json')

const downloader = require('image-downloader')

async function robot(content) {

  await Promise.all(content.sections.map(section => {
    section.imagesUrl = []
    return Promise.all(section.keywords.map(keyword => {
      return getImagesUrl(keyword, 1).then(imageUrl => section.imagesUrl.push(imageUrl))
    }))
  }))

  const imagesDownloaded = []
  console.log('> [image-robot] Buscando por imagens...');
  await downloadImages()
  await downloadMainImage()

  async function downloadImages() {

    await Promise.all(content.sections.map(section => {

      const URLs = section.imagesUrl

      return new Promise(async resolve => {
        for (let url of URLs) {

          try {

            if (imagesDownloaded.includes(url)) {
              throw new Error('Imagem Já baixada')
            }

            await download(url, section.title)
            imagesDownloaded.push(url)

            console.log(`> [image-robot] Imagem baixada com sucesso - ${section.title}: ${url}`)
            break

          }
          catch (err) {
            console.error(`> [image-robot] Erro ao baixar a imagem: ${url} - ${err}`)
          }
        }
        resolve()
      })
    }))
  }

  async function getImagesUrl(keyword, num) {

    const response = await customSearch.cse.list({
      key: googleCredentials.apikey,
      cx: googleCredentials.searchEngine,
      q: `${keyword} "${content.searchTerm}"`,
      searchType: 'image',
      num: num
    })

    if (num == 1) {
      return response.data.items[0].link
    }

    else {
      const links = []
      for (let index in response.data.items) {
        links.push(response.data.items[index].link)
      }
      return links
    }

  }

  async function download(url, fileName) {

    await downloader.image({
      url: url,
      dest: `${content.searchTerm}/images/${fileName}.png`
    })

  }

  async function downloadMainImage() {

    const images = await getImagesUrl(content.searchTerm, 5)

    for (url in images) {

      try {

        if (imagesDownloaded.includes(images[url])) {
          throw new Error('Imagem já baixada')
        }

        await download(images[url], `${content.searchTerm} - Main Image`)
        console.log(`Imagem principal baixada com sucesso: ${images[url]}`)
        break

      }
      catch (err) {
        console.log(`> [image-robot] Erro ao  baixar a imagem principal (Tentativa ${url + 1} de 5) - ${err}`)
      }
    }
  }


}

module.exports = robot
