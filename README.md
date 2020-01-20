> # Wikipedia Content Getter
>  This project collects Wikipedia articles from a search term entered by the user and formats the data in a .docx document with images related to each section of the collected article.
>
> ## APIs
> All the project is made with NodeJS and uses the following APIs:
> * [Wikipedia Parser API](https://www.algorithmia.com/algorithms/web/WikipediaParser) (from [Algorithmia](https://www.algorithmia.com/))
> * [Google Custom Search](https://developers.google.com/custom-search) (from [Google Cloud Platform](https://cloud.google.com/))
> * [Natural Language Understanding](https://cloud.ibm.com/catalog/services/natural-language-understanding) (from [IBM CLOUD](https://cloud.ibm.com))
>
> ## Main dependencies
> * [algorithmia](https://algorithmia.com/developers/clients/node)
> * [docx](https://www.npmjs.com/package/docx)
> * [googleapis](https://developers.google.com/drive/api/v3/quickstart/nodejs)
> * [ibm-watson](https://www.npmjs.com/package/ibm-watson)
> * [image-downloader](https://www.npmjs.com/package/image-downloader)
> * [readline-sync](https://www.npmjs.com/package/readline-sync)
> * [watson-developer-cloud](https://www.npmjs.com/package/watson-developer-cloud)
>
> You can use this app by running the index.js file and typing a search term, after this you just need to select a language and wait for the app end the process.
>
> At the end of the process a folder will be created at the root of the project with the same name as the search term containing the .docx document and a folder with the images.
>
