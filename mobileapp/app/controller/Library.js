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
            checkedInButton: {
                selector: '[action="checkin"]'
            },
            libraryTabs: {
                xtype: 'librarytabs',
                selector: 'librarytabs'
            }
        },
        control: {
            libraryTabs: {
                //activate: 'onBooksShow'
            },
            booksList: {
                select: 'onBookTap' 
            },
            checkoutBtn: {
                tap: 'onCheckoutTap'
            },
            checkedInButton: {
                tap: 'onCheckIn'
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
    onCheckIn: function () {
        var store = Ext.getStore('CheckedOut');
        var record = store.getAt(0);

        var title = record.get('name');// 'The Hobbit';
        var me = this;
        Ext.Msg.confirm("Deposit", "Deposit " + title+ " ?", function (btn) {
            if (btn == 'yes') {
                me.deposit(record);
            }
        });
    },
    deposit:function(record) {
        Util.showBusy('Depositing...');
        var me = App.app.getController('Library');
        Api.checkIn(record.get('id'), record.get('name'), this.library.Library_Geolocation__c.latitude, this.library.Library_Geolocation__c.longitude, me.onDepositSuccess, null);
    },
    onDepositSuccess: function () {
        var me = App.app.getController('Library');
        var store = Ext.getStore('CheckedOut');
        store.removeAll();
        store.sync();
        Util.hideBusy();
        me.getApplication().getController('Map').toggleCheckIn();
        me.getNav().pop(1);
    },
    onCheckoutTap: function () {
        var rec = this.selectedRecord;
        if (rec) {
            Util.showBusy('Checking out...');
            App.Api.checkOut(rec.get('id'), rec.get('name'), this.onCheckoutSuccess, Ext.emptyFn, this);
            //this.onCheckoutSuccess();
        }
    },
    onCheckoutSuccess: function () {       
        // pop to map view
        // show toast
        Util.hideBusy();
        var title = this.selectedRecord.get('name');
        var store = Ext.getStore('CheckedOut');
        store.add(this.selectedRecord);
        store.sync();
        this.selectedRecord = null;
        this.library = null;        
        this.getNav().pop(2);
        Ext.toast('You have checked out ' + title, 2000);

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
        this.onBooksShow();
    }
});