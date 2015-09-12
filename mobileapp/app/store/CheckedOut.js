Ext.define('App.store.CheckedOut', {
    extend: 'Ext.data.Store',
    requires: ['App.model.Book', 'Ext.data.proxy.LocalStorage'],
    xtype: 'checkedoutbooks',

    config: {
        autoLoad: true,
        model: 'App.model.Book',
        proxy: {
            type: 'localstorage',
            id: 'checkedoutbooks'
        }
    }

});