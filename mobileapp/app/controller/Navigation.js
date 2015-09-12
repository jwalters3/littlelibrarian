// Controller for handling navigation in the app
//


Ext.define('App.controller.Navigation', {
    extend: 'Ext.app.Controller',
    requires: [
       'Ext.device.Notification'
    ],
    activeSheet: null,
    activeSheets: [],
    config: {
        refs: {
            nav: {
                selector: '[xtype="nav"]'
            }           
        },
        control: {
            
        }
    },

    
    start: function () {
        // called by app.js on in launch()
        Ext.Viewport.add(Ext.create('App.view.Navigation'));
        //this.checkLogin();

    },

    pop: function () {
        // removes screen from navigation
        this.getNav().pop(1);

    },
    push: function (card) {
        this.getNav().push(card);
    },
   
   

    onBack: function (e) {
        if (e) {
            e.preventDefault();
        }
        // handle the hardware back button in Android/BlackBerry
        var exitApp = false;
        var activeItem = Ext.Viewport.getActiveItem();

        if (activeItem == null) {
            return false;
        }
        // if we have a load mask up
        if (Util.isMasked()) {
            // let the user cancel the current request
            Ext.Ajax.abort();
            Util.hideBusy();
        } else {

            // Check for popups
            if (App.app.getController("Navigation").getActiveSheet() != null) {
                App.app.getController("Navigation").getActiveSheet().hide();
                return false;
            }
            // check to see if the active item is the navigation view
            else if (activeItem.xtype == 'nav') {
                // If I'm on the welcome screen, then we need to exit the app
                if (activeItem.getActiveItem().xtype.indexOf('mapview') > -1) {
                    exitApp = true;
                }
                else {
                    // otherwise, we pop a view off the stack
                    activeItem.pop(1);
                }
            }
           


        }
        if (exitApp) {
           
                navigator.app.exitApp();
          
        }
    },
    getActiveSheet: function () {
        return this.activeSheet;
    },
    registerSheet: function (sheetObj) {
        this.activeSheets.push(sheetObj);
        console.log('sheet registered');
        this.activeSheet = sheetObj;
    },
    unregisterSheet: function () {
        this.activeSheet = null;
        this.activeSheets.pop();
        console.log('sheet un-registered');
    }

});