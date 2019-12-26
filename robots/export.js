const docx = require('docx')
const fs = require('fs')

exports.exportDocx = content => {
    const doc = new docx.Document()

    addTitleAndAbstract()
    addMainText()
    saveDocument()
    
    function addTitleAndAbstract() {

        const title = new docx.Paragraph({

            text: content.searchTerm.toUpperCase(),
            heading: docx.HeadingLevel.TITLE,
            spacing: {
                after: 500
            }

        })

        const abstractText = new docx.TextRun({

            text: content.summarizedSourceContent,
            bold: true,
            italics: true,
            font: 'Calibri',
            size: 20

        })
         
        const abstractParagraph = new docx.Paragraph({
            children: [abstractText]
        })


        doc.addSection({
            children: [title, abstractParagraph]
        })

    }



    function addMainText() {

        paragraphs = content.sanitizedContent

        let finallText = []


        for(let i in paragraphs) {
            
            const text = new docx.TextRun({
                text: paragraphs[i],
                bold: false,
                italics: false,
                size: 24,
                font: 'Arial'
            })

            finallText.push(text)

        }

        let mainText = []
        for(let i in finallText) {

            mainText.push(new docx.Paragraph({
                children:[finallText[i]],
                alignment: docx.AlignmentType.JUSTIFIED,
                spacing: {
                    line: 360
                }
            }))

        }
        
    
        doc.addSection({
            children:mainText
        })

    }

    function saveDocument() {

        fs.mkdirSync(process.cwd() + '\\' + content.searchTerm, {recursive:true}, (err) => {
            if(err) {

                console.log('-------------------');
                console.error(err);
                console.log('-------------------');

            }
            
        })

        docx.Packer.toBuffer(doc).then((buffer) => {
            fs.writeFileSync(`${content.searchTerm}/${content.searchTerm}.docx`, buffer, (err) => {
                console.log('-------------------');
                console.error(err);
                console.log('-------------------');                            
            })
        })  

        

    

    }
    

}


exports.exportJSON = content => {

    const jsonFileContent = {
        searchTerm:content.searchTerm,
        wikipediaOriginalContent:content.sourceContentOriginal,
        sanitizedContent:content.sanitizedContent,
        abstract:content.summarizedSourceContent,
        keywords:content.keywords,
        imagesUrl: []
    }

    const file = JSON.stringify(jsonFileContent)

    return fs.writeFileSync(`${content.searchTerm}/${content.searchTerm}.json`, file)

}


