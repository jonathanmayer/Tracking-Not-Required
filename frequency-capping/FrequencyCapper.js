/*
FrequencyCapper.js
Jonathan Mayer - jmayer@stanford.edu
 
A prototype implementation of privacy-preserving advertisement frequency capping.

v0.01 - 4/22/12
*/

function FrequencyCapper () {

	var makeKey = function (id) {
		return "FC_" + id;
	};
	
	var getImpressionCount = function (id) {
		var key = makeKey(id);
		var count = window.localStorage[key];
		if(count == null)
			return 0;
		else
			return parseInt(count);
	}
	
	var setImpressionCount = function (id, count) {
		var key = makeKey(id);
		window.localStorage[key] = count.toString();
	}
	
	this.recordImpression = function (id) {
		var oldImpressionCount = getImpressionCount(id);
		setImpressionCount(id, oldImpressionCount + 1);
	};
	
	// candidates: a preference-ordered array of {id, cap} objects
	// n: a maximum number of ids to return uncapped
	// return: array of uncapped creative or campaign ids
	this.getUncapped = function (candidates, n) {
		var uncapped = [ ];
		for(var i = 0; i < candidates.length && uncapped.length < n; i++) {
			var candidateId = candidates[i].id;
			var candidateCap = candidates[i].cap;
			var impressionCount = getImpressionCount(candidateId);
			if(impressionCount < candidateCap)
				uncapped.push(candidateId);
		}
		return uncapped;
	};
}