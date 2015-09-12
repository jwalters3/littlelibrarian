Ext.define('App.view.Map', {
    extend: 'Ext.Container',
    requires: 'Ext.Map',
    xtype: 'mapview',

    config: {
        title: 'Little Librarian',
        cls: 'map-home',
        layout: {
            type: 'fit'
        },
        scrollable: null,
        back: false       
    },

    initialize: function () {
        var me = this;

        me.callParent();

        this.add([{
            xtype: 'map',
            mapOptions: {
                center: new google.maps.LatLng(Util.getValue('latitude', 38.909027), Util.getValue('longitute', -77.037165))
            }
        }, {
            xtype: 'toolbar',
            docked: 'bottom',
            items: [
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                align: 'right',
                iconCls: 'locate',
                action: 'locate',
                name: 'locate'
            }
          ]
        }]);

    }

});