{
	"translatorID": "83979786-44af-494a-9ddb-46654e0486ef",
	"label": "Reuters",
	"creator": "Avram Lyon, Michael Berkowitz, Sebastian Karcher",
	"target": "^https?://\\w+\\.reuters\\.com/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2021-08-16 19:30:29"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Reuters Translator
	Copyright © 2011-2021 Avram Lyon, Sebastian Karcher, and Abe Jellinek

	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/


function detectWeb(doc, url) {
	if (attr(doc, 'meta[property="og:type"]', 'content') == 'article') {
		return "newspaperArticle";
	}
	else if (url.includes('/search/') && getSearchResults(doc, true)) {
		return "multiple";
	}
	return false;
}


function getSearchResults(doc, checkOnly) {
	var items = {};
	var found = false;
	var rows = doc.querySelectorAll('h3.search-result-title>a');
	for (let row of rows) {
		let href = row.href;
		let title = ZU.trimInternal(row.textContent);
		if (!href || !title) continue;
		if (checkOnly) return true;
		found = true;
		items[href] = title;
	}
	return found ? items : false;
}


function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		Zotero.selectItems(getSearchResults(doc, false), function (items) {
			if (!items) {
				return;
			}
			var articles = [];
			for (var i in items) {
				articles.push(i);
			}
			ZU.processDocuments(articles, scrape);
		});
	}
	else {
		scrape(doc, url);
	}
}


function scrape(doc, url) {
	var translator = Zotero.loadTranslator('web');
	// Embedded Metadata
	translator.setTranslator('951c027d-74ac-47d4-a107-9c3069ab7b48');
	translator.setDocument(doc);

	translator.setHandler('itemDone', function (obj, item) {
		item.creators = [];
		let authors = doc.querySelectorAll('[rel="author"] , a[class*="Byline-author"]');
		for (let author of authors) {
			item.creators.push(authorFix(author.textContent));
		}
		
		item.publicationTitle = "Reuters";
		item.tags = attr(doc, 'meta[property$="article:tag"]', 'content')
			.split(/\s*[/,]\s*/).map(tag => ({ tag }));
		
		item.complete();
	});

	translator.getTranslatorObject(function (trans) {
		trans.itemType = detectWeb(doc);
		trans.doWeb(doc, url);
	});
}

function authorFix(author) {
	// Sometimes we have "By Author"
	author = author.replace(/^\s*by/i, '');

	var cleaned = Zotero.Utilities.cleanAuthor(author, "author");
	// If we have only one name, set the author to one-name mode
	if (!cleaned.firstName) {
		cleaned.fieldMode = 1;
	}
	else {
		// We can check for all lower-case and capitalize if necessary
		// All-uppercase is handled by cleanAuthor
		cleaned.firstName = (cleaned.firstName == cleaned.firstName.toLowerCase()) ? Zotero.Utilities.capitalizeTitle(cleaned.firstName, true) : cleaned.firstName;
		cleaned.lastName = (cleaned.lastName == cleaned.lastName.toLowerCase()) ? Zotero.Utilities.capitalizeTitle(cleaned.lastName, true) : cleaned.lastName;
	}
	return cleaned;
}

