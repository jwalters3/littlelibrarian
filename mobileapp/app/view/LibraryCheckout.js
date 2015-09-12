Ext.define('App.view.LibraryCheckout', {
    extend: 'Ext.Panel',
    xtype: 'librarycheckout',

    config: {
        title: 'Checkout',
        back: true,
        layout: { type: 'vbox', align: 'middle' }, 
        scrollable: false
    },
    initialize: function () {
        var me = this;
        me.add([{
            style: 'margin-top:50px;padding: 15px 5px;',
            data: this.config.record.getData(),
            tpl: [
                '<div style="text-align:center;">',
                '<h3 style="margin-bottom:5px;">{name}</h2>',
                '<p>{author}</p>',
                '<div style="padding-top:10px"><img src="{thumb}" /></div>',
                '</div>'
            ]
        }, {
            xtype: 'button',
            text: 'Checkout',
            action: 'checkout'
        }]);
    }
});
