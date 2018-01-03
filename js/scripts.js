var app = {

  // parameters for each player in page
  playersParametersArray: [{
      height: '600',
      width: '800',
      playerVars: {
        wmode: 'opaque',
        controls: 0, //hide native control
        playsinline: 1, // check if video plays on player mobile (IOS) and allows video play inline (android)
        rel: 0, // hide suggested videos at the video's end
        showinfo: 0, //hide info - video name etc
        autohide: 1, //hide native controls only when video plays
        fs: 0, // remove native play btn in full screen
        iv_load_policy: 3, // hide video annotation
        loop: 1, // play videos in loop - custom skip btn works in loop
        mute: 0, // play videos with audio
        listType: 'playlist', // set playlist
        autoplay: 0, // don't play video automatically
        cc_load_policy: 0, // show subtitle automatically
        color: 'white', // set loading bar's color - white or red
        disablekb: 0, //disable keyboard action on video
        enablejsapi: 0, //enable javascript api
        //start: 5 set after how many seconds video starts
        //end: 5, set after how many seconds video stops
        hl: 'it', //set player's language
        modestbranding: 1, // reduce the yt logo's dimension
        //playerapiid: see javascript api
        //origin: see javascript api
        theme: 'dark' //set controls bar's color - dark or light
      }
    },
    {
      height: '600',
      width: '800',
      playerVars: {
        wmode: 'opaque',
        controls: 0, //hide native control permanently
        playsinline: 1, // check if video plays on an external player (IOS) and allows video play inline (android)
        rel: 0, // hide suggested videos at the video's end
        showinfo: 0, //hide info - video name etc
        autohide: 1, //hide native controls only when video plays
        fs: 0, // in full screen hide native play btn
        iv_load_policy: 3, // hide video annotation
        loop: 1, // play videos in loop - custom skip btn works in loop
        mute: 0, // play videos with audio
        listType: 'playlist', // set playlist
        autoplay: 0, // disable autoplay
        cc_load_policy: 0, // show subtitle automatically
        color: 'white', // set the loading bar's color white or red
        disablekb: 0, //disable keyboard action on video
        enablejsapi: 0, //enable javascript api
        //start: 5 set after how many seconds video starts
        //end: 5, set after how many seconds video stops
        hl: 'it', //set player's language
        modestbranding: 1, // reduce the yt logo's dimension
        //playerapiid: see javascript api
        //origin: see javascript api
        theme: 'dark' //set controls bar's color dark or light
      }
    }
  ],
  ytPlayers: [],
  iFrames: [],
  onTouch: (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) ? 'touchstart' : 'click',
}

// 2 - Called when iFrameAPI is inject in page

function onYouTubeIframeAPIReady() {
  if (typeof app.playersParametersArray === 'undefined')
    return;

  // Rules for touch device
  if (app.onTouch === 'touchstart') {
    $('.ytplayer').addClass('on-touch');
    $('.controls').css({
      'display': 'none'
    });
    $('.controls__volume').css({
      'display': 'none'
    });
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

  // obtain element's id - data-video - data-playlist
  for (var i = 0; i < videoIdList.length; i++) {

    var videoID = videoIdList[i] || playlistIDs[i];
    var playlistID = playlistIDs[i];
    var playerID = $('[data-video=' + videoID + ']').attr('id') || $('[data-playlist=' + videoID + ']').attr('id');
    var playerParameters = app.playersParametersArray[i];

    // init createPlayer
    createPlayer(playerParameters, playerID, videoID, playlistID);
  }
}

// 3 - Take playerParameter and apply to players in page

function createPlayer(playerParameters, playerID, videoID, playlistID) {

  // set player's id in playerParameters
  if (playlistID != null) {
    playerParameters.playerVars.playlist = '' + playlistID + '';
    playerParameters.playerVars.list = '' + playlistID + '';

  } else {
    playerParameters.videoId = videoID;
  }

  // init new YT player
  var ytPlayer = new YT.Player(playerID, playerParameters);

  // app.players holds ref to all players in page
  app.ytPlayers.push(ytPlayer);

  // init YT player listeners
  ytPlayer.addEventListener('onReady', function(event) {
    // init PlayerManager Object
    YTManager = new PlayerManager(ytPlayer, videoID);
  });

}

var __bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};

