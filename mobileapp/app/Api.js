
Ext.define("App.Api", {
    alternateClassName: 'Api',
    extend: "Ext.util.Observable",
    singleton: true,
    sessionRetry: 0,
    requires: [
      'Ext.device.Connection', 'Ext.Ajax'
    ],

    apiKey: 'f8217d70e0640dacbcf3ad79022ea058',
    booksApiKey: 'AIzaSyAeHxBXKSU2iAQf4kUiI-PYo3ZhMb-_bpM',

    request: function (options, successCallback, failureCallback, networkFailureCallback) {
        //var baseApiUri = this.baseUri();
        var url = options.rest;//(options.baseUri || baseApiUri) + options.rest;
        options.url = url;
        options.scope = (options.scope || this);

        Ext.applyIf(options, {
            dataType: 'json'
        });
        var headers = {};
        if (options.headers) {
            headers = options.headers;
        }
        Ext.apply(options, {
            timeout: 30000,
            headers: headers,
            success: function (xhr, options) {
                var response = xhr.responseText;
                if (options.dataType == "json" && response != "") {
                    response = Ext.decode(response);
                }
                if (response.error) {
                    if (failureCallback) {
                        failureCallback.call(options.scope, xhr, options);
                    }
                }
                else {
                    if (successCallback) {
                        successCallback.call(options.scope, response, xhr, options);
                    }
                }
            },
            failure: function (xhr, options) {
                console.log('request failure: error code : ' + xhr.status);
                //if ((Ext.Ajax.sessionRetry === 0) || (Ext.Ajax.sessionRetry > 2) || !Ext.Ajax.sessionRetry) {
                if (App.Api.sessionRetry > 1 || xhr.status !== 401) {
                    failureCallback.call(options.scope, xhr, options);
                }
            },
            disableCaching: false
        });

        var offline = !Ext.device.Connection.isOnline();

        if (offline) {
            Ext.toast('Network Required<br/>Make sure you have wireless connectivity and try again.', 2000);
            Util.hideBusy();
            failureCallback.call(options.scope, null, options);
        }
        else {
            Ext.Ajax.request(options);
        }
    },

    _get: function (rest, successCallback, errorCallback, scope, options) {
        this.request(Ext.apply({}, {
            rest: rest,
            method: 'GET',
            scope: scope
        }, options),
        successCallback,
        errorCallback);
    },

    _post: function (rest, postData, successCallback, errorCallback, scope, options) {
        this.request(Ext.apply({}, {
            rest: rest,
            method: 'POST',
            scope: scope,
            jsonData: postData
        }, options), successCallback, errorCallback);
    },

    _put: function (rest, postData, successCallback, errorCallback, scope, options) {

        this.request(Ext.apply({}, {
            rest: rest,
            method: 'PUT',
            scope: scope,
            jsonData: postData
        }, options), successCallback, errorCallback);

        //this.request({
        //    rest: rest,
        //    method: 'PUT',
        //    scope: scope,
        //    jsonData: postData
        //},
        //successCallback,
        //errorCallback);
    },

    _delete: function (rest, postData, successCallback, errorCallback, scope) {
        this.request({
            rest: rest,
            method: 'DELETE',
            scope: scope
        },
        successCallback,
        errorCallback);
    },
    isError: function (response) {
        if ((response.status != 401) || (response.status == 401) && (App.Api.sessionRetry != 1)) {
            return true;
        }
    },

    
    doM2X: function (url, postData, successCallback, failureCallback, scope) {        
        var options = { headers: { "X-M2X-KEY": this.apiKey } };
        this._put(url, postData, successCallback, failureCallback, scope, options);
    },

    doM2XGet: function (url, successCallback, failureCallback, scope) {
        var options = { headers: { "X-M2X-KEY": this.apiKey } };
        this._get(url, successCallback, failureCallback, scope, options);
    },

    doGBooks: function (method, url, successCallback, failureCallback, scope) {
        this['_' + method](url + '&key=' + this.booksApiKey, successCallback, failureCallback, scope);
    },

    getBooksByLatLng: function (lat, lng, successCallback, failureCallback, scope) {
        this.doM2XGet('https://api-m2x.att.com/v2/devices/search?tags=Check%20In&latitude=' + lat + '&longitude=' + lng + '&distance=0.5&distance_unit=mi', successCallback, failureCallback, scope);
    },

    searchBooks:function(isbn, successCallback, failureCallback, scope) {
        this.doM2XGet('https://api-m2x.att.com/v2/devices/search?tags=Check%20In&serial=' + isbn, successCallback, failureCallback, scope);

    },

    queryBooks: function(q, success, failure, scope) {
        this.doGBooks('get', 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(q), success, failure, scope)
    },

    updateBookLocation: function (deviceId, name, lat, lng, successCallback, failureCallback, scope) {
        var postData = { "name": name, "latitude": lat, "longitude": lng};// "elevation": 0 };
        this.doM2X('https://api-m2x.att.com/v2/devices/' + deviceId + '/location', postData, successCallback, failureCallback, scope);
        
    },

    updateDevice: function (deviceId, name, tags, successCallback, failureCallback, scope) {
        var postData = { "name": name, "tags": tags, "visibility": "private" };
        this.doM2X('https://api-m2x.att.com/v2/devices/' + deviceId, postData, successCallback, failureCallback, scope);
    },

    checkIn:function(deviceId, name, lat, lng, successCallback, failureCallback,scope) {        
        var postData = { "value": 0 };
        this.updateDevice(deviceId, name, 'Check In', null, null, null);
        this.updateBookLocation(deviceId, name, lat, lng, null, null, null);
        this.doM2X('https://api-m2x.att.com/v2/devices/' + deviceId + '/streams/status/value', postData, successCallback, failureCallback, scope);

    },

    checkOut: function (deviceId, name, successCallback, failureCallback,scope) {        
        var postData = { "value": 1 };
        this.doM2X('https://api-m2x.att.com/v2/devices/' + deviceId + '/streams/status/value', postData, successCallback, failureCallback, scope);
        this.updateDevice(deviceId, name, 'Check Out', null, null, null);
    },

    searchISBN:function(book, successCallback, failureCallback, scope) {
        var url = 'http://isbndb.com/api/v2/json/8ZN7DBWN/books?q=' + book
        this._get(url, successCallback, failureCallback, scope);
    },
    

    getLibraries: function (lat, lng, successCallback, failureCallback, scope) {
        var body = {
            "action": "MapPageController",
            "method": "remoteSearch",
            "data": ["10", "NearMe", lat, lng],
            "type": "rpc",
            "tid": 2,
            "ctx": { "csrf": "VmpFPSxNakF4TlMweE1DMHdPRlF3TWpvME1UbzBNeTR3TVRCYSxGWHdFLFpUTmhZelkw", "vid": "066d00000027Meh", "ns": "", "ver": 29 }
        };
        if (Ext.browser.is.PhoneGap) {
            // LFL Salesforce call doesn't' work on the device :-(
            Ext.Function.defer(function (successCallback, failureCallback, scope) {
                this._get('resources/data.json', successCallback, failureCallback, scope);
            }, 2000, this, [successCallback, failureCallback, scope]);

        }
        else {
            this._post('http://littlefreelibrary.force.com/apexremote', body, successCallback, failureCallback, scope, { dataType: 'json' });
        }
    }
   
   
});
