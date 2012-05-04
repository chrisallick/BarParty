var ytplayer;
var video_data = {};
var loaded = false;
var current_index = 0;

$(document).ready( function() {
	$("#play_pause").click(function(event) {
		event.preventDefault();
		if( $(this).html() == "pause" ) {
			$(this).html("play");
			ytplayer.pauseVideo();
		} else {
			$(this).html("pause");
			ytplayer.playVideo();
		}
	});

	$("#next").click(function(event){
		event.preventDefault();
		playNextVideo();
	});

	$(document).bind("idle.idleTimer", function(){
		$("#videos").slideUp();
		$("#controls").slideUp();
	});

	$(document).bind("active.idleTimer", function(){
		$("#videos").slideDown();
		$("#controls").slideDown();
	});

	loadVideos( shuffle( all_videos ) );
});

loadVideos = function( videos ) {
	for( var i = 0,len = videos.length; i < len; i++ ) {
		$("#videos").append('<img id="'+videos[i]+'" class="video" src="http://img.youtube.com/vi/'+videos[i]+'/1.jpg"/>');
	}

	initVideos( );
}

/*
	this is dope!
*/
shuffle = function(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

initVideos = function() {
	$(".video").each(function() {
		$(this).click(function(event) {
			event.preventDefault();
			if( !$(this).hasClass("playing") ) {
				switchVideo( $(this).attr("id") );
			}
		});
	});

	playNextVideo();
}

playNextVideo = function() {
	// if we have never played this playlist before, play it from the start
	// if there is not a next item to play, play it from the start
	// else play the next video
	if( !$(".playing").length || !$(".playing").next().length ) {
		var vid = $(".video:eq(0)").attr("id");
		switchVideo( vid );
		if( loaded == false ) {
			loaded = true;
			$.idleTimer(1500);
		}
	} else {
		switchVideo( $(".playing").next().attr("id") );
	}
}

onYouTubePlayerReady = function( playerId ) {
	ytplayer = document.getElementById( "video_container" );
  	ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
  	ytplayer.addEventListener("onError", "onytplayerError");

	ytplayer.playVideo();
}

switchVideo = function( vid ) {
	if( !$("#video_container").hasClass( vid ) ) {
		// pop playing and set new playing
		$(".playing").removeClass("playing");
		$("#"+vid).addClass("playing");

		// embed vid
		var params = { allowScriptAccess: "always", wmode: "transparent" };
    	var atts = { id: "video_container" };
    	swfobject.embedSWF( "http://www.youtube.com/v/"+vid+"?enablejsapi=1&playerapiid=ytplayer&version=3&controls=0", "video_container", "100%", "100%", "9", null, null, params, atts );
		
		var playing_index = $(".playing").index();

		// slide left index times width of first video
		var dist = "-" + (playing_index * $('#videos .video:first').width()) + "px";
		$("#videos").css("left",dist);

		// update play index
		current_index = playing_index;
	}
}

function onytplayerStateChange(newState) {
	if( newState == 0 ) {
		playNextVideo();
	}
}

// on error just go to next vid
function onytplayerError(error) {
	playNextVideo()
}