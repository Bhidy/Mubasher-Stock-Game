function extractBing(bingLink) {
    try {
        const urlObj = new URL(bingLink);
        const realUrl = urlObj.searchParams.get('url');
        return realUrl || bingLink;
    } catch (e) {
        return bingLink;
    }
}

const testLink = 'http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=6933e9fc80314c84b91de8d58efb9cd4&url=https%3a%2f%2fwww.zawya.com%2fen%2fcapital-markets%2fequities%2fegypt-to-swap-capital-gains-for-stamp-duty-to-boost-stock-market-investment-mxpkajic&c=14679544792726330385&mkt=ar-eg';
console.log(extractBing(testLink));
