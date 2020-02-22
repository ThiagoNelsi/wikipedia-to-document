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

    let finallText = []
    let mainText = []

    content.section.forEach((section) => {
      const sectionTitle = new docx.TextRun({
        text: section.title,
        bold: true,
        italics: false,
        size: 36,
        font: 'Arial'
      })
      addParagraph(sectionTitle)


      if (section.text.length != 0) {
        const image = docx.Media.addImage(doc, fs.readFileSync(process.cwd() + `\\${content.searchTerm}\\images\\${section.title}.png`), 550, 300)
        mainText.push(new docx.Paragraph({
          children: [image]
        }))
      }


      const text = new docx.TextRun({
        text: section.text,
        bold: false,
        italics: false,
        size: 24,
        font: 'Arial'
      })
      addParagraph(text)
    })


    function addParagraph(text) {
      mainText.push(new docx.Paragraph({
        children: [text],
        alignment: docx.AlignmentType.JUSTIFIED,
        spacing: {
          line: 360
        }
      }))
    }


    doc.addSection({
      children: mainText
    })

  }

  function saveDocument() {

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

  const file = JSON.stringify(content)

  return fs.writeFileSync(`${content.searchTerm}/${content.searchTerm}.json`, file)

}

exports.createFolder = content => {

  fs.mkdirSync(process.cwd() + `..\\${content.searchTerm}`, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  })

  fs.mkdirSync(process.cwd() + `\\${content.searchTerm}\\images`, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  })

}


