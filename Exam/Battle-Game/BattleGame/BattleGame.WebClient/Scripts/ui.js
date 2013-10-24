var ui = (function () {

	function buildLoginForm() {
		var html =
            '<div id="login-form-holder">' +
				'<form>' +
					'<div id="login-form">' +
						'<label for="tb-login-username">Username: </label>' +
						'<input type="text" id="tb-login-username"><br />' +
						'<label for="tb-login-password">Password: </label>' +
						'<input type="password" id="tb-login-password"><br />' +
						'<button id="btn-login" class="button">Login</button>' +
					'</div>' +
					'<div id="register-form" style="display: none">' +
						'<label for="tb-register-username">Username: </label>' +
						'<input type="text" id="tb-register-username"><br />' +
						'<label for="tb-register-nickname">Nickname: </label>' +
						'<input type="text" id="tb-register-nickname"><br />' +
						'<label for="tb-register-password">Password: </label>' +
						'<input type="password" id="tb-register-password"><br />' +
						'<button id="btn-register" class="button">Register</button>' +
					'</div>' +
					'<a href="#" id="btn-show-login" class="button selected">Login</a>' +
					'<a href="#" id="btn-show-register" class="button">Register</a>' +
				'</form>' +
            '</div>';
		return html;
	}

	function buildGameUI(nickname) {
		var html = '<span id="user-nickname">' +
				nickname +
		'</span>' +
		'<button id="btn-logout">Logout</button><br/>' +
		'<div id="create-game-holder">' +
			'Title: <input type="text" id="tb-create-title" />' +
			'<button id="btn-create-game">Create</button>' +
		'</div>' +
        '<div id="messages-container">' +
			'<h2>Messages</h2>' +
			'<div id="all-messages"></div>' +
            '<div id="unread-messages"></div>' +
		'</div>' +
        '<div id="scores-container">' +
			'<h2>High Scores</h2>' +
			'<div id="scores"></div>' +
		'</div>' +
		'<div id="open-games-container">' +
			'<h2>Open</h2>' +
			'<div id="open-games"></div>' +
		'</div>' +
		'<div id="active-games-container">' +
			'<h2>Active</h2>' +
			'<div id="active-games"></div>' +
		'</div>' +
		'<div id="game-holder">' +
		'</div>';
		return html;
	}

	function buildAllMessagesList(messages) {
	    var list = '<ul class="messages-list all"><button id="btn-show-all">Show</button><button id="btn-hide-all">Hide</button>';
	    for (var i = 0; i < messages.length; i++) {
	        var message = messages[i];
	        list +=
				'<li>' +
						$("<div />").html(message.text).text() +
					'<span> - ' +
						message.state +
					'</span>' +
				'</li>';
	    }
	    list += "</ul>";
	    return list;
	}

	function buildUnreadMessagesList(messages) {
	    var list = '<ul class="messages-list unread"><button id="btn-show-unread">Show</button><button id="btn-hide-unread">Hide</button>';
	    for (var i = 0; i < messages.length; i++) {
	        var message = messages[i];
	        list +=
				'<li>' +
						$("<div />").html(message.text).text() +
				'</li>';
	    }
	    list += "</ul>";
	    return list;
	}

	function buildOpenGamesList(games) {
		var list = '<ul class="game-list open-games">';
		for (var i = 0; i < games.length; i++) {
			var game = games[i];
			list +=
				'<li data-game-id="' + game.id + '">' +
					'<a href="#" >' +
						$("<div />").html(game.title).text() +
					'</a>' +
					'<span> by ' +
						game.creator +
					'</span>' +
				'</li>';
		}
		list += "</ul>";
		return list;
	}

	function buildActiveGamesList(games, nickname) {
		var gamesList = Array.prototype.slice.call(games, 0);
		gamesList.sort(function (g1, g2) {
			if (g1.status == g2.status) {
				return g1.title > g2.title;
			}
			else
			{
				if (g1.status == "in-progress") {
					return -1;
				}
			}
			return 1;
		});

		var list = '<ul class="game-list active-games">';
		for (var i = 0; i < gamesList.length; i++) {
			var game = gamesList[i];
			list +=
				'<li data-game-id="' + game.id + '">' +
					'<a href="#" class="' + game.status + '">' +
						$("<div />").html(game.title).text() +
					'</a>' +
					'<span> by ' +
						game.creator +
					'</span>';
			if (game.status == "full" && game.creator == nickname) {
			    list +=
                    '<button id="btn-start-game">Start</button><br/>' +
				'</li>';
			}
			else {
			    list += '</li>';
			}
		}
		list += "</ul>";
		return list;
	}

	function buildScoresTable(scores) {
	    var scoresList = Array.prototype.slice.call(scores, 0);
	    scoresList.sort(function (s1, s2) {
	        if (s1.score == s2.score) {
	            return s1.nickname > s2.nickname;
	        }
	        else {
	            return s1.score < s2.score;
	        }
	        return 1;
	    });

	    var tableHtml =
			'<table border="1" cellspacing="0" cellpadding="5">' +
				'<tr>' +
					'<th>Player</th>' +
					'<th>Scores</th>'
				'</tr>';
			for (var i = 0; i < scoresList.length; i++) {
			    var score = scoresList[i];
	            tableHtml +=
				    '<tr>' +
					    '<td>' +
						    score.nickname +
					    '</td>' +
					    '<td>' +
						    score.score +
					    '</td>' +
				    '</tr>';
	        }
	    tableHtml += '</table>';
	    return tableHtml;
	}

	function buildBattleField(gameState, nickname, strategyHtml) {
	    //debugger;
	    var tableHtml = "";
	    if (gameState[gameState.inTurn].nickname == nickname) {
	        tableHtml += strategyHtml;
	    }

	    var redWarriors = [];
	    var redRangers = [];
	    for (var i = 0; i < gameState.red.units.length; i++) {
	        if (gameState.red.units[i].type == "warrior") {
	            redWarriors.push(gameState.red.units[i].position.x + "" + gameState.red.units[i].position.y);
	        }
	        else if (gameState.red.units[i].type == "ranger") {
	            redRangers.push(gameState.red.units[i].position.x + "" + gameState.red.units[i].position.y);
	        }
	    }

	    var blueWarriors = [];
	    var blueRangers = [];
	    for (var i = 0; i < gameState.blue.units.length; i++) {
	        if (gameState.blue.units[i].type == "warrior") {
	            blueWarriors.push(gameState.blue.units[i].position.x + "" + gameState.blue.units[i].position.y);
	        }
	        else if (gameState.blue.units[i].type == "ranger") {
	            blueRangers.push(gameState.blue.units[i].position.x + "" + gameState.blue.units[i].position.y);
	        }
	    }

		tableHtml +=
			'<table border="1" cellspacing="0" cellpadding="5">';
		for (var row = 0; row < 9; row++) {
		    tableHtml += '<tr>';
		    for (var column = 0; column < 9; column++) {
		        var position = column + "" + row;
		        var text = "";
		        if (redWarriors.indexOf(position) >= 0) {
		            text = "redWarriors";
		        }
		        else if (redRangers.indexOf(position) >= 0) {
		            text = "redRangers";
		        }
		        else if (blueWarriors.indexOf(position) >= 0) {
		            text = "blueWarriors";
		        }
		        else if (blueRangers.indexOf(position) >= 0) {
		            text = "blueRangers";
		        }

		        tableHtml +=
                        '<td>' +
                            text +
                        '</td>';
		    }
		    tableHtml += '</tr>';
		    //debugger;
		}

		tableHtml += '</table>';

		return tableHtml;
	}

	function buildGameState(gameState, nickname) {
	    //debugger;
	    $("#strategy-inputs").remove();
	    var strategyHtml =
            '<div id="strategy-inputs">' +
                'X: <input type="text" id="tb-x-number"/>' +
                'Y: <input type="text" id="tb-y-number"/>' +
                '<button id="btn-move-battle">Move</button>' +
                '<button id="btn-attack-battle">Attack</button>' +
                '<button id="btn-defend-battle">Defend</button>' +
            '</div>';
		var html =
			'<div id="game-state" data-game-id="' + gameState.gameId + '">' +
				'<h2>' + gameState.title + '</h2>' +
				'<div id="blue-guesses" class="guess-holder">' +
					'<h3>' +
						'Turn ' + gameState.turn + 'th - in turn ' + gameState[gameState.inTurn].nickname +
					'</h3>'+
					buildBattleField(gameState, nickname, strategyHtml) +
				'</div>' +
		    '</div>';

		return html;
	}

	return {
		gameUI: buildGameUI,
		openGamesList: buildOpenGamesList,
		loginForm: buildLoginForm,
		activeGamesList: buildActiveGamesList,
		gameState: buildGameState,
		scoresTable: buildScoresTable,
		allMessagesList: buildAllMessagesList,
		unreadMessagesList: buildUnreadMessagesList
	}

}());