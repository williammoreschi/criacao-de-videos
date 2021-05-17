const algorithmia = require('algorithmia')
const sentenceBoundaryDetection = require('sbd');
const naturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const lexrank = require('lexrank.js');

const state = require('./state.js');

const algorithmiaApiKey = require("../credentials/algorithmia.json").apiKey;
const watsonApiKey = require("../credentials/watson-nlu.json").apikey;

const nlu = new naturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: watsonApiKey }),
  version: '2018-04-05',
  serviceUrl: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com'
});

async function robot(){
  console.log('> [text-robot] Starting...');
  const content = state.load();

	await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  await breakContentIntoLexicalRankedSentences(content); /*Texto mais rico*/
  //breakContentIntoSentences(content); /*Texto mais pobre (pega somente a primeira frase)*/
  limitMaximumSentences(content);
  await fetchKeywordsOfAllSentences(content);

  state.save(content);

	async function fetchContentFromWikipedia(content){
		const algorithmiaAuthentication = algorithmia(algorithmiaApiKey);
		const wikipediaAlgorithmia = algorithmiaAuthentication.algo("web/WikipediaParser/0.1.2");
		const wikipediaResponse = await wikipediaAlgorithmia.pipe({
      lang: content.lang,
      articleName: content.searchTerm
    });
		const wikipediaContent = wikipediaResponse.get();

		content.sourceContentOriginal = wikipediaContent.content;
		//content.sourceContentOriginal = wikipediaContent.summary;
		console.log('> [text-robot] Fetching done!')
	}

	function sanitizeContent(content) {
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
    const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)

    content.sourceContentSanitized = withoutDatesInParentheses

    function removeBlankLinesAndMarkdown(text) {
      const allLines = text.split('\n')

      const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
        if (line.trim().length === 0 || line.trim().startsWith('=')) {
          return false
        }

        return true
      })

      return withoutBlankLinesAndMarkdown.join(' ')
    }

		function removeDatesInParentheses(text) {
			return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
		}
  }

	function breakContentIntoSentences(content) {
    content.sentences = []

    const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: []
      })
    })
  }

  async function breakContentIntoLexicalRankedSentences(content) {
    return new Promise((resolve, reject) => {
      content.sentences = []

      lexrank(content.sourceContentSanitized, (error, result) => {
        if (error) {
          throw error
          return reject(error)
        }

        sentences = result[0].sort(function(a,b){return b.weight.average - a.weight.average})

        sentences.forEach((sentence) => {
          content.sentences.push({
            text: sentence.text,
            keywords: [],
            images: []
          })
        })

        resolve(sentences)
      })
    })
  }

  function limitMaximumSentences(content){
    content.sentences = content.sentences.slice(0,content.maximumSentences);
    return content;
  }

  async function fetchKeywordsOfAllSentences(content){
    console.log('> [text-robot] Starting to fetch keywords from Watson');
    const listOfKeywordsToFetch = content.sentences.map(
      async sentence => await fetchWatsonAndReturnKeywords(sentence)
    )
  
    await Promise.all(listOfKeywordsToFetch);
  }

  async function fetchWatsonAndReturnKeywords(sentence){
    return new Promise((resolve, reject) => {
      nlu.analyze({
        text: sentence.text,
        features: {
          keywords: {}
        }
      })
      .then(response => {
        console.log(`> [text-robot] Sentence: "${sentence.text}"`);
        
        const keywords = response.result.keywords.map(keyword => {
          return keyword.text;
        });
        
        console.log(`> [text-robot] Keywords: ${sentence.keywords.join(', ')}\n`);
        
        sentence.keywords = keywords;
        
        resolve();
      })
      .catch(error => {
        console.log('error: ', error);
        reject(error);
      });
    });
  } 

}
module.exports = robot