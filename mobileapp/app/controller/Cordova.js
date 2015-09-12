// Controller for handling Cordova integration in the app
//
// This handles:
// * Back button from Android (tells Navigation to go back)
// * Handles the new statusbar in iOS 7+
// * Moving Compass around the map

Ext.define('App.controller.Cordova', {
    extend: 'Ext.app.Controller',

    config: {
        
    },


    
    launch: function () {
        // this function is called by Sencha Touch when the app starts
        // handle the Android back button
        if (Ext.os.is.Android && Ext.browser.is.PhoneGap) {
            document.addEventListener("backbutton", Ext.bind(App.app.getController('Navigation').onBack, this), false);  // add back button listener	                     
        }

        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }
    }
});