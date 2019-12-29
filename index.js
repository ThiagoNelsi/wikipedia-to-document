const fs = require('fs')
const userInput = require('./robots/user-input.js')
const textRobot = require('./robots/text-robot.js')
const imageRobot = require('./robots/image-robot.js')
const export_robot = require('./robots/export.js')
// const image_robot = require('./robots/image-robot.js')

async function start() {
    
    const content = {}

    content.searchTerm = userInput.askAndReturnSearchTerm()
    content.language = userInput.askAndReturnLanguage()
    await textRobot.text_robot(content)
    await imageRobot(content)
    // console.log(content.sanitizedContent)

    export_robot.exportDocx(content)
    export_robot.exportJSON(content)

}

start()
