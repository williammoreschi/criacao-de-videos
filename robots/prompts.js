const prompts = require('prompts');
const searchHotTrends = require('./searchHotTrends.js');
const state = require('./state.js');

async function robot(){
  console.log('> [prompts-robot] Starting...');
  const content = {
		maximumSentences : 7
	}

  const otherQuestions = [
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
  ]

  const answer = await whichTypeOfSearch(); 
  
  let answers = [];
  switch (answer.type) {
    case 'google-trends':
      answers = await askAndReturnAnswersGoogleTrends();
      break;
    case 'wikipedia':
      answers = await askAndReturnAnswersWikipedia();
      break;
  }
  
  state.save(Object.assign(content,answers));
  
  async function whichTypeOfSearch(){
    const questions = [
      {
        type: 'select',
        name: 'type',
        message: 'Type a wikipedia search term or to fetch google-trends:',
        choices: [
          {
            title:'Wikipedia',
            value:'wikipedia', 
          },
          {
            title:'Google Trends',
            value:'google-trends', 
          },
        ],
        validate: value => typeof value === 'string' ? value.trim() : false,
      }
    ]
    return new Promise(async (resolve, reject) => {
      const promptOptions = {
        onCancel: () => reject(new Error('The user has stopped answering'))
      }
      const response = await prompts(questions, promptOptions)
      resolve(response)
    });
  }
  
  async function askAndReturnAnswersGoogleTrends(){
    const cnt = 9;
    const questions = [
      {
        type: 'select',
        name: 'searchTerm',
        message: 'Choose one search term:',
        choices: await searchHotTrends(cnt),
        validate: value => typeof value === 'string' ? value.trim() : false,
      }
    ];
    
  
    return new Promise(async (resolve, reject) => {
      const promptOptions = {
        onCancel: () => reject(new Error('The user has stopped answering'))
      }
      const response = await prompts(questions.concat(otherQuestions), promptOptions)
      resolve(response)
    });
  }
  
  async function askAndReturnAnswersWikipedia(){
    const questions = [
      {
        type: 'text',
        name: 'searchTerm',
        message: 'Type a Wikipedia search term:',
        validate: value => typeof value === 'string' ? value.trim() !== '' : false,
      },
    ];
    
    return new Promise(async (resolve, reject) => {
      const promptOptions = {
        onCancel: () => reject(new Error('The user has stopped answering'))
      }
      const response =  await prompts(questions.concat(otherQuestions), promptOptions);
      resolve(response);
    });
  }

}

module.exports = robot;