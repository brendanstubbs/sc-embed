(function($){
	$(document).ready(function () {
		jQuery(".insider-line").each(function() {
			var gameId = jQuery(this).parents('[id$="-gameContainer"]').attr("id").replace("-gameContainer", '');
			var sport = document.URL;
			sport = sport.substring(sport.indexOf("/", 7) + 1);
			sport = sport.substring(0, sport.indexOf("/"));
			var url = "http://dev.espn.go.com/espnadmin/users/bmurray/embedTool?league=" + sport + "&gameId=" + gameId;
			jQuery(this).html('<a href="" onclick="window.open(\'' + url + '\')"><span><img src="http://assets.espn.go.com/icons/sportscenter.png" height="11px" width="17px" style="margin-right:5px;"></img>Embed Scorecard</span></a>');
		});
	});
})(jQuery);