(function($){
	$(document).ready(function () {
		var apikey = "pmfme7vyrj959yytdxka732m",
			$sportSelect = $("#sportSelect"),
			$leagueSelect = $("#leagueSelect"),
			$datepicker = $("#datepicker"),
			$gameSelect = $("#gameSelect"),
			$teamSelect = $("#teamSelect"),
			$embedBox = $("#embedResult"),
			$button = $("#justForShowButton"),
			$playerSelect = $("#playerSelect");

		function getGames() {
			$button.button("loading");
			var sportUrl = $sportSelect.children(":selected").attr("data-api-url"),
				leagueAbbrev = $leagueSelect.children(":selected").attr("data-league-abbreviation"),
				teamId = $teamSelect.children(":selected").val();
			var date = $datepicker.val();
			if(sportUrl != "" && sportUrl != undefined && leagueAbbrev != "" && leagueAbbrev != undefined) {
				if(teamId != 0 && teamId != undefined) {
					url = sportUrl + "/" + leagueAbbrev + "/teams/" + teamId + '/events';
				} else {
					url = sportUrl + "/" + leagueAbbrev + '/events'
				}
				if(date != "" && date != undefined) {
					splitDate = date.split("/");
					if(splitDate.length == 3) {
						url += "?dates=" + splitDate[2] + splitDate[0] + splitDate[1];
					} else {
						url += "?dates=" + date;
					}
				} else {
					url += "?dates=" + (new Date()).getFullYear();
				}
				$.ajax({
					type: "GET",
					url: url,
					data: {apikey: apikey},
					dataType: "json",
					success: function(data) {
						var gameSelectString = '<option value="0">Select a Game</option>\n';
						if(data.sports != undefined) {
							$.each(data.sports, function(i, sport) {
								if(sport.leagues != undefined) {
									$.each(sport.leagues, function(j, league) {
										if(league.events != undefined) {
											$.each(league.events, function(k, leagueEvent) {
												if(leagueEvent.competitions != undefined) {
													$.each(leagueEvent.competitions, function(l, competition) {
														gameSelectString += '<option value="' + competition.id + '">';
														if(competition.competitors != undefined) {
															score = "";
															competitor = competition.competitors[0];
															if(competitor.team != undefined) {
																if(competitor.team.location != competitor.team.name) {
																	gameSelectString += competitor.team.location + " " + competitor.team.name;
																} else {
																	gameSelectString += competitor.team.name;
																}
															}
															if(competitor.homeAway == "home") {
																gameSelectString += " vs ";
															} else {
																gameSelectString = " @ "
															}
															if(competitor.score != undefined) {
																score = competitor.score;
															}
															competitor = competition.competitors[1];
															if(competitor.team != undefined) {
																if(competitor.team.location != competitor.team.name) {
																	gameSelectString += competitor.team.location + " " + competitor.team.name;
																} else {
																	gameSelectString += competitor.team.name;
																}
															}
															if(competitor.score != undefined) {
																gameSelectString += " (" + score + "-" + competitor.score + ")";
															}
														}
														if(competition.date != undefined) {
															competitionDate = new Date(competition.date);
															gameSelectString += " " + (competitionDate.getMonth() + 1) + "/" + competitionDate.getDate() + "/" + competitionDate.getFullYear();
														}
														gameSelectString += "</option>";
													});
												}
											});
										}
									});
								}
							});
						}
						$gameSelect.html(gameSelectString);
						$button.button("reset");
					}
				});
			}
		}

		function getPlayers() {
			var sportUrl = $sportSelect.children(":selected").attr("data-api-url"),
				leagueAbbrev = $leagueSelect.children(":selected").attr("data-league-abbreviation"),
				teamId = $teamSelect.children(":selected").val();
			$.ajax({
				type: "GET",
				url: sportUrl + "/" + leagueAbbrev + "/athletes/teams/" + teamId,
				data: {apikey: apikey},
				dataType: "json",
				success: function(data) {
					playerSelectString = '<option value="0">Select a Player</option>\n'
					if(data.sports != undefined) {
						$.each(data.sports, function(i, sport) {
							if(sport.leagues != undefined) {
								$.each(sport.leagues, function(j, league) {
									if(league.athletes != undefined) {
										$.each(league.athletes, function(k, athlete) {
											playerSelectString += '<option value="' + athlete.id + '">' + athlete.displayName + '</option>';
										});
									}
								});
							}
						});
					}
					$playerSelect.html(playerSelectString);
				}
			});
		}

		function populateTeams(sportUrl, league) {
			$.ajax({
				type: "GET",
				url: sportUrl + "/" + league + "/teams",
				data: {apikey: apikey},
				dataType: "json",
				success: function(data) {
					var teamSelectString = '<option value="0">Select a Team</option>\n';
					if(data.sports != undefined) {
						$.each(data.sports, function(i, sport) {
							if(sport.leagues != undefined) {
								$.each(sport.leagues, function(j, league) {
									if(league.teams != undefined) {
										$.each(league.teams, function(k, team) {
											if(team.location != team.name) {
												teamSelectString += '<option value="' + team.id + '">' + team.location + " " + team.name +'</option>';
											} else {
												teamSelectString += '<option value="' + team.id + '">' + team.name +'</option>';
											}
										});
									}
								});
							}
						});
					}
					$teamSelect.html(teamSelectString);
				}
			});
		}

		function populateSports() {
			$.ajax({
				type: "GET",
				url: 'http://api.espn.com/v1/sports/',
				data: {apikey: apikey},
				dataType: "json",
				success: function(data) {
					var sportSelectString = "",
						leagueSelectString = "",
						leagueAbbrev = null,
						firstSportUrl = null;
					if(data.sports != undefined) {
						$.each(data.sports, function(i, sport) {
							if(i == 0) {
								selected = 'selected="selected"';
								if(sport.leagues != undefined) {
									$.each(sport.leagues, function(j, league) {
										if(j == 0) {
											leagueselected = ' selected="selected"';
										} else {
											leagueselected = "";
										}
										leagueUrl = "";
										if(league.abbreviation != undefined) {
											leagueUrl = 'data-league-abbreviation= "' + league.abbreviation + '"';
											if(j == 0) {
												leagueAbbrev = league.abbreviation;
											}
										}
										leagueSelectString += '<option value="' + league.id + '"' + leagueUrl + leagueselected + '>' + league.name + '</option>\n';
									});
								}
							} else {
								selected = "";
							}

							sportUrl = "";
							if(sport.links != undefined) {
								if(sport.links.api != undefined) {
									if(sport.links.api.sports != undefined) {
										if(sport.links.api.sports.href != undefined) {
											sportUrl = ' data-api-url="' + sport.links.api.sports.href + '"';
											if(i==0) {
												firstSportUrl = sport.links.api.sports.href;
											}
										}
									}
								}
							}
							sportSelectString += '<option value="' + sport.id + '"' + sportUrl + selected + '>' + sport.name.toUpperCase() + '</option>\n';
						});
					}
					$sportSelect.html(sportSelectString);
					$leagueSelect.html(leagueSelectString);
					if(firstSportUrl != null && leagueAbbrev != null) {
						populateTeams(firstSportUrl, leagueAbbrev);
					}
					getGames();
				}
			});
		}

		$sportSelect.on("change", function(e) {
			e.preventDefault();
			var sportUrl = $(this).children(":selected").attr("data-api-url");

			$.ajax({
				type: "GET",
				url: sportUrl,
				data: {apikey: apikey},
				dataType: "json",
				success: function(data) {
					var leagueSelectString = "";
					if(data.sports != undefined) {
						$.each(data.sports, function(index, sport) {
							if(sport.leagues != undefined) {
								$.each(sport.leagues, function(j, league) {
									leagueUrl = "";
									if(league.abbreviation != undefined) {
										leagueUrl = 'data-league-abbreviation= "' + league.abbreviation + '"';
									}
									if(j == 0) {
										leagueselected = ' selected="selected"';
										populateTeams(sportUrl, league.abbreviation)
									} else { 
										leagueselected = ""; 
									}
									leagueSelectString += '<option value="' + league.id + '"' + leagueUrl + leagueselected + '>' + league.name + '</option>\n';
								});
							}
						});
					}
					$leagueSelect.html(leagueSelectString);
					getGames();
				}
			});
		});

		$leagueSelect.on("change", function(e) {
			e.preventDefault();
			var sportUrl = $sportSelect.children(":selected").attr("data-api-url");
			var leagueAbbrev = $leagueSelect.children(":selected").attr("data-league-abbreviation");
			populateTeams(sportUrl, leagueAbbrev);
			getGames();
		});

		$teamSelect.on("change", function(e) {
			e.preventDefault();
			getGames();
			getPlayers();
		});

		$datepicker.on("change", function(e) {
			e.preventDefault();
			getGames();
		});

		$gameSelect.on("change", function(e) {
			e.preventDefault();
			sport = $sportSelect.children(":selected").text().toLowerCase();
			league = $leagueSelect.children(":selected").attr("data-league-abbreviation");
			gameId = $gameSelect.children(":selected").val();
			$embedBox.val('<div data-sport="' + sport + '" data-league="' + league + '" data-event="' + gameId + '"></div>');
		});

		$playerSelect.on("change", function(e) {
			e.preventDefault();
			sport = $sportSelect.children(":selected").text().toLowerCase();
			league = $leagueSelect.children(":selected").attr("data-league-abbreviation");
			playerId = $playerSelect.children(":selected").val();
			$embedBox.val('<div data-sport="' + sport + '" data-league="' + league + '" data-player="' + playerId + '"></div>');
		});

		$button.on("click", function(e) {
			e.preventDefault();
			if($gameSelect.val() != 0) {
				$gameSelect.change();
			} else if($playerSelect.val() != 0) {
				$playerSelect.change();
			} else if($teamSelect.val() != 0) {
				getPlayers();
			} else {
				getGames();
			}
		});

		populateSports();
		$datepicker.datepicker();

	});
})(jQuery);