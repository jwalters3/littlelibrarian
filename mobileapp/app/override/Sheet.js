Ext.define('App.override.Sheet', {
    override: 'Ext.Sheet',
    show: function (animation) {
        App.app.getController("Navigation").registerSheet(this);
        this.callParent(arguments);
    },
    hide: function (animation) {
        App.app.getController("Navigation").unregisterSheet();
        this.callParent(arguments);
    }
});
