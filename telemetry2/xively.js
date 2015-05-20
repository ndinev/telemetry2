/*! xively-js v1.0.4 | Copyright Xively (LogMeIn Inc.) | BSD 3-Clause license */
(function() {
    "use strict";
    var t = this,
        e = t.jQuery || t.Zepto || t.ender || t.$,
        s = function() {
            return "https:" === document.location.protocol ? "https:" : "http:"
        },
        n = function(t) {
            var n = this,
                a = !1,
                i = !1,
                o = [],
                r = function(t) {
                    if ("function" == typeof t) t.apply(this, Array.prototype.slice.call(arguments, 1));
                    else if ("[object Array]" === Object.prototype.toString.apply(t))
                        for (var e = t.length; e--;) t[e].apply(this, Array.prototype.slice.call(arguments, 1))
                };
            this.connect = function(u) {
                var c, d, l = window.SockJS || window.MozWebSocket || window.WebSocket;
                !a && l && (window.SockJS ? (d = "https:" === s() ? 8093 : 8082, c = s() + "//" + t + ":" + d + "/sockjs") : (d = "https:" === s() ? 8094 : 8080, c = ("https:" === s() ? "wss:" : "ws:") + "//" + t + ":" + d), a = new l(c), a.onerror = function(t) {
                    n.error && n.error(t, this), n.connect()
                }, a.onclose = function(t) {
                    n.close && n.close(t, this), n.connect()
                }, a.onopen = function(t) {
                    i = !0, n.open && n.open(t, this), o.length && r(o), u && u(this)
                }, a.onmessage = function(t) {
                    var s = t.data,
                        n = JSON.parse(s);
                    n.body && e("body").trigger("xively." + n.resource, n.body)
                })
            }, this.send = function(t) {
                i ? a.send(t) : (this.connect(), o.push(function() {
                    a.send(t)
                }))
            }
        },
        a = function(t) {
            t = t || "api.xively.com";
            var a, i = this,
                o = "1.0.4",
                r = s() + "//" + t + "/v2",
                u = !1,
                c = function(t) {
                    window.console && window.console.log && window.console.log(t)
                },
                d = function(t) {
                    var s = e.extend({
                        type: "get"
                    }, t);
                    if (!a) return c("(xivelyJS) ::: No API key ::: Set your API key first with xively.setKey( YOUR_API_KEY ) before using any methods. Check docs for more info.");
                    if (s.url) {
                        if (s.type = s.type.toUpperCase(), "PUT" === s.type || "POST" === s.type) {
                            if (!s.data || "object" != typeof s.data) return;
                            s.data = JSON.stringify(s.data)
                        }
                        e.ajax({
                            url: s.url,
                            type: s.type,
                            headers: {
                                "X-ApiKey": a,
                                "Content-Type": "application/json"
                            },
                            data: s.data,
                            crossDomain: !0,
                            dataType: "json",
                            cache: u
                        }).done(s.done).fail(s.fail).always(s.always)
                    }
                },
                l = [];
            return e.ajaxSetup({
                cache: u
            }), this.socket = function() {
                return this._ws ? this._ws : this._ws = new n(t)
            }, this.version = function() {
                return o
            }, this.setKey = function(t) {
                a = t
            }, this.apiEndpoint = r, this.request = d, this.subscribe = function(t, s) {
                var n = '{"headers":{"X-ApiKey":"' + a + '"}, "method":"subscribe", "resource":"' + t + '"}';
                return a ? (0 > l.indexOf(t) && (l.push(t), this.socket().send(n)), s && "function" == typeof s && e(document).on("xively." + t, s), void 0) : c("(xivelyJS) ::: No API key ::: Set your API key first with xively.setKey( YOUR_API_KEY ) before using any methods. Check docs for more info.")
            }, this.unsubscribe = function(t) {
                if (!a) return c("(xivelyJS) ::: No API key ::: Set your API key first with xively.setKey( YOUR_API_KEY ) before using any methods. Check docs for more info.");
                var e = l.indexOf(t);
                e >= 0 && (l.splice(e, 1), this.socket().send('{"headers":{"X-ApiKey":"' + a + '"}, "method":"unsubscribe", "resource":"' + t + '"}'))
            }, this.live = function(t, s) {
                var n = function(n, a) {
                    var i = n.current_value ? n : a;
                    i.current_value && e(t).each(function() {
                        e(this).html(i.current_value).attr("data-xively-resource", s)
                    })
                };
                d({
                    url: r + s,
                    always: n
                }), this.subscribe(s, n)
            }, this.stop = function(t) {
                this.unsubscribe(e(t).first().attr("data-xively-resource"))
            }, this.feed = {
                get: function(t, e) {
                    d({
                        url: r + "/feeds/" + t,
                        always: e
                    })
                },
                update: function(t, e, s) {
                    d({
                        type: "put",
                        url: r + "/feeds/" + t + ".json",
                        data: e,
                        always: s
                    })
                },
                "new": function(t, e) {
                    d({
                        type: "post",
                        url: r + "/feeds",
                        data: t,
                        always: e
                    })
                },
                "delete": function(t, e) {
                    d({
                        type: "delete",
                        url: r + "/feeds/" + t,
                        always: e
                    })
                },
                history: function(t, e, s) {
                    d({
                        url: r + "/feeds/" + t + ".json",
                        data: e,
                        always: s
                    })
                },
                list: function(t, e) {
                    d({
                        url: r + "/feeds",
                        data: t,
                        always: e
                    })
                },
                subscribe: function(t, e) {
                    t && i.subscribe("/feeds/" + t, e)
                },
                unsubscribe: function(t) {
                    t && i.unsubscribe("/feeds/" + t)
                }
            }, this.datastream = {
                get: function(t, e, s) {
                    d({
                        url: r + "/feeds/" + t + "/datastreams/" + e + ".json",
                        always: s
                    })
                },
                update: function(t, e, s, n) {
                    d({
                        type: "put",
                        url: r + "/feeds/" + t + "/datastreams/" + e + ".json",
                        data: s,
                        always: n
                    })
                },
                "new": function(t, e, s) {
                    d({
                        type: "post",
                        url: r + "/feeds/" + t + "/datastreams",
                        data: e,
                        always: s
                    })
                },
                "delete": function(t, e, s) {
                    d({
                        type: "delete",
                        url: r + "/feeds/" + t + "/datastreams/" + e,
                        always: s
                    })
                },
                history: function(t, e, s, n) {
                    d({
                        url: r + "/feeds/" + t + "/datastreams/" + e + ".json",
                        data: s,
                        always: n
                    })
                },
                list: function(t, e) {
                    d({
                        url: r + "/feeds/" + t + ".json",
                        always: function(t) {
                            e.call(this, t.datastreams)
                        }
                    })
                },
                subscribe: function(t, e, s) {
                    t && e && i.subscribe("/feeds/" + t + "/datastreams/" + e, s)
                },
                unsubscribe: function(t, e) {
                    t && e && i.unsubscribe("/feeds/" + t + "/datastreams/" + e)
                },
                live: function(t, e, s) {
                    t && e && s && i.live(t, "/feeds/" + e + "/datastreams/" + s)
                },
                stop: function(t) {
                    t && i.stop(t)
                }
            }, this.datapoint = {
                get: function(t, e, s, n) {
                    d({
                        url: r + "/feeds/" + t + "/datastreams/" + e + "/datapoints/" + s,
                        always: n
                    })
                },
                update: function(t, e, s, n, a) {
                    d({
                        type: "put",
                        url: r + "/feeds/" + t + "/datastreams/" + e + "/datapoints/" + s,
                        data: {
                            value: n
                        },
                        always: a
                    })
                },
                "new": function(t, e, s, n) {
                    d({
                        type: "post",
                        url: r + "/feeds/" + t + "/datastreams/" + e + "/datapoints",
                        data: s,
                        always: n
                    })
                },
                "delete": function(t, e, s, n) {
                    var a = {
                        type: "delete",
                        always: n
                    };
                    "object" == typeof s ? (a.url = r + "/feeds/" + t + "/datastreams/" + e + "/datapoints", a.data = s) : a.url = r + "/feeds/" + t + "/datastreams/" + e + "/datapoints/" + s, d(a)
                },
                history: function(t, e, s, n) {
                    d({
                        url: r + "/feeds/" + t + "/datastreams/" + e + ".json",
                        data: s,
                        always: function(t) {
                            n.call(this, t.datapoints)
                        }
                    })
                }
            }, this._settings = function() {
                return {
                    apiKey: a,
                    apiHost: t,
                    cacheRequest: u
                }
            }, this
        };
    t.XivelyClient = a, t.xively = t.Xively = new a
}).call(this),
    function(t) {
        var e = function(t) {
                return "object" == typeof t ? "/feeds/" + t.feed + (t.datastream ? "/datastreams/" + t.datastream : "") : "string" == typeof t && "" !== t ? t : ""
            },
            s = {
                live: function(t) {
                    return xively.live(this, e(t)), this
                },
                get: function(s) {
                    var n = t(this);
                    return xively.request({
                        url: xively.apiEndpoint + e(s) + ".json",
                        always: function(e) {
                            n.each(function() {
                                t(this).html(e.current_value)
                            })
                        }
                    }), this
                },
                stop: function() {
                    return xively.stop(this), this
                }
            };
        t.fn.xively = function(e) {
            return s[e] ? s[e].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof e && e ? (t.error("Method " + e + " does not exist on jQuery.xively"), void 0) : s.init.apply(this, arguments)
        }
    }(jQuery);