(function ($) {


	var apiSource = 'http://api.espn.com',
		apiKey = 'jxpnqsc9rx8ah9v7884bn5fn',
		sportsToPath = {
			'nfl': 'football/nfl',
			'ncf': 'football/college-football',
			'mlb': 'baseball/mlb',
			'nba': 'basketball/nba',
			'ncb': 'basketball/mens-college-basketball',
			'nhl': 'hockey/nhl',
			'epl': 'soccer/eng.1'
		},
		positionIdToStatType = {
			1: 'receiving',
			7: 'receiving',
			8: 'passing',
			9: 'rushing',
			10: 'rushing',
			23: 'kicking',
			31: 'defense',
			32: 'defense',
			12: 'defense',
			37: 'defense',
			30: 'defense',
			29: 'defense',
			35: 'defense',
			36: 'defense',
			48: 'defense',
			12: 'defense',
			20: 'defense',
			21: 'defense',
			27: 'defense',
			75: 'defense'
		},
		positionIdToStatColumns = {
			1: ['receptions','receivingYards','yardsPerReception','receivingTouchdowns','longReception'],
			7: ['receptions','receivingYards','yardsPerReception','receivingTouchdowns','longReception'],
			8: ['completionPercentage','passingYards','yardsPerPassAttempt','passingTouchdowns','interceptions'],
			9: ['rushingAttempts','rushingYards','yardsPerRushAttempt','rushingTouchdowns','longRushing'],
			10: ['rushingAttempts','rushingYards','yardsPerRushAttempt','rushingTouchdowns','longRushing'],	
			23: ['punts','puntYards','longPunt','grossAvgPuntYards','netAvgPuntYards'],
			22: ['fieldGoalsMade','fieldGoalAttempts','fieldGoalPct','longFieldGoalMade'],
			31: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			32: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			12: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			37: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			30: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			29: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			35: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			36: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			48: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			12: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			20: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			21: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			27: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced'],
			75: ['totalTackles','sacks','interceptions','passesDefended','fumblesForced']
		}

	
	function loadPlayerData(sport, id) {
		var path = sport,
			sports,
			apiSport,
			leagues,
			league,
			athletes,
			athlete,
			url;
		if (!!sportsToPath[sport]) {
			path = sportsToPath[sport];
		}
		url = apiSource + '/v1/sports/' + path + '/athletes/' + id;

		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			cache: true,
			data: {'enable': 'statistics,logos', 'apikey': apiKey},
			success: function (jsonp) {	
				if (!!jsonp) {
					sports = jsonp.sports;
					if (!!sports && sports.length > 0) {
						apiSport = sports[0];
						if (!!apiSport) {
							leagues = apiSport.leagues;
							if (!!leagues && leagues.length > 0) {
								league = leagues[0];
								if (!!league) {
									athletes = league.athletes;
									if (!!athletes && athletes.length > 0) {
										athlete = athletes[0];
										if (!!athlete) {
											displayPlayerData(athlete, sport);
										}
									}
								}
							}
						}
					}
				}
				
			},
			error: function() {
				console.log('fail');
			}
		});
	}

	function displayPlayerData (data, sport) {

		var positionObj,
			pos,
			statistics = data.statistics[0],
			statCategories = statistics.statCategories,
			statColumns,
			statType,
			stats,
			colhead,
			stathead,
			output = '';

		if (!!data.positions) {
			positionObj = data.positions[0];
			pos = positionObj.id;
			statColumns = positionIdToStatColumns[pos];
			statType = positionIdToStatType[pos];
		}

		output += '<div class="scembed-player-container">'
		output += '<div class="scembed-player">'
		output += '<div class="scembed-front">';
		output += '<div class="scembed-shadow"></div>'
		if (!!data.team.color) {
			output += '<div style="background-color: #' + data.team.color + '" class="scembed-player-topline"></div>'
		}
		if (!!data.headshots) {
			output += '<div style="background-image:url(' + data.headshots.gamecast.href + ')" class="scembed-player-mug"></div>';
		}
		output += '<div class="scembed-player-info">'
		if (!!data.team.logos) {
			output += '<div style="background-image:url(' + data.team.logos.xsmall.href + ')" class="scembed-player-team-logo"></div>'
		}
		if (data.team.name != data.team.location) {
			output += '<div class="scembed-player-team-name">' + data.team.location + ' ' + data.team.name + '</div>';
		} else {
			output += '<div class="scembed-player-team-name">' + data.team.name + '</div>';
		}
		output += '<div class="scembed-player-name-container">';
		output += '<span class="scembed-player-name">' + data.fullName + '</span> ';
		output += '<span class="scembed-player-number">' + data.jersey + '</span> ';
		if (!!positionObj) {
			output += '<span class="scembed-player-position">' + positionObj.abbreviation + '</span> ';
		}
		output += '</div>'
		output += '</div>'
		/*/*if (!!data.headshots) {
			output += '<img alt="' + data.fullName + '" src="' + data.headshots.medium.href + '" height="' + data.headshots.medium.height + '" width="' + data.headshots.medium.width + '">';
		}
		output += '<h3>' + data.fullName + '</h3>';
		if (data.team.name != data.team.location) {
			output += '<p class="team"><a href="' + data.team.links.web.teams.href + '">' + data.team.location + ' ' + data.team.name + '</a></p>';
		} else {
			output += '<p class="team"><a href="' + data.team.links.web.teams.href + '">' + data.team.name + '</a></p>';
		}*/
		if (sport == 'epl') {
    		statType = statCategories[0].name;
    		statColumns = ['starts','gamesStarted','saves','goals','assists','shots'];
    	}
    		
    	if (!!statistics && !!statColumns) {
			output += '<table class="scembed-player-stat-summary">'
			//output += '<tr class="tablehead"><td>' + statistics.season.year + ' Stats</td></tr>';
        	colhead = '<tr class="scembed-player-stat-labels">';
        	stathead = '<tr class="scembed-player-stat-vals">';
        	$(statCategories).each(function (i, v) {
    			if (v.name == statType) {
    				stats = v.stats;
    				$(stats).each(function (i, v) {
    					if ($.inArray(v.name, statColumns) >= 0) {
							colhead += '<td class="scembed-stat-label scembed-stat' + i + '">' + v.abbreviation + '</td>';
							stathead += '<td class="scembed-stat-val scembed-stat' + i + '">' + v.value + '</td>';
						}
					});
    			}
    		});
    		
			colhead += '</tr>';
			stathead += '</tr>';
			
			output += colhead + stathead;
            output += '</table>'
		}
		output += '</div>'
		output += '</div>'
		output += '</div>'

		$('#insertHere').html(output);


		playerId = data.id;
		$.ajax({
			type: 'GET',
			url: 'http://test.espn.go.com/nfl/format/gameLogAPI',
			dataType: 'jsonp',
			cache: true,
			data: {'id': playerId},
			success: function (jsonp) {
				$('#insertHere>div>div').append('<div class="scembed-back">' + jsonp.gamelog + '</div>');	
			}
		});
	}

	

	$(document).ready(function () {
		loadPlayerData('nfl', 14877);
		$('#insertHere').on('click', '.scembed-player-container', function (e) {
			e.stopPropagation();
			$(this).find('.scembed-player').toggleClass('flipped');

		});
	})
})(jQuery)