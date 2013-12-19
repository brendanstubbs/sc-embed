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
                    $scoreObj.iRefreshSpeed     = 30000;
                    $scoreObj.oSports           = {'football':'Football','soccer':'Soccer'};
                    $scoreObj.oImageCodeMap     = {'college-football':'ncaa'};

                    $scoreObj.sCurrPlayer = 1;

                    // Read in all the params for the object
                    var sCurrSportTmp       = $scoreObj.attr('data-sport');
                    var sCurrLeagueTmp      = $scoreObj.attr('data-league');
                    var sCurrEventTmp       = $scoreObj.attr('data-event');
                    var sCurrEventPlayer    = $scoreObj.attr('data-player');

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

                    buildWidgetContainer($scoreObj);

                    $scoreObj.on('click','.scembed-links', function(e){
                        e.stopPropagation();
                    })

                    $scoreObj.on("click", ".scembed-container", function(e) {
                        e.stopPropagation();
                        showMatchData($scoreObj,$(this));
                        //return false;
                    });

            		$scoreObj.on('click', '.scembed-player-container', function (e) {
            			e.stopPropagation();
            			$(this).find('.scembed-player').toggleClass('flipped');
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
                        buildPlayerCard($scoreObj);
                    }else{
                        getData($scoreObj);
                    }

                });
            },

            destroy: function() {
                return this.each(function(){
                    $(window).unbind('.scorecenter');
                });
            },

            buildWidgetContainer: function(iColNo){

            },

            formatForType: function(itm) {

            }
        }

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

        function buildLargeContainer($oWidget){

            var sMatchList = "";
        	sMatchList += '<div class="scembed-container">';
        		sMatchList += '<div class="scembed-games-list-container">';
        			sMatchList += '<div class="scembed-header">';
        				sMatchList += '<div class="scembed-sc-header-logo">';
        					sMatchList += '<div class="sc-logo"></div>';
        				sMatchList += '</div>';
        				sMatchList += '<div class="scembed-header-title">NFL Schedule</div>';
        				sMatchList += '<div class="scembed-games-list">';

        				sMatchList += '</div>';
        			sMatchList += '</div>';
        		sMatchList += '</div>';
        	sMatchList += '</div>';

            //buildSportSelector($oWidget);
            //newDiv = $('<div />').addClass('scembed-container');
            //newDiv.appendTo();
            $oWidget.html(sMatchList)
        }

        function buildGameRow(oSettings,oEvent,oHome,oAway,oLinks){

             var sRow ="";
             var sKey = oSettings.sCurrSport+oSettings.sCurrLeague+oEvent.evtid;
             var sExtraClass = "";
             if(typeof oSettings.oFlipped[sKey] !== "undefined"){
                 sExtraClass = " flipped";
             }

             sRow +='<div class="scembed-container"><div class="scembed-game'+sExtraClass+'" id="'+oEvent.evtid+'">';
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
        								sRow +='<td class="scembed-scoretable-away-score">'+oAway.score+'</td>';
        							sRow +='</tr>';
        							sRow +='<tr>';
        								sRow +='<td class="scembed-scoretable-home-logo">';
        									sRow +='<img class="scembed-scoretable-home-logo-img" src="'+oHome.imageUrl+'" alt="" />';
        								sRow +='</td>';
        								sRow +='<td class="scembed-scoretable-home-abbrev">'+oHome.team['name']+'</td>';
        								sRow +='<td class="scembed-scoretable-home-info"></td>';
        								sRow +='<td class="scembed-scoretable-home-score">'+oHome.score+'</td>';
        							sRow +='</tr>';
        						sRow +='</tbody>';
        					sRow +='</table>';
        					sRow +='<div class="scembed-gamestatus">';
        						sRow +='<div class="scembed-gamestatus-line1">'+oEvent.broadcasts+'</div>';
        						sRow +='<div class="scembed-gamestatus-line2">'+oEvent.date+'</div>';
        						sRow +='<div class="scembed-gamestatus-line3">'+oEvent.time+'</div>';
        					sRow +='</div>';
        					sRow +='<div class="scembed-sc-logo"></div>';
        				sRow +='</div>';
        			sRow +='</div>';

        			sRow += buildCardBack(oSettings,oEvent,oHome,oAway,oLinks);

        			sRow +='</div>';
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

        function buildCardBack($oWidget,oEvent,oHome,oAway,oLinks){

            if($oWidget.sCurrEvent != ""){
                /* Single Event so build the flip card */
                return buildCardBackSmall($oWidget,oEvent,oHome,oAway,oLinks)
            }else{
                if($oWidget.sCurrSport === "football"){
                    return buildFootballCardBacklarge($oWidget,oEvent,oHome,oAway);
                }else{
                    return buildSoccerCardBacklarge($oWidget,oEvent,oHome,oAway)
                }
            }
        }

        function buildCardBackSmall(oSettings,oEvent,oHome,oAway,oLinks){
            var sRow = "";

   		    sRow +='<div class="scembed-back">';
   				sRow +='<div class="scembed-line-score">';

				if(oSettings.sCurrSport === "football"){
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
                }

   				sRow +='</div>';
                

                if (!!oLinks) {
                    sRow +='<div class="scembed-links">';
                    if (!!oLinks.web.recap) {
                        sRow +='<a class="scembed-link-recap" href="' + oLinks.web.recap.href + '">Recap</a>';
                    }
                    if (!!oLinks.web.boxscore) {
                        sRow +='<a class="scembed-link-stats" href="' + oLinks.web.boxscore.href + '">Stats</a>';
                    } else if (!!oLinks.web.liveUpdate) {
                        sRow +='<a class="scembed-link-stats" href="' + oLinks.web.liveUpdate.href + '">Stats</a>';
                    }
                    sRow +='</div>';

                    var shareUrl;
                    if (!!oLinks.web.recap) {
                        shareUrl = oLinks.web.recap.href;
                    } else if (!!oLinks.web.liveUpdate) {
                        shareUrl = oLinks.web.liveUpdate.href;
                    }
                    shareUrl = shareUrl.replace(/\/ncf\//,'/ncf/users/bmurray/');
                    shareUrl = shareUrl.replace(/\/nfl\//,'/nfl/users/bmurray/');
                    shareUrl.replace(/\/nfl\//,'/nfl/users/bmurray/');

                    var date = new Date(),
                        dateString = '' + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
                        
                    shareUrl += '&date=' + dateString;
                    sRow +='<div class="scembed-link-share" data-date="' + dateString + '" data-sport="' + oSettings.sCurrSport + '" data-league="' + oSettings.sCurrLeague + '" data-event="' + oEvent.evtid +'" data-href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl)+ '"></div>';
                }

   			sRow +='</div>';

   			return sRow;
        }

        function buildCardbackLarge($oWidget,oEvent,oHome,oAway,oLinks){
            var sScoccerHTML = "";

            sScoccerHTML += '<div class="scembed-container">';
            	sScoccerHTML += '<div class="scembed-games-list-container">';
            		sScoccerHTML += '<div class="scembed-header">';
            			sScoccerHTML += '<div class="scembed-sc-header-back">';
            				sScoccerHTML += '<img src="back.png"></img>';
            				sScoccerHTML += '<div class="scembed-back-text">Back</div>';
            			sScoccerHTML += '</div>';
            		sScoccerHTML += '</div>';
            			sScoccerHTML += '<div class="scembed-game-big scembed-football"> <!-- scembed-football/scembed-soccer THIS CLASS CONTROLS FOOTBALL OR SOCCER DISPLAY PROP -->';
            				sScoccerHTML += '<div class="scembed-game-big-teams">';
            					sScoccerHTML += '<div class="scembed-game-big-away-team-name scembed-game-big-team-name">SEAHAWKS</div>';
            					sScoccerHTML += '<div class="scembed-game-big-home-team-name scembed-game-big-team-name">GIANTS</div>';
            				sScoccerHTML += '</div>';
            				sScoccerHTML += '<div class="scembed-game-big-score">';
            					sScoccerHTML += '<table>';
            						sScoccerHTML += '<tr>';
            							sScoccerHTML += '<td class="scembed-game-big-team-logo scembed-game-big-away-team-logo">';
            								sScoccerHTML += '<img src="seahawks.png">';
            							sScoccerHTML += '</td>';
            							sScoccerHTML += '<td class="scembed-game-big-team-score scembed-game-big-away-team-score">23</td>';
            							sScoccerHTML += '<td class="scembed-game-big-game-status">Final</td>';
            							sScoccerHTML += '<td class="scembed-game-big-team-score scembed-game-big-home-team-score">0</td>';
            							sScoccerHTML += '<td class="scembed-game-big-team-logo scembed-game-big-home-team-logo">';
            								sScoccerHTML += '<img src="giants.png">';
            							sScoccerHTML += '</td>';
            						sScoccerHTML += '</tr>';
            					sScoccerHTML += '</table>';
            				sScoccerHTML += '</div>';

            				/* DETAIL IN HERE */
                             if (!!oLinks) {
                                sScoccerHTML += '<div class="scembed-recap-stats-container">';
                                sScoccerHTML += '<div class="scembed-bottom-btn scembed-recap-btn"><a href="' + oLinks.web.recap.href + '">Recap</a></div>';
                                sScoccerHTML += '<div class="scembed-bottom-btn scembed-stats-btn"><a href="' + oLinks.web.boxscore.href + '">Stats</a></div>';
                                sScoccerHTML += '</div>';
                            }

            			sScoccerHTML += '</div>';
            		sScoccerHTML += '</div>';
            	sScoccerHTML += '</div>';
            sScoccerHTML += '</div>';

            return sScoccerHTML;
        }

        function buildSoccerCardBacklarge(oSettings,oEvent,oHome,oAway){
            return "";

            var sScoccerHTML = "";

			sScoccerHTML += '<div class="scembed-soccer-details">';
				sScoccerHTML += '<div class="scembed-match-stats-header">Match Stats </div>';
				sScoccerHTML += '<table class="scembed-match-stats-table">';
					sScoccerHTML += '<thead>';
						sScoccerHTML += '<tr>';
							sScoccerHTML += '<th class="scembed-match-stats-row scembed-stat-title"></th>';
							sScoccerHTML += '<th class="scembed-match-stats-row scembed-stat-home-val">STE</th>';
							sScoccerHTML += '<th class="scembed-match-stats-row scembed-stat-away-val">CHL</th>';
						sScoccerHTML += '</tr>';
					sScoccerHTML += '</thead>';
					sScoccerHTML += '<tbody class="scembed-match-stats-tbody">';
						sScoccerHTML += '<tr class="scembed-match-stats-row">';
							sScoccerHTML += '<td class="scembed-stat-title">Shots</td>';
							sScoccerHTML += '<td class="scembed-stat-home-val">18</td>';
							sScoccerHTML += '<td class="scembed-stat-away-val">18</td>';
						sScoccerHTML += '</tr>';
						sScoccerHTML += '<tr class="scembed-match-stats-row">';
							sScoccerHTML += '<td class="scembed-stat-title">Fouls</td>';
							sScoccerHTML += '<td class="scembed-stat-home-val">10</td>';
							sScoccerHTML += '<td class="scembed-stat-away-val">10</td>';
						sScoccerHTML += '</tr>';
						sScoccerHTML += '<tr class="scembed-match-stats-row">';
							sScoccerHTML += '<td class="scembed-stat-title">Corner Kicks</td>';
							sScoccerHTML += '<td class="scembed-stat-home-val">2</td>';
							sScoccerHTML += '<td class="scembed-stat-away-val">3</td>';
						sScoccerHTML += '</tr>';
						sScoccerHTML += '<tr class="scembed-match-stats-row">';
							sScoccerHTML += '<td class="scembed-stat-title">Offsides</td>';
							sScoccerHTML += '<td class="scembed-stat-home-val">1</td>';
							sScoccerHTML += '<td class="scembed-stat-away-val">0</td>';
						sScoccerHTML += '</tr>';
						sScoccerHTML += '<tr class="scembed-match-stats-row">';
							sScoccerHTML += '<td class="scembed-stat-title">Time of Possession</td>';
							sScoccerHTML += '<td class="scembed-stat-home-val">49%</td>';
							sScoccerHTML += '<td class="scembed-stat-away-val">51%</td>';
						sScoccerHTML += '</tr>';
					sScoccerHTML += '</tbody>';
				sScoccerHTML += '</table>';
			sScoccerHTML += '</div> <!-- END SOCCER DETAILS -->';




        }

        function buildFootballCardBacklarge(oSettings,oEvent,oHome,oAway){
            return "";
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

            var sExtraUrl = "",
                sExtraUrl2 = "";

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
                            var oComps = oEvents[iEvent].competitions,
                                oLinks = oEvents[iEvent].links;
                            oComps.sort(sortEventsID);
                            for (var iComp=0; iComp<oComps.length; iComp++){
                                var oCompetitors = oComps[iComp].competitors;

                                var sText = "",
                                     oHome = {},
                                     oAway = {},
                                     oEvent = {};

                                var aProc = dateTimeFormat(oComps[iComp].date);
                                oEvent.date = aProc[0];
                                oEvent.time = aProc[1];
                                oEvent.evtid = oComps[iComp]['id'];

                                if(oComps[iComp].status.detail === "Final"){
                                    oEvent.time = "Final";
                                }else if(oComps[iComp].status.detail.match(/^((?!\:).)*$/)){
                                    oEvent.time = oComps[iComp].status.detail;
                                }

                                if(typeof oComps[iComp].broadcasts[0] === "undefined"){
                                    oEvent.broadcasts = "-";
                                }else{
                                    oEvent.broadcasts = oComps[iComp].broadcasts[0].name;
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
                                sNewHTML += buildGameRow($scoreObj,oEvent,oHome,oAway,oLinks);
                                //$Container.append(sText);

                                
                                /*if (!!oLinks) {
                                    if (!!oLinks.api.news.href) {
                                        $.ajax({
                                            type: 'GET',
                                            url: oLinks.api.news.href,
                                            dataType: 'jsonp',
                                            cache: true,
                                            data: {apikey: apiKey},
                                            success: function (data) {
                                                if (!!data) {
                                                    if (!!data.headlines && !!data.headlines.length > 0) {
                                                        $('.scembed-container>div>div').append('<div>'+data.headlines[0].headline + '</div>')
                                                    }   
                                                }
                                            }
                                        });
                                    }
                                 }*/
                                 

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

        var soccer_competitordetails = function(competitor){
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

            /*if (!!data.notes && data.notes.length > 0) {
                output += data.notes[0].description;
            }*/

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
    				$('.scembed-container>div>div',$oWidget).append('<div class="scembed-back">' + jsonp.gamelog + '</div>');
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
