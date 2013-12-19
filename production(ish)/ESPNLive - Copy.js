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

    var ESPNLivesetup = function(){

        var publicSymbols           = {},
            espnTimeOut             = {},
            $sGlobalDiv             = {},
            oFlipped                = {},
            sCurrSport              = "football",
            sCurrLeague             = "",
            sCurrEvent              = "",
            sScoresDivID            = "scembed-scores-container",
            iRefreshSpeed           = 3000,
            oSports                 = {'football':'Football','soccer':'Soccer'},
            oImageCodeMap           = {'college-football':'ncaa'},
            sBaseUrl                = "http://api-app.espn.com/v1/sports";

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

        function buildCardBack(oEvent,oHome,oAway){

            if(sCurrEvent != ""){
                /* Single Event so build the flip card */
                return buildCardBackSmall(oEvent,oHome,oAway)
            }else{
                if(sCurrSport === "football"){
                    return buildFootballCardBacklarge(oEvent,oHome,oAway);
                }else{
                    return buildSoccerCardBacklarge(oEvent,oHome,oAway)
                }
            }
        }

        function buildCardBackSmall(oEvent,oHome,oAway){

   		    var sRow = "";

   		    sRow +='<div class="scembed-back">';
   				sRow +='<div class="scembed-line-score">';

				if(sCurrSport === "football"){
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
   				sRow +='<div class="scembed-links">';
   					sRow +='<a class="scembed-link-recap" href="http://www.espn.com">Recap</a>';
   					sRow +='<a class="scembed-link-stats" href="http://www.espn.com">Stats</a>';
   				sRow +='</div>';
   				sRow +='<div class="scembed-link-share"></div>';

   			sRow +='</div>';

   			return sRow;
        }

        function buildSoccerCardBacklarge(oEvent,oHome,oAway){
            return "";
        }

        function buildFootballCardBacklarge(oEvent,oHome,oAway){
            return "";
        }

        function buildPlayerCard(oPlayer){

        }

        function buildWidgetContainer($oWidget){
            if(sCurrEvent != ""){
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
            addDropDown($oWidget);
            newDiv = $('<div />').addClass('scembed-container');
            newDiv.appendTo($oWidget);

        }

        function setTimeOut(iSpeed){

            if(iSpeed === undefined || !iSpeed){
                iSpeed = 5000;
            }
            clearTimeout(espnTimeOut);
            espnTimeOut = setTimeout(getData,iSpeed);

        }

        function insertCSS(){
            $('head').append('<link rel="stylesheet" href="sc-embed.css" type="text/css" />').append('<link rel="stylesheet" href="http://a.espncdn.com/combiner/c?css=fonts/bentonsans.css,fonts/bentonsansbold.css,fonts/bentonsanslight.css,fonts/bentonsansmedium.css"type="text/css"media="screen" charset="utf-8">');
        }

        function getTeamLogo(sLeague,sTeam){

            var sUrl = "";

            if(sCurrSport === 'soccer'){
                sUrl ="http://soccernet-assets.espn.go.com/design05/i/clubhouse/badges/25x25/"+sTeam+".gif";
            }else{
                if(typeof oImageCodeMap[sLeague] === 'string'){
                    sLeague = oImageCodeMap[sLeague];
                }

                sUrl ="http://a.espncdn.com/combiner/i?img=/i/teamlogos/"+sLeague+"/500/"+sTeam+".png?w=25&h=25&transparent=true";
            }
            return sUrl;
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

        function buildGameRow(oEvent,oHome,oAway){

            var sRow ="";
            var sKey = sCurrSport+sCurrLeague+oEvent.evtid;
            var sExtraClass = "";
            if(typeof oFlipped[sKey] !== "undefined"){
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

       			sRow += buildCardBack(oEvent,oHome,oAway);

       			sRow +='</div>';
       		sRow +='</div>';

       		return sRow;

        }

        function showMatchData($oTarget){

            if(sCurrEvent != ""){
                toggleFlip($oTarget);
                return;
            }else{

            }

        }

        function toggleFlip($el){
            var sKey = sCurrSport+sCurrLeague+$('.scembed-game',$el).attr('id');
            if($('.scembed-game',$el).hasClass('flipped')){
                $('.scembed-game',$el).removeClass('flipped');
                delete oFlipped[sKey];
            }else{
                $('.scembed-game',$el).addClass('flipped');
                oFlipped[sKey] = 1;
            }
        };

        function getData(){
            clearTimeout(espnTimeOut);

            var sExtraUrl = "",
                sExtraUrl2 = "";
            if(sCurrLeague){
                sExtraUrl = "/"+sCurrLeague;
            }

            if(sCurrEvent){
                sExtraUrl2 = "/"+sCurrEvent;
            }

            makeJSONrequest(sBaseUrl+'/'+sCurrSport+sExtraUrl+'/events'+sExtraUrl2+'/?enable=logos,broadcasts,linescores',
            function(oData){
                $('#'+sScoresDivID).html('');
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

                            var oComps = oEvents[iEvent].competitions;
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

                                    oCompetitors[iCompetitor].imageUrl = getTeamLogo(sLeagueCode,oCompetitors[iCompetitor].team.id);

                                    if(oCompetitors[iCompetitor].homeAway === 'home'){
                                        oHome = oCompetitors[iCompetitor];
                                    }else{
                                        oAway = oCompetitors[iCompetitor];
                                    }
                                }

                                //sText = '<img src="'+oHome.imageUrl+'" />'+oHome.team['name']+' '+oHome.score+' vs '+oAway.score+' '+oAway.team['name']+'<img src="'+oAway.imageUrl+'" />';
                                sText = buildGameRow(oEvent,oHome,oAway);
                                logMe(sText);

                            }
                        }
                    }
                }
            });

            setTimeOut(iRefreshSpeed);
        }

        function changeSport(sSport){
            sCurrSport  =   sSport;
            sCurrLeague =   "";
            sCurrEvent  =   "";
            getData();
        }

        function addDropDown($oWidget){

            var s = $('<select />').change(function(){
                changeSport($(this).val());
            });

            for(var val in oSports) {
                $('<option />', {value: val, text: oSports[val]}).appendTo(s);
            }

            s.appendTo($oWidget);
        }

        function sortEventsID(a,b) {
          if (a['id'] < b['id'])
             return -1;
          if (a['id'] > b['id'])
            return 1;
          return 0;
        }

        function logMe(sText){
            $('#'+sScoresDivID).append(sText);
        }

        publicSymbols.initilisePage = initilisePage;
        function initilisePage(){

            $sGlobalDiv = $('#testMe');

            /* Load in the types from the leagues */
            sCurrSportTmp  = $sGlobalDiv.attr('data-sport');
            sCurrLeagueTmp = $sGlobalDiv.attr('data-league');
            sCurrEventTmp  = $sGlobalDiv.attr('data-event');

            if(typeof sCurrSportTmp !== "undefined"){
                sCurrSport = sCurrSportTmp;
            }

            if(typeof sCurrLeagueTmp !== "undefined"){
                sCurrLeague = sCurrLeagueTmp;
            }

            if(typeof sCurrEventTmp !== "undefined"){
                sCurrEvent = sCurrEventTmp;
            }

            insertCSS();

            $('.scembed').each(function(){
                buildWidgetContainer($(this));
            });

            //$('#ESPNLive_Scores').attr('style',"width:350px;height:500px;overflow:hidden;").niceScroll({cursorcolor:"#000"});

            $sGlobalDiv.on("click", ".scembed-container", function(e) {
                showMatchData($(this));
                return false;
            });

            getData();
        }

        return publicSymbols;

    };

    window.ESPNLive = new ESPNLivesetup();

    $(document).ready(function($){
        ESPNLive.initilisePage();
    });

});



