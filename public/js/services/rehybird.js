/**
 * Created by ken on 16/5/17.
 */
var app = require('../bootstrap');

app.factory('hybird', [function () {

    "use strict";

    var Westeros = {
        versions: function () {
            var u = navigator.userAgent;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };

    /**
     * Baes64 Encoding
     */
    var encoder = (function () {
        var Encoder = function () {
            /**
             * @return {number}
             */
            this.Dig2Dec = function (s) {
                var retV = 0;
                if (s.length == 4) {
                    for (var i = 0; i < 4; i++) {
                        retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
                    }
                    return retV;
                }
                return -1;
            };

            /**
             * @return {string}
             */
            this.Hex2Utf8 = function (s) {
                var retS = "";
                var tempS = "";
                var ss = "";
                if (s.length == 16) {
                    tempS = "1110" + s.substring(0, 4);
                    tempS += "10" + s.substring(4, 10);
                    tempS += "10" + s.substring(10, 16);
                    var sss = "0123456789ABCDEF";
                    for (var i = 0; i < 3; i++) {
                        retS += "%";
                        ss = tempS.substring(i * 8, (eval(i) + 1) * 8);


                        retS += sss.charAt(this.Dig2Dec(ss.substring(0, 4)));
                        retS += sss.charAt(this.Dig2Dec(ss.substring(4, 8)));
                    }
                    return retS;
                }
                return "";
            };

            /**
             * @return {string}
             */
            this.Dec2Dig = function (n1) {
                var s = "";
                var n2 = 0;
                for (var i = 0; i < 4; i++) {
                    n2 = Math.pow(2, 3 - i);
                    if (n1 >= n2) {
                        s += '1';
                        n1 = n1 - n2;
                    }
                    else
                        s += '0';

                }
                return s;
            };

            /**
             * @return {string}
             */
            this.Str2Hex = function (s) {
                var c = "";
                var n;
                var ss = "0123456789ABCDEF";
                var digS = "";
                for (var i = 0; i < s.length; i++) {
                    c = s.charAt(i);
                    n = ss.indexOf(c);
                    digS += this.Dec2Dig(eval(n));

                }
                //return value;
                return digS;
            };
        };

        /**
         * @return {string}
         */
        Encoder.prototype.EncodeUtf8 = function (s1) {
            // escape函数用于对除英文字母外的字符进行编码。如“Visit W3School!”->"Visit%20W3School%21"
            var s = escape(s1);
            var sa = s.split("%");//sa[1]=u6211
            var retV = "";
            if (sa[0] != "") {
                retV = sa[0];
            }
            for (var i = 1; i < sa.length; i++) {
                if (sa[i].substring(0, 1) == "u") {
                    retV += this.Hex2Utf8(this.Str2Hex(sa[i].substring(1, 5)));
                    if (sa[i].length >= 6) {
                        retV += sa[i].substring(5);
                    }
                }
                else retV += "%" + sa[i];
            }
            return retV;
        };

        return new Encoder();
    })();


    /**
     * The basic interface of native invocation.
     */


    function Snow() {
    };

    if (Westeros.versions.android) {
        Snow.prototype.invokeNative = function (args) {
            prompt('snow://' + JSON.stringify(args), '');
        };
    } else if (Westeros.versions.ios) {
        Snow.prototype.invokeNative = function (args) {
            var iFrame = document.createElement('iframe');
            iFrame.setAttribute('src', 'snow://' + JSON.stringify(args));
            document.documentElement.appendChild(iFrame);
            iFrame.parentNode.removeChild(iFrame);
            iFrame = null;
        };
    } else {
        Snow.prototype.invokeNative = function () {
            console.error('调用异常');
        };
    }

    var snow = new Snow();

    /**
     * The applicant interface.
     */

    var Ygritte = function () {
    };

    /**
     * System Log
     */
    Ygritte.prototype.log = function (content, type, callbackName) {
        var args = ['snow', 'log', callbackName || '', {
            'content': content,
            type: type
        }];
        snow.invokeNative(args);
    };

    /**
     * Close the H5 Page
     */
    Ygritte.prototype.closeWebView = function (callbackName) {
        var args = ['knowNothing', 'closeWebView', callbackName || '', {}];
        //this.log(JSON.stringify(args), 1);
        snow.invokeNative(args);
    };

    /**
     * Copy text to the system clipboard
     */
    Ygritte.prototype.copy = function (content, callbackName) {
        var args = ['snow', 'copy', callbackName || '', {content: content}];
        //this.log(JSON.stringify(args), 1);
        snow.invokeNative(args);
    };

    /**
     *
     * @param eventName - native event name
     * @param callbackName - the callback of the register action
     * @param registeredCallbackName - the callback to be registered
     */
    Ygritte.prototype.on = function (eventName, callbackName, registeredCallbackName) {
        var args = ['snow', 'on', callbackName || '', {
            event: eventName,
            callback: registeredCallbackName
        }];
        //this.log(JSON.stringify(args), 1);
        snow.invokeNative(args);
    };

    /**
     * Get User Login Status
     */
    Ygritte.prototype.getLoginStatus = function (callbackName) {
        if (!callbackName) {
            throw new Error('callback is required for getLoginStatus method');
        }

        var args = ['knowNothing', 'getLoginStatus', callbackName, {}];
        //this.log(JSON.stringify(args), 1);
        snow.invokeNative(args);
    };

    /**
     * Get Current User's Info
     * user info:{memberNo:string, hasBankCard:bool, realName:string, phoneNumber: string}
     */
    Ygritte.prototype.getUserInfo = function (callbackName) {
        if (!callbackName) {
            throw new Error('callback is required for getUserInfo method');
        }

        var args = ['knowNothing', 'getUserInfo', callbackName, {}];
        //this.log(JSON.stringify(args), 1);
        snow.invokeNative(args);
    };

    /**
     * Get Invitation Info
     * Invitation Info:
     * {invited: string 已邀请人数, commission: string 返佣}
     */
    Ygritte.prototype.getInvitationInfo = function (callbackName) {
        if (!callbackName) {
            throw new Error('callback is required for getInvitationInfo method');
        }

        var args = ['knowNothing', 'getInvitationInfo', callbackName, {}];
        //this.log(JSON.stringify(args), 1);
        snow.invokeNative(args);
    };

    /**
     * Go to Login
     */
    Ygritte.prototype.gotoLogin = function (dejavu, callbackName) {
        var args = ['knowNothing', 'gotoLogin', callbackName || '', {
            dejavu: !!dejavu
        }];
        //this.log(JSON.stringify(args), 1);
        snow.invokeNative(args);
    };

    /**
     * Go to Investment Home
     * @param callbackName
     */
    Ygritte.prototype.gotoInvest = function (callbackName) {
        var args = ['knowNothing', 'gotoInvest', callbackName || '', {}];
        //this.log(JSON.stringify(args), 1);
        snow.invokeNative(args);
    };

    /**
     * Get the share means
     * @param callbackName
     */
    Ygritte.prototype.getShareMeans = function (callbackName) {
        var args = ['knowNothing', 'getShareMeans', callbackName || '', {}];
        //this.log(JSON.stringify(args), 1);
        snow.invokeNative(args);
    };

    /**
     * share
     * title: Promotion title
     * text: Promotion detail
     * picName: pic/icon name
     * url: url of promotion page
     * shareMeans: Share Means
     * memberNo: Member No
     * callbackName: Callback Name params: {status: 0-成功，1-其他}
     */
    Ygritte.prototype.share = function (title, text, picName, url, shareMeans, memberNo, callbackName) {
        var args = ['knowNothing', 'share', callbackName || '', {
            title: Westeros.versions.ios ? encoder.EncodeUtf8(title) : title,
            text: Westeros.versions.ios ? encoder.EncodeUtf8(text) : text,
            picName: picName,
            url: Westeros.versions.ios ? encoder.EncodeUtf8(url) : url,
            shareMeans: shareMeans,
            memberNo: memberNo
        }];
        //this.log(JSON.stringify(args), 1);
        snow.invokeNative(args);
    };

    /**
     * Dial the phone number
     * @param phoneNum
     * @param callbackName - default null
     */
    Ygritte.prototype.dial = function (phoneNum, callbackName) {
        var args = ['snow', 'dial', callbackName || '', {phoneNum: phoneNum}];
        //this.log(JSON.stringify(args), 1);
        snow.invokeNative(args);
    };


    /**
     * Set web view title
     * @param title - web view title
     * @param callbackName - null
     */
    Ygritte.prototype.setTitle = function (title, callbackName) {
        title = title || '';
        if (title) {
            title = Westeros.versions.ios ? encoder.EncodeUtf8(title) : title;
        }

        var args = ['knowNothing', 'setTitle', callbackName || '', {title: title}];
        snow.invokeNative(args);
    };

    /**
     * Pop native dialog
     * @param title
     * @param remarks
     * @param buttons "{text: 按钮文字(string),highlight: 是否高亮(true/false),callbackName: 按钮点击的回调方法名(string)}"
     * @param callbackName
     */
    Ygritte.prototype.dialog = function (title, remarks, buttons, callbackName) {
        title = title || '';
        if (title) {
            title = Westeros.versions.ios ? encoder.EncodeUtf8(title) : title;
        }

        remarks = remarks || '';
        if (remarks) {
            remarks = Westeros.versions.ios ? encoder.EncodeUtf8(remarks) : remarks;
        }

        buttons.forEach(function (item) {
            item.text = item.text || '';
            item.text = Westeros.versions.ios ? encoder.EncodeUtf8(item.text) : item.text;
        });

        var args = ['knowNothing', 'dialog', callbackName || '', {
            title: title,
            remarks: remarks,
            buttons: buttons
        }];
        snow.invokeNative(args);
    };

    /**
     *  save the result of risk poll
     * @param result
     * @param callbackName
     */
    Ygritte.prototype.saveRiskPollResult = function (result, callbackName) {
        var args = ['knowNothing', 'saveRiskEvaluation', callbackName || '', {
            riskEvaluationResult: result
        }];
        snow.invokeNative(args);
    };

    /**
     * query the result of risk poll
     * @param callbackName
     */
    Ygritte.prototype.queryRiskPollResult = function (callbackName) {
        var args = ['knowNothing', 'queryRiskEvaluation', callbackName || '', {}];
        snow.invokeNative(args);
    };

    /**
     * Open Native Loading
     * @param type: {0: close, 1: open}
     * @param content: text shown when loading
     */
    Ygritte.prototype.loading = function (type, content) {
        content = content || '';
        if (content) {
            content = Westeros.versions.ios ? encoder.EncodeUtf8(content) : content;
        }

        var args = ['knowNothing', 'hudLoading', '', {type: type, content: content}];
        snow.invokeNative(args);
    };

    /**
     * Pop Native Toast
     * @param content: toast text
     */
    Ygritte.prototype.toast = function (content) {
        content = content || '';
        if (content) {
            content = Westeros.versions.ios ? encoder.EncodeUtf8(content) : content;
        }

        var args = ['knowNothing', 'toast', '', {content: content}];
        snow.invokeNative(args);
    };

    /**
     * Open Native or H5 page through the link data
     * @param linkData: info of the target page, refer to the AppTransition in MTP
     */
    Ygritte.prototype.openLink = function (linkData) {
        linkData.h5Title = linkData.h5Title || '';
        if (linkData.h5Title) {
            linkData.h5Title = Westeros.versions.ios ? encoder.EncodeUtf8(linkData.h5Title) : linkData.h5Title;
        }

        var args = ['knowNothing', 'openLink', '', {linkData: linkData}];
        snow.invokeNative(args);
    };

    /**
     * Apply for the Auth Token
     * @param appkey
     * @param appSecret
     * @param grant_type
     * @param scope
     * @param callbackName
     */
    Ygritte.prototype.applyToken = function(appkey, appSecret, grant_type, scope, callbackName){
        var args = ['knowNothing', 'applyToken', callbackName, {params: {
            appkey: appkey || '',
            appSecret: appSecret || '',
            grant_type: grant_type || '',
            scope: scope || ''
        }}]
        snow.invokeNative(args);
    };

    /**
     * Get Device Info through Native
     * @param callbackName
     */
    Ygritte.prototype.getDeviceInfo = function (callbackName) {
        var args = ['snow', 'getDeviceInfo', callbackName, {}];
        snow.invokeNative(args);
    };

    return new Ygritte();
}]);