// 4 - PLAYER MANAGER

function PlayerManager(ytPlayerRef, videoID) {

  this.ytPlayer = ytPlayerRef;

  //check id of player is a video or playlist - video id has 11 letters
  if (videoID.length == 11) {
    var playerContainer = $('[data-video=' + videoID + ']').parent('.ytplayer');
  } else {
    var playerContainer = $('[data-playlist=' + videoID + ']').parent('.ytplayer');
  }

  this.playerContainer = playerContainer;
  this.playButton = playerContainer.find('.controls__btn--play');
  this.overlayButton = playerContainer.find('.controls__btn--overlay');
  this.overlayWrap = playerContainer.find('.overlay');
  this.overlayElements = playerContainer.find('.overlay__element');
  this.skipButton = playerContainer.find('.controls__btn--skip');
  this.playerState = YT.PlayerState.UNSTARTED;
  this.volumeSlider = playerContainer.find('.controls__slider');
  this.muteBtn = playerContainer.find('.controls__btn--mute');
  this.overlayCarousel = playerContainer.find('.overlay__carousel');
  this.carouselElements = this.overlayCarousel.find('.overlay__element');


  var mngr = this;
  this.ytPlayer.addEventListener('onStateChange', __bind(mngr.onPlayerStateChange, mngr));

  // Init buttons listener
  this.listeners();

  //caching data-ypt-index of playlist
  this.ytpIndex = [];

  this.carouselElements.each(function() {
    mngr.ytpIndex.push($(this).attr("data-ytp-index"));
  });

}

// 5 - LISTENERS

PlayerManager.prototype.listeners = function() {

  var $playerManager = this;

  /*

  	YT PLAYER STATE

  	-1 – unstarted
  	0 – ended
  	1 – playing
  	2 – paused
  	3 – buffering
  	5 – video cued

  	PLAYER'S CONTAINER STATE

  	- ON-PLAY
  	- ON_PAUSE
  	- ON-OVERLAY

  */

  // PLAY BTN (play/pause video)
  this.playButton.on(app.onTouch, function(e) {
    e.preventDefault();

    // get the state of player
    // check if player are on mute
    $playerManager.playerState = $playerManager.ytPlayer.getPlayerState();
    var isMute = $playerManager.ytPlayer.isMuted();


    if (
      $playerManager.playerState == YT.PlayerState.UNSTARTED ||
      $playerManager.playerState == YT.PlayerState.CUED ||
      $playerManager.playerState == YT.PlayerState.PAUSED ||
      $playerManager.playerState == YT.PlayerState.BUFFERING
    ) {

      $playerManager.ytPlayer.playVideo();
      $playerManager.playerContainer.removeClass('on-pause on-overlay');
      $playerManager.playerContainer.addClass('on-play');

    } else if ($playerManager.playerState == YT.PlayerState.PLAYING) {
      $playerManager.ytPlayer.pauseVideo();
      $playerManager.playerContainer.removeClass('on-play');

      // if you want show overlay when player is on-pause add class on-overlay here
      $playerManager.playerContainer.addClass('on-pause');

    }
  });

  // OVERLAY BTN (show/hide playlist)
  this.overlayButton.on(app.onTouch, function(e) {
    e.preventDefault();

    // get the state of player
    // check if player are on mute
    var isMute = $playerManager.ytPlayer.isMuted();

    $playerManager.playerState = $playerManager.ytPlayer.getPlayerState();

    if ($playerManager.playerContainer.hasClass('on-overlay')) {
      $playerManager.playerContainer.removeClass('on-overlay');
    } else {

      if (
        $playerManager.playerState == YT.PlayerState.UNSTARTED ||
        $playerManager.playerState == YT.PlayerState.CUED ||
        $playerManager.playerState == YT.PlayerState.PAUSED ||
        $playerManager.playerState == YT.PlayerState.BUFFERING
      ) {
        $playerManager.playerContainer.addClass('on-overlay');

      } else if ($playerManager.playerState == YT.PlayerState.PLAYING) {

        $playerManager.playerContainer.addClass('on-overlay');

      }
    }
  });

  // OVERLAY ELEMENTS (select video)
  this.overlayElements.on(app.onTouch, function(e) {
    e.preventDefault();
    // get data-ytp-index to overlay element
    var yptIndex = $(this).attr('data-ytp-index');

    if ($(this).hasClass('overlay__element--hide')) {
      if ($playerManager.playerContainer.hasClass('on-play')) {
        $playerManager.ytPlayer.pauseVideo();
        $playerManager.playerContainer.addClass('on-pause');
        $playerManager.playerContainer.removeClass('on-play on-overlay');
      } else {
        $playerManager.ytPlayer.playVideo();
        $playerManager.playerContainer.removeClass('on-pause on-overlay');
        $playerManager.playerContainer.addClass('on-play');
      }
    } else {
      $playerManager.ytPlayer.playVideoAt(yptIndex);
      $playerManager.playerContainer.removeClass('on-overlay on-pause');
      $playerManager.playerContainer.addClass('on-play');
    }
  });

  // SKIP BTN (skip to prev / next video)
  this.skipButton.on(app.onTouch, function(e) {
    e.preventDefault();
    $playerManager.playerContainer.addClass('on-play');

    if ($(this).hasClass('controls__btn--prev')) {

      $playerManager.ytPlayer.previousVideo();
    } else {
      $playerManager.ytPlayer.nextVideo();
    }
  });

  // VOLUME SLIDER
  this.volumeSlider.on('input', function(e) {
    e.preventDefault();

    // get the input value
    var volume = $(this).val();

    // apply to video's volume
    $playerManager.ytPlayer.setVolume(volume);

    if (volume == 0) {
      $playerManager.muteBtn.addClass('on-mute');
    } else {
      $playerManager.muteBtn.removeClass('on-mute');
    }

  });

  this.muteBtn.on(app.onTouch, function(e) {
    e.preventDefault();
    var isMute = $playerManager.ytPlayer.isMuted();


    if (isMute == true) {
      $playerManager.ytPlayer.unMute();
      $playerManager.muteBtn.removeClass('on-mute');
    } else {
      $playerManager.ytPlayer.mute();
      $playerManager.muteBtn.addClass('on-mute');
    }

  });
}

