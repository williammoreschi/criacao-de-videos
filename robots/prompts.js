const prompts = require('prompts');
const searchHotTrends = require('./searchHotTrends.js');
const state = require('./state.js');

async function robot(){
  console.log('> [prompts-robot] Starting...');
  const content = {
		maximumSentences : 7
	}

  const answers = await askAndReturnAnswers();
  state.save(Object.assign(content,answers));
  
  async function askAndReturnAnswers(){
    console.log('> askAndReturnAnswers');
    const cnt = 9;
    const questions = [
      {
        type: 'select',
        name: 'searchTerm',
        message: 'Choose one search term:',
        choices: await searchHotTrends(cnt),
        validate: value => typeof value === 'string' ? value.trim() : false,
      },
      {
        type: 'select',
        name: 'prefix',
        message: 'Choose one option:',
        choices: [
          {
            title:'Who is',
            value:'Who is', 
  
          },
          {
            title:'What is',
            value:'What is', 
  
          },
          {
            title:'The history of',
            value:'The history of',
          },
        ],
        validate: value => typeof value === 'string' ? value.trim() : false,
      },
      {
        type: 'select',
        name: 'lang',
        message: 'Choose Language:',
        choices: [
          {title:'pt',value:'pt'}, 
          {title:'en',value:'en'}, 
          {title:'es',value:'es'},
        ],
        validate: value => typeof value === 'string' ? value.trim() : false,
      }
    ];
  
    return new Promise(async (resolve, reject) => {
      const promptOptions = {
        onCancel: () => reject(new Error('The user has stopped answering'))
      }
      const response = await prompts(questions, promptOptions)
      resolve(response)
    });
  }

}

module.exports = robot;