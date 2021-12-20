const fs = require('fs');
const axios = require('axios');

let page = 1;
let jsonArr = [];
let lastPage = 313;
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeResults() {
	while (page <= lastPage) {
		try {
			let response = await axios.get(`https://api.rugscan.finance/api/v1/scan/results?page=${page}`);

      if(page === 1) {
        lastPage = response.data.payload.meta.last_page;
      }

			if (response.status >= 200 && response.status < 300) { // if HTTP-status is 200-299
  				// get the response body (the method explained below)
  				jsonArr = jsonArr.concat(response.data.payload.data);
			} else {
  				alert("HTTP-Error: " + response.status);
			}
			page++;
		} catch (e) {
			console.log(e.message);
			await sleep(10000);
		}
	}
	let json = {"results": jsonArr};
	fs.writeFileSync('results.json', JSON.stringify(json, null, 2));
}

scrapeResults().then(r => console.log('Success'));
