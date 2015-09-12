
Ext.define('App.view.Navigation', {
    extend: 'Ext.navigation.View',
    xtype: 'nav',

    config: {
        useTitleForBackButtonText: true,
        // configure the navigation bar to have our settings button on it
        navigationBar: {

            items: [{
                xtype: 'button',
                cls: 'noborder',
                iconCls: 'settings',
                itemId: 'settings',
                align: 'right',
                hidden: true
            }
           ]
        },
        items: [
            {
                xtype: 'mapview'
            }
        ],
        layout: {
            animation: {
                type: 'slide',
                duration: 150,
                easing: 'ease-out'
            }
        }
    }
});
