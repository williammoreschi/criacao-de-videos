const readline = require('readline-sync');
const robots = { 
	text:require('./robots/text.js')
}
function start(){
	const content = {}

	content.searchTerm = askAndReturnSearchTerm();
	content.prefix = askAndReturnPrefix();

	robots.text(content);

	function askAndReturnSearchTerm(){
		return readline.question('Type a Wikipedia serach term: ');
	}
	function askAndReturnPrefix(){
		const prefixes = ['Who is','What is', 'The history of'];
		const selectedPrefixIndex =  readline.keyInSelect(prefixes,'Choose one option: ');
		const selectedPrefixText =  prefixes[selectedPrefixIndex];
		return selectedPrefixText;
	}
	console.log(content);
}

start();

