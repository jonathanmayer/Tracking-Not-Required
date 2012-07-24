/*
ConversionMeasure.js
Jonathan Mayer - jmayer@stanford.edu
 
A prototype implementation of privacy-preserving advertisement conversion measurement.

v0.01 - 7/23/12
*/

function ConversionMeasure () {
	
	var saveImpressions = function (impressions) {
		window.localStorage['CM'] = JSON.stringify(impressions);
	};
	
	var loadImpressions = function () {
		var impressions = window.localStorage.getItem('CM');
		if(impressions == null)
			impressions = { };
		else
			impressions = JSON.parse(impressions);
		return impressions;
	};
	
	// campaign: a campaign ID
	// url: the URL where the campaign was displayed
	// date: when the campaign was displayed
	this.recordImpression = function (campaign, url, date) {
		var impressions = loadImpressions();
		var campaignImpressions;
		if(impressions.hasOwnProperty(campaign))
			campaignImpressions = impressions[campaign];
		else {
			campaignImpressions = { };
			impressions[campaign] = campaignImpressions;
		}
		// Truncate the url URL into a public suffix + 1
		// (this implementation is hacky)
		var urlA = document.createElement('a');
		urlA.href = url;
		var origin = urlA.hostname;
		origin = origin.split('.').slice(-2).join('.');
		var campaignImpressionsForOrigin;
		if(campaignImpressions.hasOwnProperty(origin))
			campaignImpressionsForOrigin = campaignImpressions[origin];
		else {
			campaignImpressionsForOrigin = { };
			campaignImpressions[origin] = campaignImpressionsForOrigin;
		}
		// Round the date to the prior week
		var week = new Date(date.getTime());
		week.setUTCDate(date.getUTCDate() - date.getUTCDay());
		week.setUTCHours(0);
		week.setUTCMinutes(0);
		week.setUTCSeconds(0);
		week.setUTCMilliseconds(0);
		var campaignImpressionsForOriginAndWeek;
		if(campaignImpressionsForOrigin.hasOwnProperty(week.getTime()))
			campaignImpressionsForOriginAndWeek = campaignImpressionsForOrigin[week.getTime()];
		else {
			campaignImpressionsForOriginAndWeek = { };
			campaignImpressionsForOriginAndWeek.count = 0;
			campaignImpressionsForOrigin[week.getTime()] = campaignImpressionsForOriginAndWeek;
		}
		campaignImpressionsForOriginAndWeek.count++;
		saveImpressions(impressions);
	};
	
	// campaign: a campaign ID
	// return: sorted array of Impression objects
	// an Impression object contains:
	// -origin (string)
	// -date (Date, nearest Sunday)
	// -count (integer)
	this.getImpressionsForConversion = function (campaign) {
		var impressions = loadImpressions();
		var impressionsForConversion = [ ];
		if(!impressions.hasOwnProperty(campaign))
			return impressionsForConversion;
		var campaignImpressions = impressions[campaign];
		for(origin in campaignImpressions)
			for(date in campaignImpressions[origin]) {
				var impression = { };
				impression.origin = new String(origin);
				impression.date = new Date(parseInt(date));
				impression.count = campaignImpressions[origin][date].count;
				impressionsForConversion.push(impression);
			}
		impressionsForConversion.sort(function(first, second) {
			var urlComparison = first.origin.localeCompare(second.origin);
			if(urlComparison != 0)
				return urlComparison;
			return second.date.getTime() - first.date.getTime();
		});
		return impressionsForConversion;
	};
}