
Ext.define('App.controller.Map', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Panel'],

    mapMarkers: [],
    gpsMarker: null,
    dragTimer: 0,
    selectedLibrary: null,
    initialized: false,
    config: {
        refs: {
            nav: {
                selector: '[xtype="nav"]'
            },           
            map: {
                xtype: 'map',
                selector: 'map'
            },           
            locateButton: {
                selector: '[action="locate"]'
            },
            checkedOutButton: {
                selector: '[action="books"]'
            },
            bookButton: {
                selector: '[action="seebooks"]'
            }
        },
        control: {
            map: {
                centerchange: 'onMapPan',
                activate: 'onMapActivate',
                maprender: 'onMapRender',
                zoomchange: 'onMapZoomChange',
                painted: 'initMap'
            },           
            bookButton: {
                tap: 'onBookButtonTap'
            },
            locateButton: {
                tap: 'locateUser'
            },          
            nav: {
                push: 'onNavChange',
                pop: 'onNavChange'
            }
        }
    },
    libraryTpl: [
        '<div class="libraryinfo">',
            '<p>{Library_Name__c}</p>',
            '<p>{Street__c}</p>',
            '<p>{City__c}, {State_Province_Region__c} {Postal_Zip_Code__c}</p>',
            '<div>',
                '{[values.images.length ? "<img style=\'width:50%;\' src=\'http://littlefreelibrary.force.com/servlet/servlet.FileDownload?file=" + values.images[0] + "\' />" : "" ]}',
            '</div>',
         '</div>'
    ],

  
    onNavChange: function (navview, view, e) {
        // Hide the settings button when you're not on the campaign screen        
        //if (navview.down('#checkin')) {
        //    navview.down('#checkin').setHidden(true);
        //}
        this.toggleCheckIn();
    },

    toggleCheckIn: function () {

        var store = Ext.getStore("CheckedOut");
        var button = this.getNav().down("#checkin");
        if (store.getCount() > 0) {
            button.setHidden(false);
            //button.setBadgeText(store.getCount());
        } else {
            button.setHidden(true);
        }

    },
    onBookButtonTap: function () {      
        this.libraryPanel.hide();
        this.getApplication().getController('Library').showLibrary(this.selectedLibrary);
        this.selectedLibrary = null;
    },
    onBooksLoaded:function(response) {
        var devices = response.devices;
        var store = Ext.getStore("Book");
        for (i = 0; i < devices.length; i++) {

            var book = Ext.create('App.model.Book', {
                name: devices[i].name,
                id: devices[i].id,
                isbn: devices[i].serial,
                latitude: devices[i].location.latitude,
                longitude: devices[i].location.longitude,
                status: devices[i].tags[0]               
            });
            store.add(book);
        }
        console.log(store);
    },

    showLibrary: function (marker, pos) {

        var lat = pos.latLng.lat(); // lat of click
        var lng = pos.latLng.lng(); // lng of click

        if (!this.libraryPanel) {
            this.libraryPanel = Ext.create('Ext.Sheet', {           
                centered: true,
                //height: 240,
                modal: true,
                layout: {
                    type: 'auto',
                    align: 'middle',
                    pack: 'center'
                },
                hideOnMaskTap: true,
                padding: 10,
                items: [{ itemId: 'libraryPanel',
                    xtype: 'panel',
                    tpl: this.libraryTpl
                }, {
                    xtype:'spacer',
                    height: 20
                },{
                    xtype: 'button',
                    ui: 'green-round',
                    action: 'seebooks',
                    align: 'bottom',
                    height: '60',
                    text: 'Details'
                }]
            });
            this.libraryPanel.on('hide', function () {
                this.selectedLibrary = null;
            }, this);
            Ext.Viewport.add(this.libraryPanel);
            this.libraryTpl = new Ext.XTemplate(this.libraryTpl);
        }
        this.selectedLibrary = marker.record;
        this.libraryPanel.down('#libraryPanel').setData(marker.record);
        this.libraryPanel.show();

    },
    getDistance: function (p1lat, p1long, p2lat, p2long) {
        var rad = function (x) {
            return x * Math.PI / 180;
        };
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2lat - p1lat);
        var dLong = rad(p2long - p1long);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1lat)) * Math.cos(rad(p2lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        //console.log('distance change is ' + d);
        return d; // returns the distance in meter
    },
    onMapPan: function (map, gmap, coords, eopts) {

        if ((this.selectedLibrary == null) && (this.initialized)) {
            
            
            if (this.dragTimer) {
                clearTimeout(this.dragTimer);
                this.dragTimer = 0;

            }
            this.dragTimer = setTimeout(function () {
                var me = App.app.getController('Map');
                var distance = me.getDistance(coords.lat(), coords.lng(), me.currentLat, me.currentLong);
                console.log(distance);
                if (distance > 15000) { //this.campaign.get('distance')) {
                    me.initLibraries(coords.lat(), coords.lng());
                    Util.setValue('latitude', coords.lat());
                    Util.setValue('longitude', coords.lng());
                    me.currentLat = coords.lat();
                    me.currentLong = coords.lng();
                }
            }, 250);            
        }
    },

    locateUser: function () {
        console.log("locateUser");
        Util.showBusy('Locating You...');
        var geo = Ext.create('Ext.util.Geolocation', {
            autoUpdate: false,
            listeners: {
                locationupdate: {
                    scope: this,
                    fn: function (geo) {
                       // console.log("locationupdate");
                        Util.hideBusy();
                        this.currentLat = geo.getLatitude();
                        this.currentLong = geo.getLongitude();
                        console.log("current location: " + this.currentLat + ' ' + this.currentLong);
                        Util.setValue('latitude', this.currentLat);
                        Util.setValue('longitude', this.currentLong);
                        var mapPanel = this.getMap();
                        var gMap = mapPanel.getMap();
                        if (this.gpsMarker != null) {
                            this.gpsMarker.setMap(null);
                        }
                        this.gpsMarker = new google.maps.Marker({
                            map: gMap,
                            animation: google.maps.Animation.DROP,
                            position: new google.maps.LatLng(this.currentLat, this.currentLong),
                            icon: 'resources/images/point.png'
                        });
                        
                        var marker = this.gpsMarker;
                        Ext.defer(function () {
                            gMap.panTo(marker.getPosition());
                            this.initialized = true;
                        }, 100, this);

                        var currentZoom = Util.getValue('zoom', 12);                       
                        this.refreshLibraries();
                    }

                },
                locationerror: {
                    scope: this,
                    fn: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                        Util.hideBusy();
                        this.refreshLibraries();
                        if (bTimeout)
                            Ext.Msg.alert('Timeout occurred', "Could not get current position");
                        else
                            Ext.Msg.alert('Could not get Location', "Make sure you have Location services turned on.");
                    }
                }
            }
        });
        geo.updateLocation();

    },
    onMapActivate: function () {

        console.log("initMap");
        this.initialized = false;
        var mapPanel = this.getMap();
        this.currentLat = Util.getValue('latitude', 33.7574702);
        this.currentLong = Util.getValue('longitude', -84.3872952);
        var currentZoom = Util.getValue('zoom', 12);      
        
        mapPanel.setMapOptions({
            center: new google.maps.LatLng(this.currentLat, this.currentLong),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: parseInt(currentZoom)
        });
       
        
    },
    onMapZoomChange:function(map, gmap, zoomlevel) {
        Util.setValue('zoom', zoomlevel);
    },
    onMapRender: function() {
        this.locateUser();
        this.toggleCheckIn();
    },
    initMap: function () {
        var mapPanel = this.getMap(); // down('map');
        var gMap = this.getMap();
        if (gMap == null) {
            Ext.Function.defer(this.initMap, 350, this);
        } else {
            // ready to start calling google map methods
            var currentLat = Util.getValue('latitude', 33.7574702);
            var currentLng = Util.getValue('longitude', -84.3872952);
            var currentZoom = Util.getValue('zoom', 12);
            this.currentLat = currentLat;
            this.currentLong = currentLng;
            // drop map marker
            console.log("initMap");
            mapPanel.setMapOptions({
                center: new google.maps.LatLng(currentLat, currentLng),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: parseInt(currentZoom)
            });
            mapPanel.on('zoomchange', function (map, gmap, zoomlevel) {
                Util.setValue('zoom', zoomlevel);
            });
            this.locateUser();           
        }
    },
   
    refreshLibraries: function () {
        this.initLibraries(this.currentLat, this.currentLong);        
    },
    
   
    initLibraries: function (currentLat, currentLng) {
        
            Util.showBusy('Finding Libraries in your area...');
          
            Api.getLibraries(currentLat, currentLng, this.libraryLoaded, this.libraryLoadError, this);
          
        
    },
    libraryLoadError:function(response) {
        Util.hideBusy();
        Ext.Msg.alert('Error', response.statusText);
    },
    libraryLoaded: function (response) {
        var me = App.app.getController('Map');
        me.clearMarkers();
        var records = response[0].result;
        var mapPanel = me.getMap(); // down('map');
        var gMap = mapPanel.getMap();
        for (i = 0; i < records.length; i++) {
            var s = records[i].library,
                attachments = [], prop;

            for (prop in records[i]) {
                
                if (prop.substr(0, 10) == 'attachment') {
                    attachments.push(records[i][prop]);
                }
            }
            s.images = attachments;
            
            var marker = new google.maps.Marker({
                map: gMap,
                //animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(s.Library_Geolocation__c.latitude, s.Library_Geolocation__c.longitude),
                icon: 'resources/images/library.png',
                record: s
            });
            google.maps.event.addListener(marker, 'click', function (pos) {

                me.showLibrary.call(me, this, pos);
            });
            me.mapMarkers.push(marker);
        }
        Util.hideBusy();
    },
    clearMarkers: function () {
        for (var i = 0; i < this.mapMarkers.length; i++) {
            this.mapMarkers[i].setMap(null);
        }
    }
    
});