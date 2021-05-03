<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/williammoreschi/criacao-de-videos">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/williammoreschi/criacao-de-videos">
  <img alt="Repository Issues" src="https://img.shields.io/github/issues/williammoreschi/criacao-de-videos">
  <a href="https://github.com/williammoreschi">
    <img alt="Made by William Moreschi" src="https://img.shields.io/badge/created%20by-William%20Moreschi-blue">
  </a>
</p>

# Criando vídeos de forma automatizada

O Projeto é open source. Para a criação dos vídeos é utilizado a APIS Machining Learn da **Algorithmia**, **Watson - Natural Language Understanding** (IBM) , 
**Google Imagens e Search**. Esse projeto está sendo desenvolvido com base nos vídeos do youtube feitos no canal do Filipe Deschamps.

## Filipe Deschamps - 4 robôs que criam vídeos no YouTube
[Play list completa](https://www.youtube.com/watch?v=kjhu1LEmRpY&list=PLMdYygf53DP4YTVeu0JxVnWq01uXrLwHi)

## Pré requisitos

- Git (https://git-scm.com/)
- Node (https://nodejs.org)


## Clonando o Repositório
Com o Git e o Node.js instalado na sua maquina e a **URL** do projeto em mãos, cria em algum lugar do seu pc uma pasta para criarmos uma copia do repositório, dentro dela abra o **cmd** ou **powershell** e digite os comandos abaixo:
```shell
git clone https://github.com/williammoreschi/criacao-de-videos
cd criacao-de-videos
npm install
```

## Api: Algorithmia
É necessário criar a sua chave de acesso para poder testar os robôs, pra isso você precisa acessar o site do Algorithmia, aqui não tem muito segredo, basta acessar e se cadastrar, depois de logar na sua conta, na Dashboard procure no menu Api Keys e copie.
![Algorithmin](https://user-images.githubusercontent.com/2512512/116796037-d6857000-aaaf-11eb-9c0d-2335f45b0f81.gif)
vá até a pasta do projeto onde você clonou o repositório, navegue até a pasta **criacao-de-videos\credentials**, crie um arquivo de texto e renomeie para **algorithmia.json**, dentro desse arquivo você irá colocar a API que copiou do site Algorithmia na estrutura abaixo:

```json
{
  "apiKey": "API_KEY_AQUI"
}
```

## Api: Watson
Você precisa criar também as credenciais do *Watson* no site da [IBM](https://cloud.ibm.com/login), também não tem segredo, basta se cadastrar, quando estiver logado no menu superior clique em **Catálogo**, depois dentro de **IA** procure por *Natural Language Understanding*
![IBM-Watson](https://user-images.githubusercontent.com/2512512/116796537-90321000-aab3-11eb-9d12-7cce2bb143df.gif)
clicando nele na nova página vai aparecer um botão "criar" no final da página, uma vez que o serviço for criado, você será redirecionado para a página de gerenciamento do serviço que você acabou de criar, no menu lateral esquerdo procure por Credenciais de Serviços e depois clique em Auto-generated service credentials destacado abaixo, então copie as Credenciais.

Novamente, voltando na pasta do projeto ainda dentro da pasta **criacao-de-videos\credentials** você ira criar um novo arquivo de texto com o nome **watson-nlu.json** e dentro desse arquivo você vai colar as credenciais que copiou anteriormente:
``` json
{
  "apikey" : "...",
  "iam_apikey_description" : "...",
  "iam_apikey_name": "...",
  "iam_role_crn": "...",
  "iam_serviceid_crn": "...",
  "url": "..."
}
```


## Setup: Google Cloud Plataform

> Ps.: É importante lembrar que alguns recursos do **Google Cloud Plataform** são **Pagos**, por esse motivo é necessário inserir as informações de pagamento, mas fique tranquilo porque iremos utilizar apenas os recursos **Gratuitos**

Antes de criarmos as api's que iremos utilizar é necessário vincular a nossa conta do Google com o [Google Cloud Plataform](https://cloud.google.com/), na página do **Google Cloud Plataform** você irá clicar no botão **Faça uma Avaliação Gratuita**

[![Video](https://user-images.githubusercontent.com/2512512/116834050-cc886d80-ab92-11eb-98c9-10b9786d14b3.png)](https://user-images.githubusercontent.com/2512512/116830554-6f37f080-ab81-11eb-8df7-3d39c2a7716a.mp4)

## Criando o Projeto
Agora é a hora de criarmos um projeto que iremos vincular as Api's que vamos utilizar, para isso basta clicar no menu do topo da página "**Selecionar projeto**" e depois em "**Novo Projeto**", de um nome ao projeto e clique no botão criar.

Após isso o projeto começará a ser criado e assim que terminar um menu vai aparecer com o projeto que acabamos de criar então você irá seleciona-lo

[![Video](https://user-images.githubusercontent.com/2512512/116833957-626fc880-ab92-11eb-85ef-97af013a17a2.png)](https://user-images.githubusercontent.com/2512512/116830859-98a54c00-ab82-11eb-882a-c55dfb1088e6.mp4)

## Api: Custom Search API
Com o projeto criado agora é hora de habilitarmos e configurarmos a Api, você irá clicar no menu lateral esquerdo no topo navegar até API's e Serviços > Bibliotecas, no campo de pesquisa basta procurar por Custom Search API, clicar em Ativar, e aguardar até a ativação da api.

[![Video](https://user-images.githubusercontent.com/2512512/116833927-35bbb100-ab92-11eb-80d7-999fb5c4dcfe.png)](https://user-images.githubusercontent.com/2512512/116831305-c4c1cc80-ab84-11eb-938f-abec08d89d83.mp4)


Após isso irá aparecer sua Api Key, você vai copia-la e clicar no botão concluir, voltando a pasta do projeto você vai navegar até /credentials e irá criar um novo arquivo chamado **google-search.json** com o conteúdo abaixo:
```json
{
  "apiKey": "API_KEY_AQUI"
}
```

## Api: YouTube
Repita o processo acima e busque por **YouTube Data API v3** clique em ativar. Depois no menu lateral seleciona Credenciais e clique em *criar credenciais* selecione a opção **ID do cliente Oauth**. Na próxima tela selecione *Aplicativo da Web* depois preencha os campos.
no campo url use **http://localhost:5000** e na url de redirecionamento **http://localhost:5000/oauth2callback/**

[![Video](https://user-images.githubusercontent.com/2512512/116833927-35bbb100-ab92-11eb-80d7-999fb5c4dcfe.png)](https://user-images.githubusercontent.com/2512512/116832127-e7a2af80-ab89-11eb-8272-12e0d84772e5.mp4)

Depois de gerado salve o arquivo na pasta */credentials* com nome **google-youtube.json**


> Ps. No vídeo o Filipe orienta a criar um novo projeto para adicionar a api do Youtube, porem aqui, estou usando o mesmo projeto que criei para o video-maker, mas caso queria criar um novo projeto basta seguir os passos de **Criando o Projeto** que está no começo desse guia!

### Api: Custom Search Enginer
Agora iremos configurar o nosso motor de busca personalizado do google, para isso você vai acessar o [Custom Search Engine](https://cse.google.com/cse/create/new). Nessa parte a interface mudou um pouco veja o video abaixo.

[![Video](https://user-images.githubusercontent.com/2512512/116833879-fee59b00-ab91-11eb-8d52-5efa25088530.png)](https://user-images.githubusercontent.com/2512512/116832938-22f2ad80-ab8d-11eb-8a70-b313530d710c.mp4)
 

> PS.: Para saber mais sobre o schema que o Filipe cita no vídeo acesse schema.org

Voltando no arquivo **google-search.json** iremos criar uma nova propriedade e iremos colar o código identificador do mecanismo de busca que criamos, identificado por `searchEngineId`, no final irá ficar assim:

```
{
  "apiKey": "API_KEY_AQUI",
  "searchEngineId": "ID_MECANISMO_DE_BUSCA"
}
```

## É hora de testar

Agora dentro da pasta criacao-de-videos você pode abrir o cmd ou powershell e executar o comando:
```
node index.js
```
[![Executando o Projeto](https://user-images.githubusercontent.com/2512512/116833360-0f484680-ab8f-11eb-8b26-fc399379dd82.png)](https://user-images.githubusercontent.com/2512512/116833237-7dd8d480-ab8e-11eb-9cb0-0afc63889576.mp4)
