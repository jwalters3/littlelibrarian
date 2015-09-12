Ext.define('App.controller.Search', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Panel'],

    config: {
        refs: {
            search: {
                selector: 'mapview textfield'
            },
            booksList: {
                xtype: 'librarybooks',
                selector: 'librarybooks[action="search"]'
            }
        },
        control: {
            search: {
                keyup: 'onKeyUp'
            },
            booksList: {
                activate: 'onBooksShow'
            }
        }
    },
    onBooksShow: function () {

    },
    onKeyUp: function (field, e) {
        if (e.event.keyCode == 13) {
            this.search(field);
        }
    },
    search: function (field) {
        Util.showBusy('Finding...');
        App.Api.queryBooks(field.getValue(), this.onGoogleSearch, Ext.emptyFn, this);
        /*
        var nav = this.getApplication().getController('Navigation');
        Ext.getStore('Book').removeAll();
        nav.push(Ext.create('App.view.LibraryBooks'), {
            action: 'search'
        });*/
    },
    onGoogleSearch:function (response) {
        var devices = response.items;
        var query = [];
        for (i = 0; i < devices.length; i++) {
            if (devices[i].volumeInfo.industryIdentifiers) {
                query.push(devices[i].volumeInfo.industryIdentifiers[0].identifier);
            }
        }
        Api.searchBooks(query.join(','), this.onBookResult, null, this);
    },

    onBookResult:function (response) {       
            var me = App.app.getController('Map');
            me.clearMarkers();
            var records = response.devices;
            var mapPanel = me.getMap(); // down('map');
            var gMap = mapPanel.getMap();
            for (i = 0; i < records.length; i++) {
                          
                var marker = new google.maps.Marker({
                    map: gMap,
                    //animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(records[i].location.latitude, records[i].location.longitude),
                    icon: 'resources/images/library.png',
                    record: records[i]
                });              
                me.mapMarkers.push(marker);
            }
            Util.hideBusy();        
    }, 

    onBooksLoaded: function (response) {
        Util.hideBusy();
        var devices = response.items;
        var store = Ext.getStore("Book");
        for (i = 0; i < devices.length; i++) {

            var book = Util.parseGoogleBook(devices[i])
            if (book) {
                store.add(book);
            }
        }
        console.log(store);
    },
});
