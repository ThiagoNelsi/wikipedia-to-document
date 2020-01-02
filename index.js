const userInput = require('./robots/user-input.js')
const textRobot = require('./robots/text-robot.js')
const imageRobot = require('./robots/image-robot.js')
const export_robot = require('./robots/export.js')

async function start() {
    
    const content = {}

    content.searchTerm = userInput.askAndReturnSearchTerm()
    content.language = userInput.askAndReturnLanguage()

    await textRobot(content)

    export_robot.createFolder(content)
    await imageRobot(content)

    export_robot.exportDocx(content)
    export_robot.exportJSON(content)


}

start()
