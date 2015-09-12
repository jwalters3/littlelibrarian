Ext.define('App.view.LibraryBooks', {
    extend: 'Ext.dataview.List',
    xtype: 'librarybooks',

    config: {
        title: 'Book List',
        store: 'bookstore',

        back: true,
        layout: { type: 'fit' },
        scrollable: true,
        itemTpl: [
            '<div>{#]</div>'
        ]
    }
});
