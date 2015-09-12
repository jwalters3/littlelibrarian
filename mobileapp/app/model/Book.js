Ext.define('App.model.Book', {
    extend: 'Ext.data.Model',
    config: {
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
    }
});