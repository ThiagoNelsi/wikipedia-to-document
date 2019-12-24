const fs = require('fs')
const userInput = require('./robots/user-input.js')
const textRobot = require('./robots/text-robot.js')
const docx_robot = require('./robots/save-into-docx.js')

async function start() {
    
    const content = {}

    content.searchTerm = userInput.askAndReturnSearchTerm()
    content.language = userInput.askAndReturnLanguage()
    await textRobot.robot(content)
    console.log(content.sanitizedContent)

    docx_robot.writeDocx(content)

}

start()


