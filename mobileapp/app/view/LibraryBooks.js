Ext.define('App.view.LibraryBooks', {
    extend: 'Ext.dataview.List',
    xtype: 'librarybooks',

    config: {
        title: 'Book List',
        store: 'Book',
        cls: 'books-list',

        back: true,
        itemTpl: [
            '<div class="clearfix book-wrap">',
                '<tpl if="thumb">',
                    '<div class="book-thumb"><img src="{thumb}" /></div>',
                '</tpl>',
                '<div class="book-title">',
                    '<p><b>{name}</b></p>',
                    '<p>{author}</p>',
                '</div>',
                '<div class="book-detail">',
                    '<p>{[Ext.String.ellipsis(values.description,250,false)]}</p>',
                    '<p>ISBN:{isbn}</p>',
                '</div>',
            '</div>'
        ]
    }
});
