Ext.define('App.model.Book', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'id',
            'name',
            'latitude',
            'longitude',
            'isbn',
            'author',
            'status'
        ]
    }
});