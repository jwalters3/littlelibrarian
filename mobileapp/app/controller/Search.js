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
        App.Api.queryBooks(field.getValue(), this.onBooksLoaded, Ext.emptyFn, this);
        var nav = this.getApplication().getController('Navigation');
        nav.push(Ext.create('App.view.LibraryBooks'), {
            action: 'search'
        });
    },
    onBooksLoaded: function (response) {
        var devices = response.items;
        var store = Ext.getStore("Book");
        store.removeAll();
        for (i = 0; i < devices.length; i++) {

            var book = Util.parseGoogleBook(devices[i])
            store.add(book);
        }
        console.log(store);
    },
});
