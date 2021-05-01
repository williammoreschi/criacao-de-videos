const algorithmia = require('algorithmia')
const sentenceBoundaryDetection = require('sbd');
const naturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const state = require('./state.js');

const algorithmiaApiKey = require("../credentials/algorithmia.json").apiKey;
const watsonApiKey = require("../credentials/watson-nlu.json").apikey;

const nlu = new naturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: watsonApiKey }),
  version: '2018-04-05',
  serviceUrl: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com'
});

async function robot(){
  const content = state.load();

	await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSentences(content);
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

		content.sourceContentOriginal = wikipediaContent.content
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

  function limitMaximumSentences(content){
    content.sentences = content.sentences.slice(0,content.maximumSentences);
    return content;
  }

  async function fetchKeywordsOfAllSentences(content){
    for(const sentence of content.sentences){
      sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);
    }
  }

  async function fetchWatsonAndReturnKeywords(sentence){
    return new Promise((resolve, reject) => {
      nlu.analyze({
        text: sentence,
        features: {
          keywords: {}
        }
      })
      .then(response => {
        const keywords = response.result.keywords.map(keyword => {
          return keyword.text;
        });
        resolve(keywords);
      })
      .catch(error => {
        console.log('error: ', error);
        reject(error);
      });
    });
  } 

}
module.exports = robot