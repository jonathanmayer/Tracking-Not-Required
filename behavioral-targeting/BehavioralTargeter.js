/*
BehavioralTargeter.js
Jonathan Mayer - jmayer@stanford.edu
 
A prototype implementation of privacy-preserving behavioral advertisement targeting.

v0.01 - 6/6/12
*/

function BehavioralTargeter () {
	
	var interestsForLocation = function (location) {
		// Using a hard-coded example database. In production, dynamically query a service.
		// Also, limited to PS+1. In production, use the full URL.
		var locationDB = {
			'cars.com': ['cars', 'daydreaming'],
			'foodnetwork.com': ['cooking', 'housework']
		};
		if (locationDB[location] == null)
			return [ ];
		else
			return locationDB[location];
	};
	
	var saveInterests = function (interests) {
		window.localStorage['BT'] = JSON.stringify(interests);
	};
	
	var loadInterests = function () {
		var interests = window.localStorage['BT'];
		if(interests == null)
			interests = { };
		else
			interests = JSON.parse(interests);
		return interests;
	};
	
	var addInterests = function (newInterests) {
		var currentInterests = loadInterests();
		for(var i = 0; i < newInterests.length; i++)
			currentInterests[newInterests[i]] = true;
		saveInterests(currentInterests);
	};
	
	this.recordVisit = function (location) {
		var newInterests = interestsForLocation(location);
		if(newInterests.length > 0)
			addInterests(newInterests);
	};
	
	// candidates: a preference-ordered array of {id, [interests]} objects
	// n: a maximum number of ids to return uncapped
	// return: array of targeted ids
	this.getTargeted = function (candidates, n) {
		var interests = loadInterests();
		var targeted = [ ];
		for(var i = 0; i < candidates.length && targeted.length < n; i++) {
			var candidateId = candidates[i].id;
			var candidateInterests = candidates[i].interests;
			for(var j = 0; j < candidateInterests.length; j++)
				if(interests[candidateInterests[j]] == true)
					targeted.push(candidateId);
		}
		return targeted;
	};
}