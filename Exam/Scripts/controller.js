/// <reference path="class.js" />
/// <reference path="persister.js" />
/// <reference path="jquery-2.0.2.js" />
/// <reference path="ui.js" />

var controllers = (function () {
    var rootUrl = "http://localhost:22954/api/";
	var Controller = Class.create({
		init: function () {
			this.persister = persisters.get(rootUrl);
		},
		loadUI: function (selector) {
			if (this.persister.isUserLoggedIn()) {
				this.loadGameUI(selector);
			}
			else {
				this.loadLoginFormUI(selector);
			}
			this.attachUIEventHandlers(selector);
		},
		loadLoginFormUI: function (selector) {
			var loginFormHtml = ui.loginForm()
			$(selector).html(loginFormHtml);
		},
		loadGameUI: function (selector) {
		    var userNickname = this.persister.nickname();
			var list =
				ui.gameUI(userNickname);
			$(selector).html(list);

			this.persister.messages.all(function (allMessages) {
			    var table = ui.allMessagesList(allMessages);
			    $(selector + " #all-messages")
					.html(table);
			});

			this.persister.messages.unread(function (unreadMessages) {
			    var table = ui.unreadMessagesList(unreadMessages);
			    $(selector + " #unread-messages")
					.html(table);
			});

			this.persister.user.scores(function (scores) {
			    var table = ui.scoresTable(scores);
			    $(selector + " #scores")
					.html(table);
			});

			this.persister.game.open(function (games) {
				var list = ui.openGamesList(games);
				$(selector + " #open-games")
					.html(list);
			});

			this.persister.game.myActive(function (games) {
			    var list = ui.activeGamesList(games, userNickname);
				$(selector + " #active-games")
					.html(list);
			});
		},
		loadGame: function (selector, gameId) {
		    var userNickname = this.persister.nickname();
			this.persister.game.field(gameId, function (gameState) {
				var gameHtml = ui.gameState(gameState, userNickname);
				$(selector + " #game-holder").html(gameHtml)
			});
		},
		attachUIEventHandlers: function (selector) {
			var wrapper = $(selector);
			var self = this;

			wrapper.on("click", "#btn-show-login", function () {
				wrapper.find(".button.selected").removeClass("selected");
				$(this).addClass("selected");
				wrapper.find("#login-form").show();
				wrapper.find("#register-form").hide();
			});
			wrapper.on("click", "#btn-show-register", function () {
				wrapper.find(".button.selected").removeClass("selected");
				$(this).addClass("selected");
				wrapper.find("#register-form").show();
				wrapper.find("#login-form").hide();
			});
			wrapper.on("click", "#btn-show-all", function () {
			    wrapper.find("#all-messages li").show();
			});
			wrapper.on("click", "#btn-hide-all", function () {
			    wrapper.find("#all-messages li").hide();
			});
			wrapper.on("click", "#btn-show-unread", function () {
			    wrapper.find("#unread-messages li").show();
			});
			wrapper.on("click", "#btn-hide-unread", function () {
			    wrapper.find("#unread-messages li").hide();
			});

			wrapper.on("click", "#btn-login", function () {
				var user = {
					username: $(selector + " #tb-login-username").val(),
					password: $(selector + " #tb-login-password").val()
				}

				self.persister.user.login(user, function () {
					self.loadGameUI(selector);
				}, function (error) {
				    //debugger;
				    if (error.responseJSON.errCode != "ERR_GEN_SVR" && error.responseJSON.errCode != "INV_USR_AUTH") {
				        wrapper.html(error.responseJSON.Message);
				    }
				});
				return false;
			});
			wrapper.on("click", "#btn-register", function () {
			    //debugger;
			    var user = {
			        username: $(selector + " #tb-register-username").val(),
			        nickname: $(selector + " #tb-register-nickname").val(),
			        password: $(selector + " #tb-register-password").val()
			    }
			    self.persister.user.register(user, function () {
			        //debugger;
			        self.loadGameUI(selector);
			    }, function (error) {
			        //debugger;
			        if (error.responseJSON.errCode != "ERR_GEN_SVR" && error.responseJSON.errCode != "INV_USR_AUTH") {
			            wrapper.html(error.responseJSON.Message);
			        }
			    });
			    return false;
			});
			wrapper.on("click", "#btn-logout", function () {
				self.persister.user.logout(function () {
					self.loadLoginFormUI(selector);
				});
			});

			wrapper.on("click", "#open-games-container a", function () {
				$("#game-join-inputs").remove();
				var html =
					'<div id="game-join-inputs">' +
						'<button id="btn-join-game">join</button>' +
					'</div>';
				$(this).after(html);
			});
			wrapper.on("click", "#btn-join-game", function () {
				var game = {
					id: $(this).parents("li").first().data("game-id")
				};

				self.persister.game.join(game);
			});
			wrapper.on("click", "#btn-create-game", function () {
				var game = {
					title: $("#tb-create-title").val()
				}

				self.persister.game.create(game);
			});
			wrapper.on("click", "#btn-start-game", function () {
			    var gameId = $(this).parents("li").first().data("game-id");

			    self.persister.game.start(gameId, function () { });
			});

			wrapper.on("click", "#btn-make-guess", function () {
			    var guess = {
			        gameId: $("#game-state").data("game-id"),
			        number: $("#tb-guess-number").val(),
			    }
			    self.persister.guess.make(guess);
			});

			wrapper.on("click", ".active-games .in-progress", function () {
				self.loadGame(selector, $(this).parent().data("game-id"));
			});
		}
	});
	return {
		get: function () {
			return new Controller();
		}
	}
}());

$(function () {
	var controller = controllers.get();
	controller.loadUI("#content");
});