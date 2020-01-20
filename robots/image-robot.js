const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const googleCredentials = require('../credentials/google-custom-search.json')

const downloader = require('image-downloader')

async function robot(content){

    for(let section in content.sections) {
        content.sections[section].imagesUrl = []
        for(let keyword in content.sections[section].keywords) {
            content.sections[section].imagesUrl.push(await getImagesUrl(content.sections[section].keywords[keyword], 1))
        }
    }

    const imagesDownloaded = []
    console.log('> [image-robot] Buscando por imagens...');
    await downloadImages()
    await downloadMainImage()

    async function downloadImages() {

        for(let section in content.sections) { 

            const images = content.sections[section].imagesUrl

            for(let url in images) {

                try {

                    if(imagesDownloaded.includes(images[url])) {
                        throw new Error('Imagem Já baixada')
                    }

                    await download(images[url], content.sections[section].title)
                    imagesDownloaded.push(images[url])
        
                    console.log(`> [image-robot] Imagem baixada com sucesso: ${images[url]}`)
                    break
        
                }
                catch(err) {
                    console.error(`> [image-robot] Erro ao baixar a imagem: ${images[url]} - ${err}`)
                }

            }
        }


    }

    async function getImagesUrl(keyword, num) {

        const response = await customSearch.cse.list({
            key: googleCredentials.apikey,
            cx: googleCredentials.searchEngine,
            q: `${content.searchTerm} ${keyword}`,
            searchType: 'image',
            num: num
        })
        
        if(num == 1){
            return response.data.items[0].link
        }

        else {
            const links = []
            for(let index in response.data.items) {
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

        for(url in images) {

            try {

                if(imagesDownloaded.includes(images[url])) {
                    throw new Error('Imagem já baixada')
                }

                await download(images[url], `${content.searchTerm} - Main Image`)
                console.log(`Imagem principal baixada com sucesso: ${images[url]}`)
                break

            }
            catch(err) {
                console.log(`> [image-robot] Erro ao  baixar a imagem pricipal (Tentativa ${url + 1} de 5) - ${err}`)
            }
        }
    }


}

module.exports = robot