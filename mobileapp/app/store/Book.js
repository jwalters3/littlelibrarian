Ext.define('App.store.Book', {
    extend: 'Ext.data.Store',
    //xtype: 'bookstore',

    config: {      
        autoLoad: false,
        model: 'App.model.Book'
    }
});