(function( $ ){

   var oTimeOut = 0;

   var methods = {
        init: function(options) {

            var settings = $.extend( {
    			defaultClass: 'on',
                defaultElement: 0,
                zebraClass: '',
                speed: 'fast',
                callback: undefined,
                beforesort: undefined,
                startsort:1,
                startdesc:'ASC',
                columnDefaults:[0,0,1,1,1,1,1,1]
            }, options);

            return this.each(function(){

                var $scoreObj = $(this);

                // Read in all the params for the object



                // Create click event to all the form th elements..
                $sortObj.find('th').each(function(intIndex){
                    $(this).bind("click", function(){
                        $sortObj.sortable("sort",intIndex);
                    });
                });

                if($sortObj.attr("direc")){
                    settings.startdesc = $sortObj.attr("direc");
                }else{
                    $sortObj.attr("direc",settings.startdesc);
                }

                if($sortObj.attr("lastclick")){
                    settings.startsort = $sortObj.attr("lastclick");
                }else{
                    $sortObj.attr("lastclick",settings.startsort);
                }

                $sortObj.data("sortable-options",settings);

                // Sort table
                $sortObj.sortable("sort",settings.startsort);

            });
        },

        destroy: function() {
            return this.each(function(){
                $(window).unbind('.scorecenter');
            });
        },

        sort: function(iColNo){

        },

        formatForType: function(itm) {

        }
    }

    $.fn.scorecenter = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on score center' );
        }
    };

})(jQuery);
