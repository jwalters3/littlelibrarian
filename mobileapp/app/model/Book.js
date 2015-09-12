Ext.define('App.model.Book', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'dne',
        fields: [
            'id',
            'name',
            'description',
            'thumb',
            'latitude',
            'longitude',
            'isbn',
            'author',
            'status'
        ]
    },
    merge: function (book1, book2) {
        this.setData(Ext.apply({}, book2.getData(), book1.getData()));
    }
});