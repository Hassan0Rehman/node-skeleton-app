const _ = require("lodash");

const components = {
    scheduleWidget: [{
        mid: "matchId",
        mt: "matchType",
        mh: "matchInfo",
        md: "matchDate",
        mti: "time",
        ml: "matchLocation",
        ms: "matchState",
        mr: "closingComment",
        t1i: "team1Id",
        t1t: "team1Title",
        t1n: "team1Nick",
        t1i1s: "team1Inns1Score",
        t1i2s: "team1Inns2Score",
        t1i1o: "team1Inns1Overs",
        t1i2o: "team1Inns2Overs",
        t2i: "team2Id",
        t2t: "team2Title",
        t2n: "team2Nick",
        t2i1s: "team2Inns1Score",
        t2i2s: "team2Inns2Score",
        t2i1o: "team2Inns1Overs",
        t2i2o: "team2Inns2Overs",
        bt: "BattingTeam",
        st: "seriesTitle",
        str: "stream",
        strh: "streamHLS",
        tId: "msId",
        t1s: "team1Score",
        t2s: "team2Score"
    }],
    stories: {
        id: "id",
        t: "title",
        d: "description",
        bf: "bloggerFName",
        bl: "bloggerLName",
        bi: "bloggerId",
        to: "topic",
        dt: "publishDate",
        at: "article_type",
        ta: "tags",
        e: "excerpt",
        u: "url",
        lu: "linkPostUrl",
        Amp: "Amp"
    },
    featuredArticles: [{
        bi: "bloggerImage",
        bn: "bloggerName",
        dt: "publishDate",
        e: "explanation",
        h: "heading",
        Id: "id",
        t: "title",
        u: "link",
        v: "comments"
    }],
    articles: [{
        at: "articleType",
        dt: "publishDate",
        e: "excerpt",
        ht: "ht",
        Id: "id",
        lu: "linkPostUrl",
        mi: "matchId",
        mt: "matchTitle",
        t: "seriesTitle",
        u: "link"
    }],
    seriesArticles: [{
        Id: "Id",
        u: "Url",
        mi: "MainSeriesId",
        lu: "LinkPostUrl",
        at: "ArticleType",
        dt: "PublishDate",
        ht: "HeadTitle",
        t:  "Title",
        e: "Excerpt",
        mt: "MainSeriesTitle"
    }],
    news: {
        id: "id",
        t: "title",
        d: "description",
        bf: "bloggerFName",
        bl: "bloggerLName",
        bi: "bloggerId",
        to: "topic",
        dt: "publishDate",
        at: "article_type",
        ta: "tags",
        e: "excerpt",
        u: "url",
        lu: "linkPostUrl",
        Amp: "Amp"
    },
    seriesWidget: [{
        mid: "matchId",
        mt: "matchType",
        mh: "matchInfo",
        md: "matchDate",
        mti: "time",
        ml: "matchLocation",
        ms: "matchState",
        mr: "closingComment",
        t1i: "team1Id",
        t1t: "team1Title",
        t1n: "team1Nick",
        t1i1s: "team1Inns1Score",
        t1i2s: "team1Inns2Score",
        t1i1o: "team1Inns1Overs",
        t1i2o: "team1Inns2Overs",
        t2i: "team2Id",
        t2t: "team2Title",
        t2n: "team2Nick",
        t2i1s: "team2Inns1Score",
        t2i2s: "team2Inns2Score",
        t2i1o: "team2Inns1Overs",
        t2i2o: "team2Inns2Overs",
        bt: "BattingTeam",
        st: "seriesTitle",
        str: "stream",
        strh: "streamHLS",
        tId: "msId",
        t1s: "team1Score",
        t2s: "team2Score"
    }],
};
function map(partialName, response) {
    if (_.get(components[partialName], "length") > 0) {
        const map = _.get(components[partialName], "0");
        return _.map(response, function (match, i) {
            return _.mapKeys(match, function (value, key) {
                return _.get(map, key);
            });
        });
    } else {
        const map = _.get(components, partialName);
        return _.mapKeys(response, function (value, key) {
            return _.get(map, key);
        });
    }
}

module.exports = {
    map: map
};
