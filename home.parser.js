const _ =  require("lodash");
const homeMapper = require("./mapper");

const imageUrls = [
    {env: "staging", url: "https://www.cricingif.com/Images/ArticleImages"},
    {env: "production", url: "http://d7d7wuk1a7yus.cloudfront.net/article-images"}
];

module.exports = function formatApiJson(responseString, templateName) {
    try {
        if (templateName === "scheduleWidget") {
            const response = homeMapper.map(templateName, JSON.parse(responseString));
            const _data = [
                {title: "Recently Finished", matches: [], val: 0},
                {title: "Live Cricket", matches: [], val: 1},
                {title: "Upcoming Matches", matches: [], val: 2}
            ];
            _.each(response, function(match) {
                if (match.matchState === 0) _data[0].matches.push(match);
                else if (match.matchState === 1) _data[1].matches.push(match);
                else if (match.matchState === 2) _data[2].matches.push(match);
            });
            return _data;
        } else if (templateName === "articles") {
            const response = homeMapper.map(templateName, JSON.parse(responseString));
            return {
                articles: _.chunk(response, 3),
                imageUrl: process.env.CIG_ENV === "production" ?  imageUrls[1].url : imageUrls[0].url
            };
        }
    } catch (e) {
        console.log("exception in formatApiJson :: " + e);
    }
}
