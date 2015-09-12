Ext.define('App.view.LibraryTabs', {
    extend: 'Ext.tab.Panel',
    xtype: 'librarytabs',

    config: {
        layout: {
            type: 'fit'
        },
        scrollable: null,
        back: true,
    },
    initialize: function () {
        this.callParent(arguments);
        this.add([{
            xtype: 'librarydetail',
            data: this.config.record
        }, {
            xtype: 'librarybooks'
        }]);
    }
});