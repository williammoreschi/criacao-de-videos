# criacao-de-videos
Projeto open source para criar vídeos automatizados. Se quiser saber mais acesse: o canal do Filipe Deschamps no youtube.

## Pré requisitos
- Git (https://git-scm.com/)
- Node (https://nodejs.org)

## Api: Algorithmia
Para testar os robôs é necessário criar uma conta no site do [algorithmia](https://algorithmia.com) para ter acesso a uma chave de acesso. Depois de criar a conta e só acessar o *Dashboard* e ir no menu **Api Keys** e copiar a sua chave.

Depois navegue até a pasta **criacao-de-videos/credentials** crie um arquivo de texto e renomeie para algorithmia.json, dentro desse arquivo você irá colocar a API que copiou do site Algorithmia na estrutura abaixo:
```json
{
  "apiKey": "API_KEY_AQUI"
}
```

## Api: Watson
Você precisa criar também as credenciais do Watson no site da IBM, também não tem segredo, basta se cadastrar, quando estiver logado no menu superior clique em Catálogo, depois dentro de IA procure por Natural Language Understanding

Novamente, voltando na pasta do projeto ainda dentro da pasta video-maker\credentials você ira criar um novo arquivo de texto com o nome watson-nlu.json e dentro desse arquivo você vai colar as credenciais que copiou anteriormente:

{
  "apikey" : "...",
  "iam_apikey_description" : "...",
  "iam_apikey_name": "...",
  "iam_role_crn": "...",
  "iam_serviceid_crn": "...",
  "url": "..."
}
