const sbd = require('sbd')

// Algorithmia API
const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apikey
const algorithmiaAutenticated = algorithmia(algorithmiaApiKey)     // Retorna um instancia autenticada da API

// Natural Language Understanding API
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const nluCredentials = require('../credentials/nlu-watson.json')


exports.text_robot = async content => {
    
    console.log('> [text-robot] Pesquisando conteúdo no wikipedia...')
    await fetchWikipediaContent(content)

    console.log('> [text-robot] Limpando conteúdo...')
    sanitizeWikipediaContent(content)

    console.log('> [text-robot] Resumindo conteúdo')
    await summarizeContent(content)
    console.log('> [text-robot] Resumo: ' + content.summarizedSourceContent)

    breakContentIntoSentences(content)

    console.log('> [text-robot] Identificando palavras-chave...')
    content.keywords = await getKeywordsFromTheSentences(content.summarizedSourceContent)
    console.log('> [text-robot] Palavras-chave identificadas: ' + content.keywords)


    async function fetchWikipediaContent(content) {

        const wikipediaAlgorithm = algorithmiaAutenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe({"articleName":content.searchTerm, "lang":content.language})
        const wikipediaContent =  wikipediaResponse.get()
        
        content.sourceContentOriginal = wikipediaContent.content
    
    }

    function sanitizeWikipediaContent(content) {

        content.sanitizedContent = removeBlankLinesAndMarkdowns(content.sourceContentOriginal)

        function removeBlankLinesAndMarkdowns(text) {

            const allLines = text.split('\n')

            const whithoutBlankLinesAndMarkdowns = allLines.filter((line) => {
                if(line.trim().length === 0 || line.trim()[0] === "=") {
                    return false
                } 

                return true
            })

            
            return whithoutBlankLinesAndMarkdowns

        }

    }

    function breakContentIntoSentences(content) {
        content.sentences = []
        const textSentences = sbd.sentences(content.sanitizedContent.join('\n'))

        textSentences.forEach((sentence) => {
            content.sentences.push(sentence)
        })
                                                  
    }



    async function summarizeContent(content) {

        const text = content.sanitizedContent.join('\n')

        const summarizerAlgorithm = algorithmiaAutenticated.algo('nlp/Summarizer/0.1.8')
        const summarizerAlgorithmResponse = await summarizerAlgorithm.pipe(text)
        const summarizedContent = summarizerAlgorithmResponse.get()

        content.summarizedSourceContent = summarizedContent

    }



    function getKeywordsFromTheSentences(sentence) {


        return new Promise((resolve, reject) => {


            const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
                version:"2019-07-12",
                authenticator: new IamAuthenticator({
                    apikey:nluCredentials.apikey
                }),
                url:nluCredentials.url
            })

            const analyzeParams = {
                text:sentence,
                features: {
                    keywords: {}
                }
            }

            naturalLanguageUnderstanding.analyze(analyzeParams, (err, response) => {
                if(err) {
                    reject(err)
                    return
                } else {
                    const keywords = response.result.keywords.map((keyword) => {
                        return keyword.text
                    })
                    resolve(keywords)
                }
            })


        })


    }


}