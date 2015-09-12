Ext.define('App.controller.Library', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Panel'],

    config: {
        refs: {
            nav: {
                selector: '[xtype="nav"]'
            },
            booksList: {
                xtype: 'librarybooks',
                selector: 'librarybooks[action="library"]'
            },
            checkoutBtn: {
                xtype: 'button',
                selector: 'button[action="checkout"]'
            },
            libraryTabs: {
                xtype: 'librarytabs',
                selector: 'librarytabs'
            }
        },
        control: {
            libraryTabs: {
                activate: 'onBooksShow'
            },
            booksList: {
                select: 'onBookTap' 
            },
            checkoutBtn: {
                tap: 'onCheckoutTap'
            }
            //map: {
            //    centerchange: 'onMapPan',
            //    activate: 'onMapActivate',
            //    maprender: 'onMapRender',
            //    zoomchange: 'onMapZoomChange',
            //    painted: 'initMap'
            //},           
            //bookButton: {
            //    tap: 'onBookButtonTap'
            //},
            //locateButton: {
            //    tap: 'locateUser'
            //},          
            //nav: {
            //}
        }
    },

    onBooksShow: function () {
        var library = this.library;
        //this.getBooksList().setLoading();
        App.Api.getBooksByLatLng(library.Library_Geolocation__c.latitude, library.Library_Geolocation__c.longitude, this.onBooksLoaded, Ext.emptyFn, this);
    },

    onBooksLoaded: function (response) {
        var devices = response.devices;
        var store = Ext.getStore("Book");
        var query = [];
        store.removeAll();
        for (i = 0; i < devices.length; i++) {
            var book = Util.parseM2XBook(devices[i])
            query.push('isbn:' + book.get('isbn'));
            store.add(book);
        }
        App.Api.queryBooks(query.join(' OR '), this.onMergeRecords, Ext.emptyFn, this);

    },
    onBookTap: function (list, record) {
        var nav = this.getApplication().getController('Navigation');
        this.selectedRecord = record;
        nav.push(Ext.create('App.view.LibraryCheckout', { record: record }));
    },
    onCheckoutTap: function () {
        var rec = this.selectedRecord;
        if (rec) {
            App.Api.checkOut(rec.get('id'), rec.get('name'), this.onCheckout, Ext.emptyFn, this);
        }
    },
    onMergeRecords: function (response) {
        var devices = response.items;
        var store = Ext.getStore("Book");
        for (i = 0; i < devices.length; i++) {
            var book = Util.parseGoogleBook(devices[i])
            if (book) {
                var storeBook = store.findRecord('isbn', book.get('isbn'));
                if (storeBook) {
                    storeBook.set("author", book.get("author"));
                    storeBook.set("description", book.get("description"));
                    storeBook.set("thumb", book.get("thumb"));
                }
            }
        }
        this.getBooksList().refresh();
    },
    showLibrary: function (library) {
        var nav = this.getApplication().getController('Navigation');
        this.library = library;
        nav.push(Ext.create('App.view.LibraryTabs', {
            record: library
        }));
    }
});