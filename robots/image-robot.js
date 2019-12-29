const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const googleCredentials = require('../credentials/google-custom-search.json')

const downloader = require('image-downloader')

async function robot(content){

    content.imagesUrl = []

    for(keyword of content.keywords) {
        content.imagesUrl.push(await getImagesUrl(keyword))
    }

    async function getImagesUrl(keyword) {

        const response = await customSearch.cse.list({
            key: googleCredentials.apikey,
            cx: googleCredentials.searchEngine,
            q: `${content.searchTerm} ${keyword}`,
            searchType: 'image',
            num: 1
        })

        return response.data.items[0].link
 
    }

    downloadImages()
    

    async function downloadImages() {

        const imagesDownloaded = []
        
        for(i = 0; i < content.imagesUrl.length; i++) {

            try {

                if(imagesDownloaded.includes(content.imagesUrl[i])) {
                    throw new Error('Imagem Já baixada')
                }

                console.log(`> [image-robot] Baixando imagem referente à palavra chave: ${content.keywords[i]}`)
                await download(content.imagesUrl[i], `${content.keywords[i]}.png`)
                imagesDownloaded.push(content.imagesUrl[i])

                console.log(`> [image-robot] Imagem baixada com sucesso: ${content.imagesUrl[i]}`)

            }
            catch(err) {
                console.error(`> [image-robot] Erro ao baixar a imagem: ${content.imagesUrl[i]} - ${err}`)
            }

        }


        async function download(url, fileName) {

            downloader.image({
                url: url,
                dest: `${content.searchTerm}/images/${fileName}`
            })

        }


    }


}

module.exports = robot