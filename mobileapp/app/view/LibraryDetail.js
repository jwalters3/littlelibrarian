Ext.define('App.view.LibraryDetail', {
    extend: 'Ext.Panel',
    require: ['Ext.carousel.Carousel'],
    xtype: 'librarydetail',

    config: {
        title: 'Details',
        back: true,
        layout: { type: 'vbox', align: 'stretch'},
        scrollable: true,
    },
    initialize: function () {
        var me = this,
            i, items, images, carousel;

        items = [{
            xtype: 'panel',
            data: me.config.data,
            tpl: [
                '<div class="libraryinfo" style="margin:10px 0;">',
                    '<p>{Library_Name__c}</p>',
                    '<p>{Street__c}</p>',
                    '<p>{City__c}, {State_Province_Region__c} {Postal_Zip_Code__c}</p>',
                    '<div>{Library_Story__c}</div>',
                 '</div>'
            ]
        }];

        images = me.config.data.images;
        if (images && images.length) {
            carousel = {
                xtype: 'carousel',
                height: '13em',
                items: []
            };

            for (i = 0; i < images.length; ++i) {
                carousel.items.push({
                    html: '<div style="text-align:center;"><img style="max-height:13em;max-width:100%;" src="http://littlefreelibrary.force.com/servlet/servlet.FileDownload?file='
                        + images[i] + '" /></div>',
                    style: 'height: 100%;'
                });
            }
            items.unshift(carousel);
        }

        me.callParent();

        me.add(items);
    }
});
