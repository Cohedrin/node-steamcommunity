var SteamCommunity = require('../index.js');
var SteamID = require('steamid');

SteamCommunity.prototype.addFriend = function(userID, callback) {
	if(typeof userID === 'string') {
		userID = new SteamID(userID);
	}

	var self = this;
	this.request.post({
		"uri": "https://steamcommunity.com/actions/AddFriendAjax",
		"form": {
			"accept_invite": 0,
			"sessionID": this.getSessionID(),
			"steamid": userID.toString()
		},
		"json": true
	}, function(err, response, body) {
		if(!callback) {
			return;
		}

		if(self._checkHttpError(err, response, callback)) {
			return;
		}

		if(body.success) {
			callback(null);
		} else {
			callback(new Error("Unknown error"));
		}
	});
};

SteamCommunity.prototype.acceptFriendRequest = function(userID, callback) {
	if(typeof userID === 'string') {
		userID = new SteamID(userID);
	}

	var self = this;
	this.request.post({
		"uri": "https://steamcommunity.com/actions/AddFriendAjax",
		"form": {
			"accept_invite": 1,
			"sessionID": this.getSessionID(),
			"steamid": userID.toString()
		}
	}, function(err, response, body) {
		if(!callback) {
			return;
		}

		if(self._checkHttpError(err, response, callback)) {
			return;
		}

		callback(null);
	});
};

SteamCommunity.prototype.removeFriend = function(userID, callback) {
	if(typeof userID === 'string') {
		userID = new SteamID(userID);
	}

	var self = this;
	this.request.post({
		"uri": "https://steamcommunity.com/actions/RemoveFriendAjax",
		"form": {
			"sessionID": this.getSessionID(),
			"steamid": userID.toString()
		}
	}, function(err, response, body) {
		if(!callback) {
			return;
		}

		if(self._checkHttpError(err, response, callback)) {
			return;
		}

		callback(null);
	});
};

SteamCommunity.prototype.blockCommunication = function(userID, callback) {
	if(typeof userID === 'string') {
		userID = new SteamID(userID);
	}

	var self = this;
	this.request.post({
		"uri": "https://steamcommunity.com/actions/BlockUserAjax",
		"form": {
			"sessionID": this.getSessionID(),
			"steamid": userID.toString()
		}
	}, function(err, response, body) {
		if(!callback) {
			return;
		}

		if(self._checkHttpError(err, response, callback)) {
			return;
		}

		callback(null);
	});
};

SteamCommunity.prototype.unblockCommunication = function(userID, callback) {
	if(typeof userID === 'string') {
		userID = new SteamID(userID);
	}

	var form = {"action": "unignore"};
	form['friends[' + userID.toString() + ']'] = 1;

	this._myProfile('friends/blocked/', form, function(err, response, body) {
		if(!callback) {
			return;
		}

		if(err || response.statusCode >= 400) {
			callback(err || new Error("HTTP error " + response.statusCode));
			return;
		}

		callback(null);
	});
};

SteamCommunity.prototype.postUserComment = function(userID, message, callback) {
	if(typeof userID === 'string') {
		userID = new SteamID(userID);
	}

	var self = this;
	this.request.post({
		"uri": "https://steamcommunity.com/comment/Profile/post/" + userID.toString() + "/-1",
		"form": {
			"comment": message,
			"count": 6,
			"sessionid": this.getSessionID()
		},
		"json": true
	}, function(err, response, body) {
		if(!callback) {
			return;
		}

		if(self._checkHttpError(err, response, callback)) {
			return;
		}

		if(body.success) {
			callback(null);
		} else if(bpdy.error) {
			callback(new Error(body.error));
		} else {
			callback(new Error("Unknown error"));
		}
	});
};

SteamCommunity.prototype.inviteUserToGroup = function(userID, groupID, callback) {
	if(typeof userID === 'string') {
		userID = new SteamID(userID);
	}

	var self = this;
	this.request.post({
		"uri": "https://steamcommunity.com/actions/GroupInvite",
		"form": {
			"group": groupID.toString(),
			"invitee": userID.toString(),
			"json": 1,
			"sessionID": this.getSessionID(),
			"type": "groupInvite"
		},
		"json": true
	}, function(err, response, body) {
		if(!callback) {
			return;
		}

		if(self._checkHttpError(err, response, callback)) {
			return;
		}

		if(body.results == 'OK') {
			callback(null);
		} else if(body.results) {
			callback(new Error(body.results));
		} else {
			callback(new Error("Unknown error"));
		}
	});
};