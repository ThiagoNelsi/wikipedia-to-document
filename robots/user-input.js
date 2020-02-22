const readline = require('readline-sync')

exports.askAndReturnSearchTerm = () => {
    return readline.question('Digite um termo de pesquisa: ')
}

exports.askAndReturnLanguage = () => {
    const languages = ['pt', 'en', 'es']
    const languageIndex = readline.keyInSelect(languages, 'Selecione o idioma: ')
    const languageText = languages[languageIndex]
    return languageText
}