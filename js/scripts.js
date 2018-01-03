var app = {

	// parameters for each player in page
	playersParametersArray: [{
		height: '600',
		width: '800',
		playerVars: {
			wmode: 'opaque',
			controls: 0, 					//hide native control
			playsinline: 1,				// check if video plays on player mobile (IOS) and allows video play inline (android)
			rel: 0,								// hide suggested videos at the video's end
			showinfo: 0, 					//hide info - video name etc
			autohide: 1,					//hide native controls only when video plays
			fs: 0,								// remove native play btn in full screen
			iv_load_policy: 3, 		// hide video annotation
			loop: 1,            	// play videos in loop - custom skip btn works in loop
			mute: 0,							// play videos with audio
			listType: 'playlist', // set playlist
			autoplay: 0,       		// don't play video automatically
			cc_load_policy: 0, 		// show subtitle automatically
			color : 'white',   		// set loading bar's color - white or red
			disablekb : 0,    		//disable keyboard action on video
			enablejsapi: 0,   		//enable javascript api
			//start: 5 set after how many seconds video starts
			//end: 5, set after how many seconds video stops
			hl: 'it',      				//set player's language
			modestbranding: 1, 		// reduce the yt logo's dimension
			//playerapiid: see javascript api
			//origin: see javascript api
			theme: 'dark'         //set controls bar's color - dark or light
		}
	},
	{
		height: '600',
		width: '800',
		playerVars: {
			wmode: 'opaque',
			controls: 0, 					//hide native control permanently
			playsinline: 1,				// check if video plays on an external player (IOS) and allows video play inline (android)
			rel: 0,								// hide suggested videos at the video's end
			showinfo: 0, 					//hide info - video name etc
			autohide: 1,					//hide native controls only when video plays
			fs: 0,								// in full screen hide native play btn
			iv_load_policy: 3, 		// hide video annotation
			loop: 1,            	// play videos in loop - custom skip btn works in loop
			mute: 0,							// play videos with audio
			listType: 'playlist',	// set playlist
			autoplay: 0,       		// disable autoplay
			cc_load_policy: 0, 		// show subtitle automatically
			color : 'white',   		// set the loading bar's color white or red
			disablekb : 0,    		//disable keyboard action on video
			enablejsapi: 0,   		//enable javascript api
			//start: 5 set after how many seconds video starts
			//end: 5, set after how many seconds video stops
			hl: 'it',      				//set player's language
			modestbranding: 1, 		// reduce the yt logo's dimension
			//playerapiid: see javascript api
			//origin: see javascript api
			theme: 'dark'         //set controls bar's color dark or light
		}
	}],

	ytPlayers: [],
		iFrames: [],
		onTouch: (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) ? 'touchstart' : 'click',
	}

	// 2 - Called when iFrameAPI is inject in page

	function onYouTubeIframeAPIReady() {
		if (typeof app.playersParametersArray === 'undefined')
			return;
			// Rules for touch device
			if(app.onTouch === 'touchstart'){
				$('.ytplayer').addClass('on-touch');
				$('.controls').css({'display': 'none'});
				$('.controls__volume').css({'display': 'none'});
			}

			//Pushing data-video and data-playlist in array
				var videoIdList = [];
				var playlistIDs = [];

				// Grab video ID from each .iframe data-video attribute
				$(".ytplayer__iframe").each(function() {
					videoIdList.push($(this).attr("data-video"));
				});
				$(".ytplayer__iframe").each(function() {
					playlistIDs.push($(this).attr("data-playlist"));
				});


var navigate = (function() {
	$('.dd').toggle();
	$('.dd_btn').click(function() {
		var dataName = $(this).attr('data-name');
		$('.dd').hide();
		$('.' + dataName).toggle();
	});
})();
