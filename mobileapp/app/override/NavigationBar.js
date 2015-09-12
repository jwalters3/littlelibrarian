// Override Sencha's navigation bar 
// Hide back button in top left for Android
Ext.define('App.override.NavigationBar', {
    override: 'Ext.navigation.Bar',

    doChangeView: function (view, hasPrevious, reverse) {
        if (Ext.os.is.Android && Ext.browser.is.PhoneGap) {
            this.callParent([view, false, reverse]);
        }
        else {
            this.callParent([view, hasPrevious, reverse]);
        }
    }

});