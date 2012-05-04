;(function($) {
    $.fn.textfill = function(options) {
        var fontSize = options.maxFontPixels;
        var ourText = $('span:visible:first', this);
        var maxHeight = $(this).height();
        var maxWidth = $(this).width();
        var textHeight;
        var textWidth;
        do {
            ourText.css({'font-size': fontSize, 'line-height': fontSize+"px"});
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
        } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
        return this;
    }
})(jQuery);

/**
*  http://chris-barr.com/entry/disable_text_selection_with_jquery/
*  modified to be “$” safe by Dakkar Daemor [www.imaginific.com]
*/
;(function($) {
	$.fn.disableTextSelect = function() {
		return this.each(function() {
			$(this).mousedown(function(){return false;});
		});
	}
})(jQuery);

/*
	compatible with ecs-0.0.1.js
*/

// create ecs connection
// connect and load callbacks
// when message comes in from backend check to see if it's the playlist data
// load them all into the playlist
// set the scrolling
// set the click events
// on click using YTJS api to load video
// when video is over fire off event!

var ytplayer;
var video_data = {};
var loaded = false;
var current_index = 0;

$(document).ready( function() {
	loadVideos( shuffle( all_videos ) );
	//console.log( all_videos );
});

loadVideos = function( videos ) {
	for( var i = 0,len = videos.length; i < len; i++ ) {
		$("#videos").append('<img id="'+videos[i]+'" class="video" src="http://img.youtube.com/vi/'+videos[i]+'/1.jpg"/>');
	}

	initVideos( );
}

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
		}).disableTextSelect();
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
		}
	} else {
		switchVideo( $(".playing").next().attr("id") );
	}
}

onYouTubePlayerReady = function( playerId ) {
	console.log("hell?");
	ytplayer = document.getElementById( "myytplayer" );
  	ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
  	ytplayer.addEventListener("onError", "onytplayerError");

	ytplayer.playVideo();
}

switchVideo = function( vid ) {
	if( !$("#video_container").hasClass( vid ) ) {
		$(".playing").removeClass("playing");
		$("#"+vid).addClass("playing");
		var params = { allowScriptAccess: "always" };
    	var atts = { id: "myytplayer" };
    	if( $("#myytplayer").length ) {
    		swfobject.embedSWF( "http://www.youtube.com/v/"+vid+"?enablejsapi=1&playerapiid=ytplayer&version=3", "myytplayer", "628", "353", "8", null, null, params, atts );
    	} else {
    		swfobject.embedSWF( "http://www.youtube.com/v/"+vid+"?enablejsapi=1&playerapiid=ytplayer&version=3", "video_container", "628", "353", "8", null, null, params, atts );
    	}
		
		var playing_index = $(".playing").index();

		current_index = playing_index;
	}
}

function onytplayerStateChange(newState) {
	if( newState == 0 ) {
		playNextVideo();
	}
}

function onytplayerError(error) {
	playNextVideo()
}