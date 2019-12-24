const algorithmia = require('algorithmia')
const algorithmiaAutenticated = algorithmia('simsI0aQp3wOl0rl5Vi1DblDRMt1')     // Retorna um instancia autenticada da API


exports.robot = async content => {
    
    await fetchWikipediaContent(content)
    sanitizeWikipediaContent(content)
    await summarizeContent(content.sanitizedContent.join('\n'))
    // breakContentIntoSentences()

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

            //console.log(whithoutBlankLinesAndMarkdowns.join('\n'));
            return whithoutBlankLinesAndMarkdowns

        }

    }



    async function summarizeContent(text) {

        const summarizerAlgorithm = algorithmiaAutenticated.algo('nlp/Summarizer/0.1.8')
        const summarizerAlgorithmResponse = await summarizerAlgorithm.pipe(text)
        const summarizedContent = summarizerAlgorithmResponse.get()

        content.summarizedSourceContent = summarizedContent

    }

}