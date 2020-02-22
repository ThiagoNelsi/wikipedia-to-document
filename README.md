> # Wikipedia Content Getter
>  This project collects Wikipedia articles from a search term entered by the user and formats the data in a .docx document with images related to each section of the collected article.
>
>
> This project is inspired by the [Video Maker](https://github.com/filipedeschamps/video-maker) project by [Filipe Deschamps](https://github.com/filipedeschamps)
>
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
> ## How to use
> You can use this app by running the index.js file and typing a search term, after this you just need to select a language and wait for the app end the process.
>
> At the end of the process a folder will be created at the root of the project with the same name as the search term containing the .docx document and a folder with the images.
>
>
>
> ## Como conseguir as credenciais e API keys (Portuguese)
> Por [Hebert Lima](https://github.com/hebertlima)
>
> ## Api: Algorithmia ##
> É necessário criar a sua chave de acesso para poder testar os robôs, pra isso você precisa acessar o site do [Algorithmia](https://algorithmia.com/), aqui não tem muito segredo, basta acessar e se cadastrar, depois de logar na sua conta, na Dashboard procure no menu **Api Keys** e **copie**.

![Algorithmin](https://i.imgsafe.org/ba/ba1d23897c.gif)

vá até a pasta do projeto onde você clonou o repositório, navegue até a pasta **credentials**, dentro do arquivo `algorithmia.json` você irá colocar a `API` que copiou do site **Algorithmia** na estrutura abaixo:

``` js
{
  "apiKey": "API_KEY_AQUI"
}
```

## Api: Watson ##
Você precisa criar também as credenciais do *Watson* no site da [IBM](https://cloud.ibm.com/login), também não tem segredo, basta se cadastrar, quando estiver logado no menu superior clique em **Catálogo**, depois dentro de **IA** procure por *Natural Language Understanding*

![IBM](https://i.imgsafe.org/ba/bab0fc4ecd.jpeg)

clicando nele na nova página vai aparecer um botão "criar" no final da página, uma vez que o serviço for criado, você será redirecionado para a página de gerenciamento do serviço que você acabou de criar, no menu lateral esquerdo procure por **Credenciais de Serviços** e depois clique em **Auto-generated service credentials** destacado abaixo, então copie as *Credenciais*:

![IBM](https://i.imgsafe.org/ba/bace46f16b.jpeg)

Novamente, voltando na pasta do projeto ainda dentro da pasta **credentials** você ira encontrar um arquivo json com o nome `nlu-watson.json` e dentro desse arquivo você vai colar as credenciais que copiou anteriormente:

``` js
{
  "apikey" : "...",
  "iam_apikey_description" : "...",
  "iam_apikey_name": "...",
  "iam_role_crn": "...",
  "iam_serviceid_crn": "...",
  "url": "..."
}
```

## Setup: Google Cloud Plataform ##
Antes de criarmos as api's que iremos utilizar é necessário vincular a nossa conta do Google com o [Google Cloud Plataform](https://cloud.google.com/), na página do **Google Cloud Plataform** você irá clicar no botão **Faça uma Avaliação Gratuita**:

![google-cloud](https://i.imgsafe.org/61/61ce83ca22.png)

 em seguida marque a opção **Termos e Condições**

![google-cloud-step1](https://i.imgsafe.org/62/621a2df511.png)

> Ps.: É importante lembrar que alguns recursos do **Google Cloud Plataform** são **Pagos**, por esse motivo é necessário inserir as informações de pagamento, mas fique tranquilo porque iremos utilizar apenas os recursos **Gratuitos**

![google-cloud-pay](https://i.imgsafe.org/62/6253ce8142.jpeg)

## Criando o Projeto ##

Agora é a hora de criarmos um projeto que iremos vincular as Api's que vamos utilizar, para isso basta clicar no menu do topo da página "**Selecionar projeto**" e depois em "**Novo Projeto**":

![image](https://user-images.githubusercontent.com/34013325/55571155-52e3d400-56db-11e9-998f-bd99ab647403.png)

de um nome ao projeto e clique no botão **criar:**

![image](https://user-images.githubusercontent.com/34013325/55571267-963e4280-56db-11e9-9b21-7f028caa05c1.png)

após isso o projeto começará a ser criado e assim que terminar um menu vai aparecer com o projeto que acabamos de criar então você irá seleciona-lo:

![image](https://user-images.githubusercontent.com/34013325/55571506-064cc880-56dc-11e9-804b-f14003dccc09.png)

## Api: Custom Search API ##

Com o projeto criado agora é hora de habilitarmos e configurarmos a Api, você irá clicar no menu lateral esquerdo no topo navegar até **API's e Serviços** > **Bibliotecas**:

![image](https://user-images.githubusercontent.com/34013325/55572521-22ea0000-56de-11e9-89cc-f477fe18bf65.png)

no campo de pesquisa basta procurar por **Custom Search API**, clicar em **Ativar**, e aguardar até a ativação da api:

![image](https://user-images.githubusercontent.com/34013325/55572661-78bea800-56de-11e9-9ae3-fbc87758aa84.png)

Após a ativação vai aparecer uma mensagem solicitando a criação das credenciais da API, então basta você clicar em **Criar Credenciais**:

![image](https://user-images.githubusercontent.com/34013325/55572835-eb2f8800-56de-11e9-8292-fc3c4bf74084.png)

Procure por **Custom Search API** no dropdown e clique em "**Preciso de quais credenciais?**"

![image](https://user-images.githubusercontent.com/34013325/55572958-2cc03300-56df-11e9-8bc1-17641ba5138e.png)

Após isso irá aparecer sua Api Key, você vai copia-la e clicar no botão concluir, voltando a pasta do projeto você vai navegar até **credentials** e irá criar um novo arquivo chamado **google-custom-search.json** com o conteúdo abaixo:

```
{
  "apiKey": "API_KEY_AQUI"
}
```

## Api: Custom Search Enginer ##
Agora iremos configurar o nosso motor de busca personalizado do google, para isso você vai acessar o [Custom Search Engine](https://cse.google.com/cse/create/new), e irá informar o **site a pesquisar** coloque **google.com**, irá selecionar o idioma que preferir, e por fim clique em **Opções avançadas** e para o esquema iremos utilizar o mais genérico **Thing**, pronto tudo preenchido você irá clicar em **criar**:

> PS.:  Para saber mais sobre o schema acesse [schema.org](https://schema.org/docs/full.html).


![image](https://user-images.githubusercontent.com/34013325/55578410-38662680-56ec-11e9-80ea-06ff9e25ba3f.png)

> Ps.: Caso não apareça a opção para selecionar o Schema você poderá selecionar no Painel de Controle clicando em **Configurações avançadas** na parte inferior da tela. Veja a seguir

Agora basta clicar em **Painel de Controle** na nova tela nós iremos habilitar a opção **Pesquisa de imagens** e depois iremos clicar no botão **Copiar para área de transferência**"

![image](https://user-images.githubusercontent.com/34013325/55574756-8a567e80-56e3-11e9-99ea-d307547c781f.png)


![image](https://user-images.githubusercontent.com/34013325/55574920-0355d600-56e4-11e9-8f36-822a62224fab.png)

Voltando no arquivo **google-custom-search.json** iremos criar uma nova propriedade e iremos colar o código identificador do mecanismo de busca que criamos, identificado por `searchEngine`, no final irá ficar assim:

```
{
  "apiKey": "API_KEY_AQUI",
  "searchEngine": "ID_MECANISMO_DE_BUSCA"
}
```
