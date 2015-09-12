
Ext.define("App.Api", {
    alternateClassName: 'Api',
    extend: "Ext.util.Observable",
    singleton: true,
    sessionRetry: 0,
    requires: [
      'Ext.device.Connection', 'Ext.Ajax'
    ],


    request: function (options, successCallback, failureCallback, networkFailureCallback) {
        //var baseApiUri = this.baseUri();
        var url = options.rest;//(options.baseUri || baseApiUri) + options.rest;
        options.url = url;
        options.scope = (options.scope || this);

        Ext.applyIf(options, {
            dataType: 'json'
        });

        Ext.apply(options, {
            timeout: 30000,
            headers: {
            },
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
            disableCaching: true
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

    _put: function (rest, postData, successCallback, errorCallback, scope) {
        this.request({
            rest: rest,
            method: 'PUT',
            scope: scope,
            jsonData: postData
        },
        successCallback,
        errorCallback);
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

    getLibraries: function (lat, lng, successCallback, failureCallback, scope) {
        var body = {
            "action": "MapPageController",
            "method": "remoteSearch",
            "data": ["10", "NearMe", lat, lng],
            "type": "rpc",
            "tid": 2,
            "ctx": { "csrf": "VmpFPSxNakF4TlMweE1DMHdPRlF3TWpvME1UbzBNeTR3TVRCYSxGWHdFLFpUTmhZelkw", "vid": "066d00000027Meh", "ns": "", "ver": 29 }
        };
        this._post('http://littlefreelibrary.force.com/apexremote', body, successCallback, failureCallback, scope, {dataType:'json'});

    }
   
   
});
