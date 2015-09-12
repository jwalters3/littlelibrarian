Ext.define('App.view.LibraryBooks', {
    extend: 'Ext.dataview.List',
    xtype: 'librarybooks',

    config: {
        title: 'Book List',
        store: 'Book',

        back: true,
        layout: { type: 'fit' },
        scrollable: true,
        itemTpl: [
            '<div>',
                '{id}<br/>',
                '{name}<br/>',
                '{latitude}<br/>',
                '{longitude}<br/>',
                '{isbn}<br/>',
                '{author}<br/>',
                '{status}<br/>',
            '</div>'
        ]
    }
});
