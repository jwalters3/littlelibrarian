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
                selector: 'libararybooks'
            }
        },
        control: {
            booksList: {
                show: 'onBooksShow'
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
        //App.api.getBooksByLatLnglat, lng, successCallback, failureCallback, scope)
    },

    onBooksLoaded: function (response) {
        var devices = response.devices;
        var store = Ext.getStore("Book");
        for (i = 0; i < devices.length; i++) {

            var book = Ext.create('App.model.Book', {
                name: devices[i].name,
                id: devices[i].id,
                isbn: devices[i].serial,
                latitude: devices[i].location.latitude,
                longitude: devices[i].location.longitude,
                status: devices[i].tags[0]
            });
            store.add(book);
        }
        console.log(store);
    },
    showLibrary: function (library) {
        var nav = this.getController('Navigation');
        nav.push(Ext.create('App.view.LibraryTabs', {
            record: library
        }));
    }
});