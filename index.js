const readline = require('readline-sync');
const robots = { 
	text:require('./robots/text.js')
}
async function start(){
	const content = {}

	content.searchTerm = askAndReturnSearchTerm();
	content.prefix = askAndReturnPrefix();
	content.lang = askAndReturnLanguage()

	await robots.text(content);

	function askAndReturnSearchTerm(){
		return readline.question('Type a Wikipedia serach term: ');
	}
	function askAndReturnPrefix(){
		const prefixes = ['Who is','What is', 'The history of'];
		const selectedPrefixIndex =  readline.keyInSelect(prefixes,'Choose one option: ',{cancel:false});
		const selectedPrefixText =  prefixes[selectedPrefixIndex];
		return selectedPrefixText;
	}

	function askAndReturnLanguage(){
    const language = ['pt','en','es'];
    const selectedLangIndex = readline.keyInSelect(language,'Choose Language: ',{cancel:false});
		const selectedLangText = language[selectedLangIndex];
		return selectedLangText;

	}
	console.log(content);
}

start();

