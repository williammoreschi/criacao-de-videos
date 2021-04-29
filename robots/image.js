const imageDownload = require('image-downloader');
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');
const state = require('./state.js');

const googleSearchCredentials = require('../credentials/google-search.json');


async function robot(){
  const content = state.load();

  await fetchImagesOfAllSentences(content);
  await downloadAllImages(content);
  
  state.save(content);

  async function fetchImagesOfAllSentences(content){
    for(const sentence of content.sentences){
      const query = `${content.searchTerm} ${sentence.keywords[0]}`;
      sentence.images = await fetchGoogleAndReturnImagesLinks(query);
      sentence.googleSearchQuery = query;
    }
  }

  async function fetchGoogleAndReturnImagesLinks(query){
    const response = await customSearch.cse.list({
      auth: googleSearchCredentials.apiKey,
      cx: googleSearchCredentials.searchEngineId,
      q: query,
      searchType: 'image',
      imgSize: 'huge',
      //rights: 'cc_publicdomain,cc_noncommercial',
      num: 2
    });
    const imagesUrl = response.data.items.map((item) => {
      return item.link;
    })
    return imagesUrl;
  }

  async function downloadAllImages(content){
    content.downloadImages = [];

    for(let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++){
      const images = content.sentences[sentenceIndex].images;

      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const imageUrl = images[imageIndex];
        try{
          if(content.downloadImages.includes(imageUrl)){
            throw new Error('Imagem já foi baixada');
          }

          await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);
          content.downloadImages.push(imageUrl);
          console.log(`> [${sentenceIndex}] [${imageIndex}] Baixou imagem com sucesso: ${imageUrl}`);
          break;
        }catch(err){
          console.log(`> [${sentenceIndex}] [${imageIndex}] Erro ao baixar: ${imageUrl}: ${err}`);
        }
      }
    }
  }

  async function downloadAndSave(url,fileName){
    return imageDownload.image({
      url: url,
      dest: `./content/${fileName}`
    });
  }

}

module.exports = robot;