const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const googleCredentials = require('../credentials/google-custom-search.json')

async function robot(content){

    content.imagesUrl = []

    for(keyword of content.keywords) {
        console.log(keyword)
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

    console.log(content)


}

module.exports = robot