/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://www.reuters.com/article/us-eurozone/europe-could-be-in-worst-hour-since-ww2-merkel-idUSTRE7AC15K20111114",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "Europe could be in worst hour since WW2: Merkel",
				"creators": [],
				"date": "2011-11-14T00:16:09Z",
				"abstractNote": "Prime Minister-designate Mario Monti meets the leaders of Italy's biggest two parties on Tuesday to discuss the \"many sacrifices\" needed to reverse a collapse in market confidence that is driving an ever deepening euro zone debt crisis.",
				"language": "en",
				"libraryCatalog": "www.reuters.com",
				"publicationTitle": "Reuters",
				"section": "Business News",
				"shortTitle": "Europe could be in worst hour since WW2",
				"url": "https://www.reuters.com/article/us-eurozone-idUSTRE7AC15K20111114",
				"attachments": [
					{
						"title": "Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [
					{
						"tag": "Debt"
					},
					{
						"tag": "Diplomacy"
					},
					{
						"tag": "EUROZONE"
					},
					{
						"tag": "Economic News"
					},
					{
						"tag": "Euro Zone as a Whole"
					},
					{
						"tag": "Europe"
					},
					{
						"tag": "European Union"
					},
					{
						"tag": "Fixed Income Markets"
					},
					{
						"tag": "Foreign Policy"
					},
					{
						"tag": "Government"
					},
					{
						"tag": "Government Finances"
					},
					{
						"tag": "Greece"
					},
					{
						"tag": "Italy"
					},
					{
						"tag": "National Government Debt"
					},
					{
						"tag": "Politics"
					},
					{
						"tag": "US"
					},
					{
						"tag": "Western Europe"
					}
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.reuters.com/search/news?blob=europe",
		"items": "multiple"
	},
	{
		"type": "web",
		"url": "https://www.reuters.com/world/americas/perus-indigenous-hope-voice-last-under-new-president-2021-07-05/",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "Peru's indigenous hope for a voice, at last, under new president",
				"creators": [
					{
						"firstName": "Stefanie",
						"lastName": "Eschenbacher",
						"creatorType": "author"
					},
					{
						"firstName": "Angela",
						"lastName": "Ponce",
						"creatorType": "author"
					}
				],
				"date": "2021-07-05T10:00:00Z",
				"abstractNote": "Maxima Ccalla, 60, an indigenous Quechua woman, has spent her life tilling the harsh soil in Peru's Andean highlands, resigned to a fate far removed from the vast riches buried deep beneath her feet in seams of copper, zinc and gold.",
				"libraryCatalog": "www.reuters.com",
				"publicationTitle": "Reuters",
				"section": "Americas",
				"url": "https://www.reuters.com/world/americas/perus-indigenous-hope-voice-last-under-new-president-2021-07-05/",
				"attachments": [
					{
						"title": "Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.reuters.com/article/us-germany-wages-idUSKBN2BM1PY",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "A raise or a four-day week; biggest German union seals new deal",
				"creators": [],
				"date": "2021-03-30T12:48:00Z",
				"abstractNote": "Germany's largest trade union, IG Metall, agreed a 2.3% wage increase, to be paid either in full or as part of a switch to a four-day week, in a key industrial region, setting the benchmark for 3.9 million metal and engineering workers nationwide.",
				"language": "en",
				"libraryCatalog": "www.reuters.com",
				"publicationTitle": "Reuters",
				"section": "reboot-live",
				"url": "https://www.reuters.com/article/us-germany-wages-idUSKBN2BM1PY",
				"attachments": [
					{
						"title": "Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [
					{
						"tag": "Auto & Truck Manufacturers (NEC) (TRBC level 5)"
					},
					{
						"tag": "Auto & Truck Manufacturers (TRBC level 4)"
					},
					{
						"tag": "Coronavirus"
					},
					{
						"tag": "East European Countries"
					},
					{
						"tag": "Europe"
					},
					{
						"tag": "GERMANY"
					},
					{
						"tag": "Germany"
					},
					{
						"tag": "Industrials (TRBC level 1)"
					},
					{
						"tag": "Iron"
					},
					{
						"tag": "Job Cuts"
					},
					{
						"tag": "Metals & Mining (TRBC level 3)"
					},
					{
						"tag": "Reuters Top News"
					},
					{
						"tag": "Steel Mills & Foundries (TRBC level 5)"
					},
					{
						"tag": "US"
					},
					{
						"tag": "WAGES"
					},
					{
						"tag": "Western Europe"
					},
					{
						"tag": "Workers Pay"
					},
					{
						"tag": "Workforce"
					}
				],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
