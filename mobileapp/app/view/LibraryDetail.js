Ext.define('App.view.LibraryDetail', {
    extend: 'Ext.tab.Panel',
    xtype: 'librarydetail',

    config: {
        title: 'Details',
        back: true,
        scrollable: true,
        tpl: [
        '<div class="libraryinfo">',
            '{Library_Name__c}<br/>',
            '<tpl if="attachment1""><img style="width:50%;" src="http://littlefreelibrary.force.com/servlet/servlet.FileDownload?file={attachment1}" /></tpl>',
            '<br/><br/>',
            '{Street__c}<br/>',
            '{City__c}, {State_Province_Region__c} {Postal_Zip_Code__c}<br/>',
            '<br/>{Library_Story__c}',
            //'<tpl if="LastAuditedBy != null"><br/><br/>Last Audit: {LastAuditDate:date("F j, Y")}<br/>By {LastAuditedBy}<br/></tpl>',
            '<br/>',
         '</div>'
        ]
    }
});
