const algorithmia = require('algorithmia')
const algorithmiaApiKey = require("../credentials/algorithmia.json").apiKey
function robot(content){
	fetchContentFromWikipedia(content)
	//sanitializeContent(content)
	//breakContentIntoSenteces(content)

	async function fetchContentFromWikipedia(content){
		const algorithmiaAuthentication = algorithmia(algorithmiaApiKey);
		const wikipediaAlgorithmia = algorithmiaAuthentication.algo("web/WikipediaParser/0.1.2");
		const wikipediaResponde = await wikipediaAlgorithmia.pipe(content.searchTerm);
		const wikipediaContent = wikipediaResponde.get();
		console.log(wikipediaContent);
	}
}
module.exports = robot