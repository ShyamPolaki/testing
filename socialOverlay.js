(function() {
	'use strict';
	
	// Create the button
	videojs.ShareButton = videojs.Button.extend({
		init: function( player, options ) {
			// Initialize the button using the default constructor
			videojs.Button.call( this, player, options );
			
		}
	});
	videojs.ShareButton1 = videojs.Button.extend({
		init: function( player, options ) {
			// Initialize the button using the default constructor
			videojs.Button.call( this, player, options );
			
		}
	});
	
	// Set the text for the button
	videojs.ShareButton.prototype.buttonText = 'Share Video';
	
	videojs.ShareButton1.prototype.buttonText = 'Share Video';
	
	// These are the defaults for this class.
	videojs.ShareButton.prototype.options_ = 
	videojs.ShareButton1.prototype.options_ = {};
	
	
	// videojs.Button uses this function to build the class name.
	videojs.ShareButton.prototype.buildCSSClass = function() {
		// Add our className to the returned className
		return 'vjs-share-button ' + videojs.Button.prototype.buildCSSClass.call(this);
	};
	
	videojs.ShareButton1.prototype.buildCSSClass = function() {
		// Add our className to the returned className
		return 'vjs-share-button1 ' + videojs.Button.prototype.buildCSSClass.call(this);
	};
	
	// videojs.Button already sets up the onclick event handler, we just need to overwrite the callback
	videojs.ShareButton.prototype.onClick = function( e ) {
		// We need to stop this event before it bubbles up to "window" for our event listener below.
		e.stopImmediatePropagation();
		
		
	
	};
	
	
	

	

	// This function will be called by video.js when it loops through all of the registered plugins.
	var pluginFn = function( options ) {
		// We need to pass off the options to the control bar button.
		var shareComponent = new videojs.ShareButton( this, options );
		var shareComponent1 = new videojs.ShareButton1( this, options );
		// Set the default position for the sharing button. Default: control-bar
		var onScreen = options.onScreen || false; 
		// Now we remove the onScreen option as it does not pertain to anything inside the button.
		delete options.onScreen;
		
		var shareButton;
		var shareButton1;
		
		// Should the button be added to the control bar or screen?
		if ( onScreen ) {
			shareButton = this.addChild( shareComponent );
			shareButton1 = this.addChild( shareComponent1 );
		} else {
			shareButton = this.controlBar.addChild( shareComponent );
		}
		
		
	};

	videojs.plugin( 'socialOverlay', pluginFn );
	
	
	
	
	//videojs.obj.merge(videojs, videojs);
})();