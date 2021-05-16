const robots = { 
	prompts:require('./robots/prompts'),
	input:require('./robots/input.js'),
	text:require('./robots/text.js'),
	state:require('./robots/state.js'),
	image:require('./robots/image.js'),
	video:require('./robots/video.js'),
	youtube:require('./robots/youtube.js')
}
async function start(){
	//robots.input(); //Pesquisar de forma manual
	await robots.prompts(); // Devolve os termos do google trends para fazer a pesquisa
	await robots.text();
	await robots.image();
	await robots.video();
	await robots.youtube();

	//const content = robots.state.load();
	//console.dir(content,{depth:null});
}

start();

