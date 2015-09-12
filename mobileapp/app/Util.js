
Ext.define("App.Util", {
    extend: "Ext.util.Observable",
    alternateClassName: 'Util',
    singleton: true,
    token: null,

    setupDB:function() {
        this.db = new Firebase('https://sizzling-heat-7569.firebaseio.com/');
    },

    getValue: function (name, defaultValue) {
        var a = localStorage.getItem(name);
        return (a == null) ? defaultValue : a;
    },
    setValue: function (name, value) {
        localStorage.setItem(name, value);
    },
    removeEnv: function () {
        localStorage.removeItem("env");
    },
   

    getJson: function (key, defaultValue) {
        var json = localStorage.getItem(key);

        if (json) {
            return JSON.parse(json);
        }
        else {
            return defaultValue;
        }
    },

    setJson: function (key, value) {
        var json = JSON.stringify(value);
        localStorage.setItem(key, json);
    },

    showErrorMsg: function (errors, title) {
        var errorHtml = '';

        errors.each(function (item, index, length) {
            errorHtml += item.getMessage() + "<br />";
            return true;
        });

        Ext.Msg.alert(title ? title : 'Errors', errorHtml, Ext.emptyFn);
    },

    showBusy: function (message, el) {
        this.toMask = el || Ext.Viewport;

        this.toMask.setMasked({
            xtype: 'loadmask',
            message: message,
            zIndex: 99
        });
    },
    isPhoneGap: function () {
        return ((Ext.browser.is.PhoneGap)); // || (Ext.os.is.Desktop));
    },

    isMasked: function () {
        if ((this.toMask) && (this.toMask.getMasked())) {
            return !this.toMask.getMasked().isHidden();
        }
        return false;

    },
    hideBusy: function () {
        if (this.toMask) {
            this.toMask.unmask();
        }
    },

    openLinkInNewWindow: function (url) {
      if (Ext.browser.is.PhoneGap) {
            window.open(url, '_system', 'location=yes');
        }
        else {
            //awful hack to avoid pop-up blocking by smart phone browser.
            var link = Ext.getDom('linker'),
                clickevent = document.createEvent('Event');

            if (Ext.browser.is.PhoneGap) {
                link.href = url + "#phonegap=external";
            } else {
                link.href = url;
            }

            clickevent.initEvent('click', true, false);
            link.dispatchEvent(clickevent);
        }
    },
    parseGoogleBook: function (data) {
        if (data.volumeInfo.industryIdentifiers) {
            return Ext.create('App.model.Book', {
                name: data.volumeInfo.title,
                //id: data.id,
                isbn: data.volumeInfo.industryIdentifiers[0].identifier,
                description: data.volumeInfo.description,
                thumb: data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.smallThumbnail : null,
                author: data.volumeInfo.authors.join(', ')
            });
        }
    },
    parseM2XBook: function (data) {

        return Ext.create('App.model.Book', {
            name: data.name,
            id: data.id,
            isbn: data.serial,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            status: data.tags[0]
        });
    }
    
});