// 6 - API called this function every time the player change his status

PlayerManager.prototype.onPlayerStateChange = function() {

  /*

  	YT PLAYER STATE

  	-1 – unstarted
  	0 – ended
  	1 – playing
  	2 – paused
  	3 – buffering
  	5 – video cued

  	PLAYER'S CONTAINER STATE

  	- ON-PLAY
  	- ON_PAUSE
  	- ON-OVERLAY

  */

  var $playerManager = this;
  var isMute = $playerManager.ytPlayer.isMuted();
  console.log('change ' + $playerManager.playerState);

  $playerManager.playerState = $playerManager.ytPlayer.getPlayerState();

  if (
    $playerManager.playerState == YT.PlayerState.UNSTARTED ||
    $playerManager.playerState == YT.PlayerState.CUED ||
    $playerManager.playerState == YT.PlayerState.PAUSED ||
    $playerManager.playerState == YT.PlayerState.ENDED
  ) {
    $playerManager.playerContainer.removeClass('on-play');

    // if you want show overlay when player is on-pause add class on-overlay here
    $playerManager.playerContainer.addClass('on-pause');
  } else if ($playerManager.playerState == YT.PlayerState.BUFFERING) {

    // get the index of current video and apply now-playing class to overlay element
    var playlistIndex = $playerManager.ytPlayer.getPlaylistIndex();

    for (var i = 0; i < $playerManager.ytpIndex.length; i++) {
      if ($playerManager.ytpIndex[i] == playlistIndex) {

        this.carouselElements.removeClass('now-playing');
        $("[data-ytp-index=" + $playerManager.ytpIndex[i] + "]").addClass('now-playing');
      }
    }

  } else {
    $playerManager.playerContainer.removeClass('on-pause');
    $playerManager.playerContainer.addClass('on-play');
  }
}



//DOM READY
$(function() {
  // 1. loading IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});



var navigate = (function() {
  $('.dd').toggle();
  $('.dd_btn').click(function() {
    var dataName = $(this).attr('data-name');
    $('.dd').hide();
    $('.' + dataName).toggle();
  });
})();
