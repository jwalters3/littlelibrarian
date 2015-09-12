// Overriding Sencha's default load mask with custom one for GP

Ext.define('App.override.LoadMask', {
    override: 'Ext.LoadMask',

    getTemplate: function () {
        var prefix = Ext.baseCSSPrefix;

        return [
            {
                //it needs an inner so it can be centered within the mask, and have a background
                reference: 'innerElement',
                cls: prefix + 'mask-inner',
                children: [
                    //the elements required for the CSS loading {@link #indicator}
                    {
                        reference: 'indicatorElement',
                        cls: prefix + 'loading-spinner-outer',
                        children: [
                            {                                
                                children: [{
                                    cls: 'loader',
                                    children: [
                                        { tag: 'div', cls: 'side' },
                                        { tag: 'div', cls: 'side' },
                                        { tag: 'div', cls: 'side' },
                                        { tag: 'div', cls: 'side' },
                                        { tag: 'div', cls: 'side' },
                                        { tag: 'div', cls: 'side' },
                                        { tag: 'div', cls: 'side' },
                                        { tag: 'div', cls: 'side' }
                                    ]
                                }, { cls: 'logo' }]
                            }
                        ]
                    },
                    //the element used to display the {@link #message}
                    {
                        reference: 'messageElement'
                    }
                ]
            }
        ];
    }

});