Ext.define('App.store.Book', {
    extend: 'Ext.data.Store',
    storeId: 'bookstore',

    config: {      
        autoLoad: false,
        model: 'App.model.Book'
    }
});