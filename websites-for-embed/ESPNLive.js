/* ESPN Object version 0.1.0 by ben */

var ESPNLive = ESPNLive || {};

(function(window, document, version, callback) {
    var j, d;
    var loaded = false;
    if (!(j = window.jQuery) || version > j.fn.jquery || callback(j, loaded)) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "jquery-1.10.2.min.js";
        script.onload = script.onreadystatechange = function() {
            if (!loaded && (!(d = this.readyState) || d == "loaded" || d == "complete")) {
                callback((j = window.jQuery).noConflict(1), loaded = true);
                j(script).remove();
            }
        };
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script);
    }
})(window, document, "10", function($, jquery_loaded) {

    $.fn.reverse = [].reverse;

    function insertCSS(){
        $('head').append('<link rel="stylesheet" href="sc-embed.css" type="text/css" />').append('<link rel="stylesheet" href="http://a.espncdn.com/combiner/c?css=fonts/bentonsans.css,fonts/bentonsansbold.css,fonts/bentonsanslight.css,fonts/bentonsansmedium.css"type="text/css"media="screen" charset="utf-8">');
    }

    var ESPNLivesetup = function(){

        function changeSport(sSport){
            sCurrSport  =   sSport;
            sCurrLeague =   "";
            sCurrEvent  =   "";
            getData();
        }

    };

    (function($){

       var oTimeOut = 0;

       var methods = {
            init: function(options) {

                return this.each(function(){

                    var $scoreObj = $(this);

                    $scoreObj.espnTimeOut       = {};
                    $scoreObj.oFlipped          = {};
                    $scoreObj.sBaseUrl          = "http://api-app.espn.com/v1/sports";
                    $scoreObj.iRefreshSpeed     = 2000000;
                    $scoreObj.oSports           = {'football':'Football','soccer':'Soccer'};
                    $scoreObj.oImageCodeMap     = {'college-football':'ncaa'};

                    // Read in all the params for the object
                    var sCurrSportTmp       = $scoreObj.attr('data-sport');
                    var sCurrLeagueTmp      = $scoreObj.attr('data-league');
                    var sCurrEventTmp       = $scoreObj.attr('data-event');
                    var sCurrEventPlayer    = $scoreObj.attr('data-player');
                    var sCurrSizeTmp        = $scoreObj.attr('data-size');

                    if(typeof sCurrSportTmp !== "undefined"){
                        $scoreObj.sCurrSport = sCurrSportTmp;
                    }else{
                        $scoreObj.sCurrSport = "football";
                    }

                    if(typeof sCurrLeagueTmp !== "undefined"){
                        $scoreObj.sCurrLeague = sCurrLeagueTmp;
                    }else{
                        $scoreObj.sCurrLeague = "";
                    }

                    if(typeof sCurrEventTmp !== "undefined"){
                        $scoreObj.sCurrEvent = sCurrEventTmp;
                    }else{
                        $scoreObj.sCurrEvent = "";
                    }

                    if(typeof sCurrEventPlayer !== "undefined"){
                        $scoreObj.sCurrPlayer = sCurrEventPlayer;
                    }else{
                        $scoreObj.sCurrPlayer = "";
                    }

                    if(sCurrSizeTmp !== "large"){
                        $scoreObj.sCurrSize = "small";
                    }else{
                        $scoreObj.sCurrSize = "large";
                    }


                    buildWidgetContainer($scoreObj);

                    $scoreObj.on('click','.scembed-links', function(e){
                        e.stopPropagation();
                    });

                    $scoreObj.on('click', '.scembed-link-share', function (e) {
                      console.log('linkclick')
                      e.stopPropagation();
                      var fbLink = $(this).attr('data-href'),
                          dateString = $(this).attr('data-date'),
                          imageEmbedPath = '/espn/espn/format/playerEmbed?sport=' + $(this).attr('data-sport') + '&league=' + $(this).attr('data-league') + '&event=' + $(this).attr('data-event');
                          $(this).after('<img style="display:none;" src="http://sports-mast.espn.go.com/combiner/i?url=' + encodeURIComponent(imageEmbedPath) + '&store=%2Fwww_espn%2Fsteve%2Fsteve.' + $(this).attr('data-event') + '.' + dateString +  '.jpg&espn=classic&pageWidth=300&pageHeight=100" onload="javascript:openFBLink(\'' + fbLink + '\');">');
                  })


                    if($scoreObj.sCurrPlayer != ""){

                        $scoreObj.on('click', function (e) {
                        	$(this).find('.scembed-player').toggleClass('flipped');
                        	return false;
                        });

                        buildPlayerCard($scoreObj);

                    }else{

                        if($scoreObj.sCurrEvent != ""){
                            $scoreObj.on("click", function(e) {
                                showMatchData($scoreObj,$(this));
                                return false;
                            });

                        }else{
                            $scoreObj.on("click", ".scembed-sc-header-back", function(e) {
                                 showMatchData($scoreObj,$(this));
                                 return false;
                            });

                            $scoreObj.on("click",".scembed-game", function(e) {
                                showMatchData($scoreObj,$(this));
                                return false;
                            });

                        }

                        getData($scoreObj);
                    }

                });
            },

            destroy: function() {
                return this.each(function(){
                    $(window).unbind('.scorecenter');
                });
            }
        }

        var pathToSport = {
            'football':{'nfl':'nfl','college-football':'ncf'},
            'baseball':{'mlb':'mlb'},
            'basketball':{'nba':'nba','mens-college-basketball':'ncb'},
            'hockey':{'nhl':'nhl'},
            'soccer':{'eng.1':'epl','eng.2':'div 1'}
        };

        function buildSportSelector($oWidget){

            var oSports     = $oWidget.oSports;

            var s = $('<select />').change(function(){
                changeSport($(this).val());
            });

            for(var val in oSports) {
                $('<option />', {value: val, text: oSports[val]}).appendTo(s);
            }

            s.appendTo($oWidget);
        }

        function buildWidgetContainer($oWidget){

            if($oWidget.sCurrEvent != "" || $oWidget.sCurrPlayer != ""){
                return buildSmallContainer($oWidget);
            }else{
                return buildLargeContainer($oWidget);
            }
        }

        function buildSmallContainer($oWidget){
            newDiv = $('<div />').addClass('scembed-container');
            newDiv.appendTo($oWidget);
        }

        fadeTransition = function($oWidget) {
    		$('.scembed-lateral-transition-controller',$oWidget).toggleClass('shiftRight');
    	}

        function buildLargeContainer($oWidget){

            var sMatchList = "";

            sMatchList += '<div class="scembed-lateral-transition-container">';
            		sMatchList += '<div class="scembed-lateral-transition-controller">';


        	sMatchList += '<div class="scembed-container left">';
        		sMatchList += '<div class="scembed-games-list-container scembed-games-front-container">';
        			sMatchList += '<div class="scembed-header">';
        				sMatchList += '<div class="scembed-sc-header-logo">';
        					sMatchList += '<div class="sc-logo"></div>';
        				sMatchList += '</div>';

        				var sSport = pathToSport[$oWidget.sCurrSport][$oWidget.sCurrLeague].toUpperCase();

        				sMatchList += '<div class="scembed-header-title">'+sSport+'</div>';
        				sMatchList += '<div class="scembed-games-list">';
        				sMatchList += '</div>';
        			sMatchList += '</div>';
        		sMatchList += '</div>';
        	sMatchList += '</div>';
        	sMatchList += '<div class="scembed-container right">';
        		sMatchList += '<div class="scembed-games-back-container"></div>';
        	sMatchList += '</div></div></div>';

            //buildSportSelector($oWidget);
            //newDiv = $('<div />').addClass('scembed-container');
            //newDiv.appendTo();
            $oWidget.html(sMatchList)
        }

        function buildGameRow(oSettings,oEvent,oHome,oAway){

             var sRow ="";
             var sKey = oSettings.sCurrSport+oSettings.sCurrLeague+oEvent.evtid;
             var sExtraClass = "";
             if(typeof oSettings.oFlipped[sKey] !== "undefined"){
                 sExtraClass = " flipped";
             }

             if(oSettings.sCurrSize === "large"){
                sExtraClass += "  scembed-game-large";
             }

             if(oEvent.count === 1){
                sExtraClass+= " first";
             }

             var sHomeScore = oHome.score,
                sAwayScore = oAway.score;

             if(oEvent.status === 1){
                sHomeScore = oHome.team.record.summary;
                sAwayScore = oAway.team.record.summary;
             }

             sRow +='<div class="scembed-game'+sExtraClass+'" id="'+oEvent.evtid+'">';
        			sRow +='<div class="scembed-front">';
        				sRow +='<div class="scembed-shadow"></div>';
        				sRow +='<div class="scembed-game-summary">';
        					sRow +='<table class="scembed-scoretable" cellpadding="0" cellspacing="2">';
        						sRow +='<tbody class="scembed-scoretable-tbody">';
        							sRow +='<tr class="scembed-scoretable-row">';
        								sRow +='<td class="scembed-scoretable-awaylogo">';
        									sRow +='<img class="scembed-scoretable-away-logo-img" src="'+oAway.imageUrl+'" alt="" />';
        								sRow +='</td>';
        								sRow +='<td class="scembed-scoretable-away-abbrev">'+oAway.team['name']+'</td>';
        								sRow +='<td class="scembed-scoretable-away-info"></td>';
        								sRow +='<td class="scembed-scoretable-away-score">'+sAwayScore+'</td>';
        							sRow +='</tr>';
        							sRow +='<tr>';
        								sRow +='<td class="scembed-scoretable-home-logo">';
        									sRow +='<img class="scembed-scoretable-home-logo-img" src="'+oHome.imageUrl+'" alt="" />';
        								sRow +='</td>';
        								sRow +='<td class="scembed-scoretable-home-abbrev">'+oHome.team['name']+'</td>';
        								sRow +='<td class="scembed-scoretable-home-info"></td>';
        								sRow +='<td class="scembed-scoretable-home-score">'+sHomeScore+'</td>';
        							sRow +='</tr>';
        						sRow +='</tbody>';
        					sRow +='</table>';
        					sRow +='<div class="scembed-gamestatus">';
        						sRow +='<div class="scembed-gamestatus-line1">'+oEvent.broadcasts+'</div>';
        						sRow +='<div class="scembed-gamestatus-line2">'+oEvent.date+'</div>';
        						sRow +='<div class="scembed-gamestatus-line3">'+oEvent.time+'</div>';
        					sRow +='</div>';

        					sRow +='<div class="scembed-game-story">';
								sRow +='<a class="scembed-game-story-headline" href="www.com">Seahawks have five interceptions, manhandle Giants</a>';
							sRow +='</div>';

							if(oSettings.sCurrEvent != ""){
							    sRow +='<div class="scembed-sc-logo"></div>';
							}

        				sRow +='</div>';
        			sRow +='</div>';

        			sRow += buildCardBack(oSettings,oEvent,oHome,oAway);

        			sRow +='</div>';

        		return sRow;

         }

        function makeJSONrequest(sUrl,oSuccess,oFailure) {

            $.ajaxSetup({cache:false,timeout:10000});
            $.getJSON(sUrl,function(data){
                // Looks for the error message;
                if (data.error) {
                    if(typeof oFailure != 'undefined'){
                        oFailure();
                    }
                    return;
                }
                oSuccess(data);
            }).success(function(){

            }).error(function (xhr, ajaxOptions, thrownError) {
                if(typeof oFailure != 'undefined'){
                    oFailure();
                }
            }).complete(function(){

            });

        }

        function buildCardBack($oWidget,oEvent,oHome,oAway){

            if($oWidget.sCurrEvent != ""){
                /* Single Event so build the flip card */
                return buildCardBackSmall($oWidget,oEvent,oHome,oAway);
            }else{
                return buildCardbackLarge($oWidget,oEvent,oHome,oAway);
            }
        }

        function buildFootalllineScores(oHome,oAway){

            var sRow = "";

            if(typeof oHome.linescores === "undefined"){
                return '<table class="scembed-line-score-table"><tbody class="scembed-line-score-tbody"><tr class="scembed-line-score-row scembed-periods"><td>Team</td><td>0</td><td>2</td><td>3</td><td>4</td><td>OT</td><td>T</td></tr><tr class="scembed-line-score-row scembed-away-team-line-score"><td class="scembed-line-score-team-abbrev">'+oAway.team.abbreviation+'</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr><tr class="scembed-line-score-row scembed-away-team-line-score"><td class="scembed-line-score-team-abbrev">'+oHome.team.abbreviation+'</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr></tbody></table>';
            }

            sRow +='<table class="scembed-line-score-table">';
            sRow +='<tbody class="scembed-line-score-tbody">';

            sRow += '<tr class="scembed-line-score-row scembed-periods"><td>Team</td>';
            if(oHome.linescores != null){
                for(var x=0;x<=(oHome.linescores.length-1);x++){
                    sRow += "<td>" + oHome.linescores[x].label + "</td>";
                }
            }
            sRow += "<td>T</td></tr>";

            sRow += "<tr class='scembed-line-score-row scembed-away-team-line-score'>";
            sRow += "<td class='scembed-line-score-team-abbrev'>"+oAway.team.abbreviation + "</td>";
            $.each(oAway.linescores, function(key,scores){
                sRow += "<td>" + scores.score + "</td>";
            });
            sRow += "<td>" + oAway.score + "</td>";
            sRow +="</tr>";

            sRow += "<tr class='scembed-line-score-row scembed-away-team-line-score'>";
            sRow += "<td class='scembed-line-score-team-abbrev'>"+oHome.team.abbreviation + "</td>";
            $.each(oHome.linescores, function(key,scores){
                sRow += "<td>" + scores.score + "</td>";
            });
            sRow += "<td>" + oHome.score + "</td>";
            sRow +="</tr>";

            sRow +='</tbody>';
            sRow +='</table>';

            return sRow;
        }

        function buildCardBackSmall(oSettings,oEvent,oHome,oAway){

   		    var sRow = "";

   		    sRow +='<div class="scembed-back">';
   				sRow +='<div class="scembed-line-score">';

				if(oSettings.sCurrSport === "football"){
       			    sRow +=buildFootalllineScores(oHome,oAway);
                }

   				sRow +='</div>';

				if (!!oEvent.links) {
                    sRow +='<div class="scembed-links">';
                    if (!!oEvent.links.recap) {
                        sRow +='<a class="scembed-link-recap" href="' + oEvent.links.recap.href + '" target="_newwin">Recap</a>';
                    }
                    if (!!oEvent.links.boxscore) {
                        sRow +='<a class="scembed-link-stats" href="' + oEvent.links.boxscore.href + '" target="_newwin">Stats</a>';
                    } else if (!!oEvent.links.liveUpdate) {
                        sRow +='<a class="scembed-link-stats" href="' + oEvent.links.liveUpdate.href + '" target="_newwin">Stats</a>';
                    }
                    sRow +='</div>';

                    var shareUrl;
                    if (!!oEvent.links.recap) {
                        shareUrl = oEvent.links.recap.href;
                    } else if (!!oLinks.web.liveUpdate) {
                        shareUrl = oEvent.links.liveUpdate.href;
                    }
                    shareUrl = shareUrl.replace(/\/ncf\//,'/ncf/users/bmurray/');
                    shareUrl = shareUrl.replace(/\/nfl\//,'/nfl/users/bmurray/');
                    shareUrl.replace(/\/nfl\//,'/nfl/users/bmurray/');

                    var date = new Date(),
                        dateString = '' + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();

                    shareUrl += '&date=' + dateString;
                    sRow +='<div class="scembed-link-share" data-date="' + dateString + '" data-sport="' + oSettings.sCurrSport + '" data-league="' + oSettings.sCurrLeague + '" data-event="' + oEvent.evtid +'" data-href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl)+ '"></div>';


                }

   				//sRow +='<div class="scembed-link-share"></div>';

   			sRow +='</div>';

   			return sRow;
        }

        function buildCardbackLarge($oWidget,oEvent,oHome,oAway){
            var sScoccerHTML = "";

            sScoccerHTML += '<div class="scembed-container" id="scembed-cb-'+oEvent.evtid+'" style="display:none;">';
            	sScoccerHTML += '<div class="scembed-games-list-container">';
            		sScoccerHTML += '<div class="scembed-header">';
            			sScoccerHTML += '<div class="scembed-sc-header-back">';
            				sScoccerHTML += '<img src="back.png"></img>';
            				sScoccerHTML += '<div class="scembed-back-text">Back</div>';
            			sScoccerHTML += '</div>';
            		sScoccerHTML += '</div>';
            			sScoccerHTML += '<div class="scembed-game-big scembed-football"> <!-- scembed-football/scembed-soccer THIS CLASS CONTROLS FOOTBALL OR SOCCER DISPLAY PROP -->';
            				sScoccerHTML += '<div class="scembed-game-big-teams">';
            					var sTextColor = "#fff";
            					if(!oAway.team['color'] || oAway.team['color'] === "#fff"){
            					    sTextColor = "#000";
								}
            					sScoccerHTML += '<div class="scembed-game-big-away-team-name scembed-game-big-team-name" style="background:#'+oAway.team['color']+';color:'+sTextColor+'">'+oAway.team['name']+'</div>';
            					sTextColor = "#fff";
            					if(!oHome.team['color'] || oHome.team['color'] === "#fff"){
            					    sTextColor = "#000";
								}
            					sScoccerHTML += '<div class="scembed-game-big-home-team-name scembed-game-big-team-name" style="background:#'+oHome.team['color']+';color:'+sTextColor+'">'+oHome.team['name']+'</div>';
            				sScoccerHTML += '</div>';
            				sScoccerHTML += '<div class="scembed-game-big-score">';
            					sScoccerHTML += '<table>';
            						sScoccerHTML += '<tr>';
            							sScoccerHTML += '<td class="scembed-game-big-team-logo scembed-game-big-away-team-logo">';
            								sScoccerHTML += '<img src="'+oAway.imageUrl+'">';
            							sScoccerHTML += '</td>';
            							sScoccerHTML += '<td class="scembed-game-big-team-score scembed-game-big-away-team-score">'+oAway.score+'</td>';
            							sScoccerHTML += '<td class="scembed-game-big-game-status">'+oEvent.time+'</td>';
            							sScoccerHTML += '<td class="scembed-game-big-team-score scembed-game-big-home-team-score">'+oHome.score+'</td>';
            							sScoccerHTML += '<td class="scembed-game-big-team-logo scembed-game-big-home-team-logo">';
            								sScoccerHTML += '<img src="'+oHome.imageUrl+'">';
            							sScoccerHTML += '</td>';
            						sScoccerHTML += '</tr>';
            					sScoccerHTML += '</table>';
            				sScoccerHTML += '</div>';


            				/* DETAIL IN HERE */
            				if($oWidget.sCurrSport === "football"){
                                sScoccerHTML += buildFootballCardBacklarge($oWidget,oEvent,oHome,oAway);
                            }else{
                                sScoccerHTML += buildSoccerCardBacklarge($oWidget,oEvent,oHome,oAway)
                            }

            				/* DETAIL IN HERE */
                             if (!!oEvent.links) {
                                sScoccerHTML += '<div class="scembed-recap-stats-container">';
                                if (!!oEvent.links.recap) {
                                    sScoccerHTML += '<a class="scembed-bottom-btn scembed-recap-btn" href="' + oEvent.links.recap.href + '" target="_newwin">Recap</a>';
                                }else{
                                    sScoccerHTML += '<a class="scembed-bottom-btn scembed-recap-btn" href="#">Recap</a>';
                                }
                                if (!!oEvent.links.boxscore) {
                                    sScoccerHTML += '<a class="scembed-bottom-btn scembed-stats-btn" href="' + oEvent.links.boxscore.href + '" target="_newwin">Stats</a>';
                                }else{
                                    sScoccerHTML += '<a class="scembed-bottom-btn scembed-stats-btn" href="#">Stats</a>';
                                }
                                sScoccerHTML += '</div>';
                            }

            			sScoccerHTML += '</div>';
            		sScoccerHTML += '</div>';
            	sScoccerHTML += '</div>';
            sScoccerHTML += '</div>';
            return sScoccerHTML;
        }

        function rebuildPlayerStat($oWidget,$iCompId){
             nfl_top_performers($iCompId,function(oData){
                console.log(oData);
                var sFootballHTML = "";
                sFootballHTML += '<div class="scembed-top-peformers-title">Top Performers</div>';
                sFootballHTML += '<div class="scembed-performer">Passing: R. Wilson (SEA) - 206 YDS, 1 TD, 1 INT</div>';
                sFootballHTML += '<div class="scembed-performer">Rushing: R. Wilson (SEA) - 8 CAR, 50 YDS</div>';
                sFootballHTML += '<div class="scembed-performer">Receiving: M. Lynch (SEA) - 6 REC, 73 YDS</div>';

                $('.scembed-top-performers',$oWidget).html(sFootballHTML);
             });
        }

        function rebuildSoccerCard($oWidget,$iCompId){
            soccer_getcompetitordetails($iCompId,function(oData){

                oAwayData = oData['away'];
                oHomeData = oData['home'];
                var sScoccerHTML = "";

    			sScoccerHTML += '<tr class="scembed-match-stats-row">';
    				sScoccerHTML += '<td class="scembed-stat-title">Shots</td>';
    				sScoccerHTML += '<td class="scembed-stat-home-val">'+oAwayData.totalshots+'</td>';
    				sScoccerHTML += '<td class="scembed-stat-away-val">'+oHomeData.totalshots+'</td>';
    			sScoccerHTML += '</tr>';
    			sScoccerHTML += '<tr class="scembed-match-stats-row">';
    				sScoccerHTML += '<td class="scembed-stat-title">Shots on Goal</td>';
    				sScoccerHTML += '<td class="scembed-stat-home-val">'+oAwayData.shotsongoal+'</td>';
    				sScoccerHTML += '<td class="scembed-stat-away-val">'+oHomeData.shotsongoal+'</td>';
    			sScoccerHTML += '</tr>';
    			sScoccerHTML += '<tr class="scembed-match-stats-row">';
    				sScoccerHTML += '<td class="scembed-stat-title">Red Cards</td>';
    				sScoccerHTML += '<td class="scembed-stat-home-val">'+oAwayData.redcards+'</td>';
    				sScoccerHTML += '<td class="scembed-stat-away-val">'+oHomeData.redcards+'</td>';
    			sScoccerHTML += '</tr>';
    			sScoccerHTML += '<tr class="scembed-match-stats-row">';
    				sScoccerHTML += '<td class="scembed-stat-title">Yellow Cards</td>';
    				sScoccerHTML += '<td class="scembed-stat-home-val">'+oAwayData.yellowcards+'</td>';
    				sScoccerHTML += '<td class="scembed-stat-away-val">'+oHomeData.yellowcards+'</td>';
    			sScoccerHTML += '</tr>';
    			sScoccerHTML += '<tr class="scembed-match-stats-row">';
    				sScoccerHTML += '<td class="scembed-stat-title">Goals</td>';
    				sScoccerHTML += '<td class="scembed-stat-home-val">'+oAwayData.goals+'</td>';
    				sScoccerHTML += '<td class="scembed-stat-away-val">'+oHomeData.goals+'</td>';
    			sScoccerHTML += '</tr>';


                $('.scembed-match-stats-table tbody',$oWidget).html(sScoccerHTML);

            });
        }

        function buildSoccerCardBacklarge(oSettings,oEvent,oHome,oAway){

            var sScoccerHTML = "";
            oHomeData = soccer_competitordetails(oHome);
            oAwayData = soccer_competitordetails(oAway);

			sScoccerHTML += '<div class="scembed-soccer-details">';
				sScoccerHTML += '<div class="scembed-match-stats-header">Match Stats </div>';
				sScoccerHTML += '<table class="scembed-match-stats-table">';
					sScoccerHTML += '<thead>';
						sScoccerHTML += '<tr>';
							sScoccerHTML += '<th class="scembed-match-stats-row scembed-stat-title"></th>';
							sScoccerHTML += '<th class="scembed-match-stats-row scembed-stat-home-val">'+oAway.team.abbreviation+'</th>';
							sScoccerHTML += '<th class="scembed-match-stats-row scembed-stat-away-val">'+oHome.team.abbreviation+'</th>';
						sScoccerHTML += '</tr>';
					sScoccerHTML += '</thead>';
					sScoccerHTML += '<tbody class="scembed-match-stats-tbody">';
						sScoccerHTML += '<tr class="scembed-match-stats-row">';
							sScoccerHTML += '<td class="scembed-stat-title">Shots</td>';
							sScoccerHTML += '<td class="scembed-stat-home-val">'+oAwayData.totalShots+'</td>';
							sScoccerHTML += '<td class="scembed-stat-away-val">'+oHomeData.totalShots+'</td>';
						sScoccerHTML += '</tr>';
						sScoccerHTML += '<tr class="scembed-match-stats-row">';
							sScoccerHTML += '<td class="scembed-stat-title">Shots on Goal</td>';
							sScoccerHTML += '<td class="scembed-stat-home-val">'+oAwayData.shotsOnGoal+'</td>';
							sScoccerHTML += '<td class="scembed-stat-away-val">'+oHomeData.shotsOnGoal+'</td>';
						sScoccerHTML += '</tr>';
						sScoccerHTML += '<tr class="scembed-match-stats-row">';
							sScoccerHTML += '<td class="scembed-stat-title">Red Cards</td>';
							sScoccerHTML += '<td class="scembed-stat-home-val">'+oAwayData.redCards+'</td>';
							sScoccerHTML += '<td class="scembed-stat-away-val">'+oHomeData.redCards+'</td>';
						sScoccerHTML += '</tr>';
						sScoccerHTML += '<tr class="scembed-match-stats-row">';
							sScoccerHTML += '<td class="scembed-stat-title">Yellow Cards</td>';
							sScoccerHTML += '<td class="scembed-stat-home-val">'+oAwayData.yellowCards+'</td>';
							sScoccerHTML += '<td class="scembed-stat-away-val">'+oHomeData.yellowCards+'</td>';
						sScoccerHTML += '</tr>';
						sScoccerHTML += '<tr class="scembed-match-stats-row">';
							sScoccerHTML += '<td class="scembed-stat-title">Goals</td>';
							sScoccerHTML += '<td class="scembed-stat-home-val">'+oAway.score+'</td>';
							sScoccerHTML += '<td class="scembed-stat-away-val">'+oHome.score+'</td>';
						sScoccerHTML += '</tr>';
					sScoccerHTML += '</tbody>';
				sScoccerHTML += '</table>';
			sScoccerHTML += '</div> <!-- END SOCCER DETAILS -->';

			return sScoccerHTML;

        }

        function buildFootballCardBacklarge(oSettings,oEvent,oHome,oAway){

            var sFootballHTML = "";
            sFootballHTML += '<div class="scembed-nfl-details">';
            	sFootballHTML += '<div class="scembed-game-big-line-score">';
            		sFootballHTML += '<div class="scembed-game-big-line-score-container">';

            		    sFootballHTML +=buildFootalllineScores(oHome,oAway);

            		sFootballHTML += '</div>';
            		sFootballHTML += '<div class="scembed-game-big-status">';
            			sFootballHTML += '<div class="scembed-game-big-date">'+oEvent.date+' '+oEvent.time+' PM ET</div>';
            			sFootballHTML += '<div class="scembed-game-big-location">'+oEvent.venue+'</div>';
            		sFootballHTML += '</div>';
            	sFootballHTML += '</div>';

            	sFootballHTML += '<div class="scembed-top-performers">';
            		sFootballHTML += '<div class="scembed-top-peformers-title">Top Performers</div>';
            		sFootballHTML += '<div class="scembed-performer">&nbsp;</div>';
            		sFootballHTML += '<div class="scembed-performer">&nbsp;</div>';
            		sFootballHTML += '<div class="scembed-performer">&nbsp;</div>';
            	sFootballHTML += '</div>';
            sFootballHTML += '</div> <!-- END NFL DETAILS -->';

            return sFootballHTML;
        }

        function buildPlayerCard($oWidget,oPlayer){
            loadPlayerData($oWidget,'nfl',$oWidget.sCurrPlayer);
        }

        function sortEventsID(a,b) {
          if (a['id'] < b['id'])
             return -1;
          if (a['id'] > b['id'])
            return 1;
          return 0;
        }

        function dateTimeFormat(sDate){
            /* split out date like this 2013-09-04T07:00:00Z and return 17/22 3:30 */
            if(typeof sDate === "undefined"){return;}
            var aDateTime = sDate.split("T");

            var aDate = aDateTime[0].split('-');
            sDate = parseInt(aDate[1])+"/"+parseInt(aDate[2]);

            var aTime = aDateTime[1].split(':');
            var sTime = parseInt(aTime[0])+":"+pad(parseInt(aTime[1]),2);

            return [sDate,sTime];

        }

        function pad(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }

        function showMatchData($scoreObj,$oTarget){

            if($scoreObj.sCurrEvent != ""){
                toggleFlip($scoreObj,$oTarget);
                return;
            }else{
                var myId = "scembed-cb-"+$oTarget.attr('id');
                if(typeof myId === "undefined" || $('#'+myId).length >= 1){
                    $('.scembed-games-back-container',$scoreObj).html($('#'+myId).html());
                    if($scoreObj.sCurrSport === "soccer"){
                        rebuildSoccerCard($scoreObj,$oTarget.attr('id'));
                    }else if($scoreObj.sCurrSport === "football"){
                        rebuildPlayerStat($scoreObj,$oTarget.attr('id'));
                    }
                }

                fadeTransition($scoreObj);
            }

        }

        function toggleFlip($scoreObj,$el){
            var sKey = $scoreObj.sCurrSport+$scoreObj.sCurrLeague+$('.scembed-game',$el).attr('id');
            if($('.scembed-game',$el).hasClass('flipped')){
                $('.scembed-game',$el).removeClass('flipped');
                delete $scoreObj.oFlipped[sKey];
            }else{
                $('.scembed-game',$el).addClass('flipped');
                $scoreObj.oFlipped[sKey] = 1;
            }
        };

        function getTeamLogo(oSettings,sLeague,sTeam){

            var sUrl = "";

            if(oSettings.sCurrSport === 'soccer'){
                sUrl ="http://soccernet-assets.espn.go.com/design05/i/clubhouse/badges/25x25/"+sTeam+".gif";
            }else{
                if(typeof oSettings.oImageCodeMap[sLeague] === 'string'){
                    sLeague = oSettings.oImageCodeMap[sLeague];
                }

                sUrl ="http://a.espncdn.com/combiner/i?img=/i/teamlogos/"+sLeague+"/500/"+sTeam+".png?w=25&h=25&transparent=true";
            }
            return sUrl;
        }

        function getData($scoreObj){

            var sExtraUrl   = "",
                sExtraUrl2  = "",
                iCount      = 0;


            if($scoreObj.sCurrLeague){
                sExtraUrl = "/"+$scoreObj.sCurrLeague;
            }

            if($scoreObj.sCurrEvent){
                sExtraUrl2 = "/"+$scoreObj.sCurrEvent;
            }

            makeJSONrequest($scoreObj.sBaseUrl+'/'+$scoreObj.sCurrSport+sExtraUrl+'/events'+sExtraUrl2+'/?enable=logos,broadcasts,linescores',
            function(oData){

                var sNewHTML = "";
                var oSports = oData.sports;
                for (var i=0; i<oSports.length; i++){
                    var oLeagues = oSports[i].leagues;
                    for (var iLeague=0; iLeague<oLeagues.length; iLeague++){
                        var sLeagueCode = oLeagues[iLeague].abbreviation;
                        var oEvents = oLeagues[iLeague].events;
                        if(oEvents.length === 0){continue;}
                        //logMe(sLeagueCode);
                        for (var iEvent=0; iEvent<oEvents.length; iEvent++){
                            //logMe(oEvents[iEvent].date);
                            var oEvent = {};
                            var oComps = oEvents[iEvent].competitions;

                            if(typeof oEvents[iEvent]['venues'] !== "undefined"){
                                oEvent.venue = oEvents[iEvent]['venues'][0]['name']+', '+oEvents[iEvent]['venues'][0]['city']+', '+oEvents[iEvent]['venues'][0]['state'];
                            }else{
                                oEvent.venue = "";
                            }
                            oEvent.links = oEvents[iEvent]['links']['web']

                            oComps.sort(sortEventsID);
                            for (var iComp=0; iComp<oComps.length; iComp++){
                                var oCompetitors = oComps[iComp].competitors;

                                var sText = "",
                                     oHome = {},
                                     oAway = {};

                                var aProc = dateTimeFormat(oComps[iComp].date);
                                oEvent.date = aProc[0];
                                oEvent.time = aProc[1];
                                oEvent.evtid = oComps[iComp]['id'];
                                oEvent.status = oComps[iComp].status.id;

                                if(oComps[iComp].status.id == 2){
                                    oEvent.time = oComps[iComp].clock;
                                }else if(oComps[iComp].status.id > 2){
                                    oEvent.time = oComps[iComp].status.detail;
                                }

                                if(typeof oComps[iComp].broadcasts[0] === "undefined"){
                                    oEvent.broadcasts = "-";
                                }else{
                                    var aSplit = oComps[iComp].broadcasts[0].name.split(' ');
                                        aSplit = aSplit[0].split('-');
                                    oEvent.broadcasts = aSplit[0].toUpperCase();
                                }

                                for (var iCompetitor=0; iCompetitor<oCompetitors.length; iCompetitor++){

                                    oCompetitors[iCompetitor].imageUrl = getTeamLogo($scoreObj,sLeagueCode,oCompetitors[iCompetitor].team.id);

                                    if(oCompetitors[iCompetitor].homeAway === 'home'){
                                        oHome = oCompetitors[iCompetitor];
                                    }else{
                                        oAway = oCompetitors[iCompetitor];
                                    }
                                }

                                //sText = '<img src="'+oHome.imageUrl+'" />'+oHome.team['name']+' '+oHome.score+' vs '+oAway.score+' '+oAway.team['name']+'<img src="'+oAway.imageUrl+'" />';
                                iCount++;
                                oEvent.count = iCount;
                                sNewHTML += buildGameRow($scoreObj,oEvent,oHome,oAway);
                                //$Container.append(sText);

                                 if($scoreObj.sCurrEvent != ""){
                                     if (!!oEvents[iEvent]['links']) {
                                        if (!!oEvents[iEvent]['links'].api.news.href) {
                                            $.ajax({
                                                type: 'GET',
                                                url: oEvents[iEvent]['links'].api.news.href,
                                                dataType: 'jsonp',
                                                cache: true,
                                                data: {apikey: apiKey},
                                                success: function (data) {
                                                    if (!!data) {
                                                        if (!!data.headlines && !!data.headlines.length > 0) {
                                                            $('.scembed-game-story-headline',$scoreObj).html(data.headlines[0].headline);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                     }
                                 }

                            }
                        }
                    }
                }

                if($scoreObj.sCurrEvent){
                    $('.scembed-container',$scoreObj).html(sNewHTML);
                }else{
                    $('.scembed-games-list',$scoreObj).html(sNewHTML);
                }
            });

            /* Do it all again */
            if($scoreObj.iRefreshSpeed === undefined || !$scoreObj.iRefreshSpeed){
                $scoreObj.iRefreshSpeed = 60000;
            }
            clearTimeout($scoreObj.espnTimeOut);
            $scoreObj.espnTimeOut = setTimeout(function(){getData($scoreObj)},$scoreObj.iRefreshSpeed);
        }

        /* GEORGE */

        //top performers, stricly only NFL
        function nfl_top_performers(gameId, callback){
        	$.getJSON('http://sports-uat.espn.go.com/nfl/users/bmurray/topPerformers?callback=?&gameId=' + gameId, function( result ) {
        		callback(result);
        	});
        }

        function soccer_competitordetails(competitor){
        	if(typeof competitor.team.athletes === "undefined"){
        	    return {'redCards' : 0, 'yellowCards' : 0, 'totalShots' : 0, 'shotsOnGoal' : 0 };
			}
        	var redcards = 0;
        	var yellowcards = 0;
        	var shotsongoal = 0;
        	var totalshots = 0;
        	$.each(competitor.team.athletes, function(key,athlete){
        		redcards += athlete.redCards;
        		yellowcards += athlete.yellowCards;
        		totalshots += athlete.totalShots;
        		shotsongoal += athlete.shotsOnTarget;
        	});
        	return {'redCards' : redcards, 'yellowCards' : yellowcards, 'totalShots' : totalshots, 'shotsOnGoal' : shotsongoal };
        }

        function soccer_getcompetitordetails(competitionId,callback){
        	var soccer_compdetails = {};
        	$.getJSON('http://api.espn.com/v1/sports/soccer/events/' + competitionId + "?apikey=g3esy55uphsvhxe9sj8xvagk", function( result ) {
        		$.each(result.sports, function(key,sports){
        			$.each(sports.leagues, function(key,leagues){
        				$.each(leagues.events,function(key,events){
        					$.each(events.competitions,function(key,competitions){
        						$.each(competitions.competitors, function(key, competitor){
        							var redcards = 0;
        							var yellowcards = 0;
        							var shotsongoal = 0;
        							var totalshots = 0;
        							var totalgoals = 0;
        							$.each(competitor.team.athletes, function(key,athlete){
        								redcards += athlete.redCards;
        								yellowcards += athlete.yellowCards;
        								totalshots += athlete.totalShots;
        								shotsongoal += athlete.shotsOnTarget;
        								totalgoals += athlete.totalGoals;
        							});

        							soccer_compdetails[competitor.homeAway] = {'redcards' : redcards, 'yellowcards' : yellowcards, 'shotsongoal' : shotsongoal, 'totalshots' : totalshots, 'goals' : totalgoals};
        						});
        					});
        				});
        			});
        		});
        		callback(soccer_compdetails);
          	});
        }


        /* STEVE CLANCY CODE START */

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


    	function loadPlayerData($oWidget,sport, id) {
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
    			data: {'enable': 'statistics,notes,logos', 'apikey': apiKey},
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
    											displayPlayerData($oWidget,athlete, sport);
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



    	function displayPlayerData ($oWidget,data, sport) {

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

    		output += '<div class="scembed-player-container">';

    		var sExtraClass = "",
    		    sDimensions = "&h=100&w=130";
    		if($oWidget.sCurrSize === "large"){
    		   sExtraClass = "  scembed-player-large";
    		   sDimensions = "&h=150&w=195";
    		}

    		output += '<div class="scembed-player'+sExtraClass+'">'
    		output += '<div class="scembed-front">';
    		output += '<div class="scembed-shadow"></div>'
    		if (!!data.team.color) {
    			output += '<div style="background-color: #' + data.team.color + '" class="scembed-player-topline"></div>'
    		}
    		if (!!data.headshots) {
    			var aImage = data.headshots.gamecast.href.split('&')
    		    output += '<div style="background-image:url(' + aImage[0] +sDimensions+ ')" class="scembed-player-mug"></div>';
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


    		var sNote = "";

        	if (!!data.notes && data.notes.length > 0) {
        	    sNote = data.notes[0].description.substr(0,80)+"...";
        	}


    		output += '<div class="scembed-player-story">';
    			output += '<a class="scembed-player-story-headline" href="www.espn.com">'+sNote+'</a>';
    		output += '</div><div class="scembed-sc-logo"></div>';


    		output += '</div>'
    		output += '</div>'
    		output += '</div>'

    		$('.scembed-container',$oWidget).html(output);


    		playerId = data.id;
    		$.ajax({
    			type: 'GET',
    			url: 'http://test.espn.go.com/nfl/format/gameLogAPI',
    			dataType: 'jsonp',
    			cache: true,
    			data: {'id': playerId},
    			success: function (jsonp) {
    				$('.scembed-container>div>div',$oWidget).append('<div class="scembed-back">' +
    				(!!data.team.color ? '<div style="background-color: #' + data.team.color + '" class="scembed-player-topline"></div>' : '') +
    				jsonp.gamelog +
    				'<div class="scembed-playercard-links"><a href="http://www.espn.com">Complete Player Card</a></div>' +
    				'</div>');
    			}
    		});
    	}

        /* STEVE CLANCY CODE END */

        $.fn.scorecenter = function( method ) {

            if ( methods[method] ) {
                return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply( this, arguments );
            } else {
                $.error( 'Method ' +  method + ' does not exist on score center' );
            }
        };

    })($);

    $(document).ready(function($){
        insertCSS();
        $('.scembed').scorecenter();
    });

});

function openFBLink(link) {
    window.open(link, '_blank', 'width=550,height=420,scrollbars=no,resizable=yes');
}
