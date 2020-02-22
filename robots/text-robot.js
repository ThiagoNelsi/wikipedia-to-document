// Algorithmia API
const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apikey
const algorithmiaAutenticated = algorithmia(algorithmiaApiKey)     // Retorna um instancia autenticada da API

// Natural Language Understanding API
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const nluCredentials = require('../credentials/nlu-watson.json')


async function robot(content) {

  console.log('> [text-robot] Pesquisando conteúdo no wikipedia...')
  await fetchWikipediaContent(content)

  console.log('> [text-robot] Limpando conteúdo...')
  sanitizeWikipediaContent(content)

  console.log('> [text-robot] Quebrando texto em seções...')
  breakContentIntoSections(content)

  console.log('> [text-robot] Resumindo conteúdo')
  await summarizeAllContent(content)


  console.log('> [text-robot] Identificando palavras-chave...')
  for (let section in content.sections) {
    content.sections[section].keywords = await getKeywordsFromTheText(content.sections[section].text)
  }


  async function fetchWikipediaContent(content) {

    const wikipediaAlgorithm = algorithmiaAutenticated.algo('web/WikipediaParser/0.1.2')
    const wikipediaResponse = await wikipediaAlgorithm.pipe({ "articleName": content.searchTerm, "lang": content.language })
    const wikipediaContent = wikipediaResponse.get()

    content.sourceContentOriginal = wikipediaContent.content

  }

  function sanitizeWikipediaContent(content) {
    content.sanitizedContent = removeBlankLines(content.sourceContentOriginal.split('\n'))
    content.sanitizedContent = removeMarkdowns(content.sanitizedContent)
    console.log(content.sanitizedContent)
  }


  function breakContentIntoSections(content) {

    content.sections = []
    content.lines = removeBlankLines(content.sourceContentOriginal.split('\n'))


    for (let i = 0; i < content.lines.length; i++) {

      var j = i + 1
      let section = []

      if (content.lines[i].trim()[0] === '=') {

        section = {
          title: removeMarkdowns([content.lines[i].trim()]).join(),
          text: []
        }

        while (j < content.lines.length && content.lines[j].trim()[0] != '=') {

          section.text.push(content.lines[j].trim())
          j++

        }

        section.text = section.text.join('\n')
        content.sections.push(section)

      }

    }
  }

  function removeBlankLines(text) {
    const lines = text.filter((line) => {
      if (line.trim().length === 0) {
        return false
      }
      return true
    })
    return lines
  }

  function removeMarkdowns(text) {
    const withoutMarkdowns = []

    for (let i in text) {
      withoutMarkdowns.push(text[i].split('=').join('').trim())
    }

    return withoutMarkdowns
  }



  async function summarizeAllContent(content) {

    const text = content.sanitizedContent.join('\n')

    const summarizerAlgorithm = algorithmiaAutenticated.algo('nlp/Summarizer/0.1.8')
    const summarizerAlgorithmResponse = await summarizerAlgorithm.pipe(text)
    const summarizedContent = summarizerAlgorithmResponse.get()

    content.summarizedSourceContent = summarizedContent

  }



  function getKeywordsFromTheText(text) {

    if (text.length === 0) {
      return ''
    }

    return new Promise((resolve, reject) => {


      const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: "2019-07-12",
        authenticator: new IamAuthenticator({
          apikey: nluCredentials.apikey
        }),
        url: nluCredentials.url
      })

      const analyzeParams = {
        text: text,
        features: {
          keywords: {
            limit: 3
          }
        }
      }

      naturalLanguageUnderstanding.analyze(analyzeParams, (err, response) => {
        if (err) {
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

module.exports = robot
