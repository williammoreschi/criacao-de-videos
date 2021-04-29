const readline = require('readline-sync');
const state = require('./state.js');

function robot(){
  const content = {
		maximumSentences : 7
	}

  content.searchTerm = askAndReturnSearchTerm();
	content.prefix = askAndReturnPrefix();
	content.lang = askAndReturnLanguage();
  state.save(content);

  
  function askAndReturnSearchTerm(){
		return readline.question('Type a Wikipedia search term: ');
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
}

module.exports = robot;