Ext.define('App.view.LibraryBooks', {
    extend: 'Ext.dataview.List',
    xtype: 'librarybooks',

    config: {
        title: 'Book List',
        store: 'Book',
        cls: 'books-list',

        back: true,
        layout: { type: 'fit' },
        scrollable: true,
        itemTpl: [
            '<div class="clearfix book-wrap">',
                '<tpl if="thumb">',
                    '<div class="book-thumb"><img src="{thumb}" /></div>',
                '</tpl>',
                '<div class="book-detail">',
                    '<p>{name}</p>',
                    '<p>{author}</p>',
                    '<p>{isbn}</p>',
                '</div>',
            '</div>'
        ]
    },
    initialize: function () {
        var me = 'test';
    }
});
