const googleTrends = require('google-trends-api');

function robot(count) {
  console.log('> [searchHotTrends-robot] Starting...');
  const trendsSettings = {
    trendDate: new Date(),
    geo: 'BR',
    hl: "pt-BR",
    category:'all',
  };

  return googleTrends.realTimeTrends(trendsSettings)
    .then(JSON.parse)
    .then(parsedResult => parsedResult.storySummaries.trendingStories)
    .then(hotTrendStories => hotTrendStories.map(story => story['entityNames']))
    .then(hotTrends => {
      return hotTrends.map(term => {
        return {
          title: term[0],
          value: term[0]
        }
      });
      //return [].concat.apply([], hotTrends).slice(0, count)
    })
    .catch(error => {
      console.error('An error occurs: ', error);
      return [];
    });
}

module.exports = robot;