
/**
 * Created by Gary on 2016/5/7.
 */

var native = require('../bootstrap');

native.factory('native', [
    'utils',
    '$cookies',
    'message',
    'api',
    'hybird',
    function (utils, $cookies, message, api, hybird) {
        var native = {};

        window.hybirdCallback = {
            callback: '',
            params: '',
            // app登录回调
            loginCallback: function (jsObj) {
                //0 :shibai   1 :chenggong
                var str = JSON.stringify(jsObj);
                //alert("str+++++++++++="+str);
                //alert("jsObj.result+++++++++++"+jsObj.result)
                if (!jsObj.result) {
                    // console.log("+++++++++window.backViewStatus+++++++"+window.backViewStatus)
                    window.backViewStatus = 'goHome';
                } else {
                    window.backViewStatus = 'goLogin';
                }
            },
            //获取设备信息回调
            deviceCallBack: function (jsObj) {
                api.updateClientId(jsObj.device_id);
                $cookies.put('clientId', jsObj.device_id, {path: '/', expires: new Date(2020, 0, 1)});
                native.appToken(hybirdCallback.callback, hybirdCallback.params);
            },
            //获取app token回调
            appTokenCallback: function (jsObj) {
                var time = 0;
                if (jsObj.resultCode == 1000) {
                    api.updateToken(jsObj.authCode);
                    $cookies.put('token', jsObj.authCode, {path: '/', expires: new Date(2020, 0, 1)});
                    if (this.callback) {
                        if (time > 3) return;
                        time++;

                        if (Array.isArray(this.callback)) {
                            for (var i = 0; i < this.callback.length; i++) {
                                this.callback[i]();
                            }
                        } else {
                            this.callback(this.params)
                        }
                    }
                    this.callback = null;
                    this.params = null;
                }
            },

            // 判断本地登录态回调
            getLoginStatusCallback: function (jsObj) {
                if (!jsObj.in) {
                    window.backViewStatus = '';
                    hybird.gotoLogin(false, 'hybirdCallback.loginCallback');
                } else {
                    hybird.getDeviceInfo('hybirdCallback.deviceCallBack');
                    window.backViewStatus = 'goLogin'
                }
            },
            // 页面show事件回调
            onWebViewShow: function () {
                native.getLoginStatus();
            }
        };

        /**
         * 从app获取token
         * @param apicallback
         * @param apiparams
         */
        native.appToken = function (apicallback, apiparams) {
            hybirdCallback.callback = apicallback;
            hybirdCallback.params = apiparams;
            if(utils.isProdMode()){
                hybird.applyToken("b7e32c29-f8df-447d-a9c0-92fdca3d91c4", "95a86df7-3572-479c-bef4-09c55380aa30", "password", "read,write,trust", 'hybirdCallback.appTokenCallback');
            }else{
                hybird.applyToken("f53927fd-8e7b-42a7-bc92-32cc8a7ddc96", "7456057b-ff80-43ea-93d1-a782aba16d58", "password", "read,write,trust", 'hybirdCallback.appTokenCallback');
            }
            // hybird.applyToken("b7e32c29-f8df-447d-a9c0-92fdca3d91c4", "95a86df7-3572-479c-bef4-09c55380aa30", "password", "read,write,trust", 'hybirdCallback.appTokenCallback');
            //hybird.applyToken("f53927fd-8e7b-42a7-bc92-32cc8a7ddc96", "7456057b-ff80-43ea-93d1-a782aba16d58", "password", "read,write,trust", 'hybirdCallback.appTokenCallback');
        };

        /**
         * 获取本地登录态
         * @param apicallback
         * @param apiparams
         */
        native.getLoginStatus = function (apicallback, apiparams) {
            hybirdCallback.callback = apicallback;
            hybirdCallback.params = apiparams;
            hybird.getLoginStatus('hybirdCallback.getLoginStatusCallback');
            //console.log("+++++apicallback+++++++"+apicallback);
            //console.log("+++++apiparams++++++"+apiparams);
        };

        /**
         * 跳转到理财页面
         */
        native.jumpToInvest = function () {
            hybird.gotoInvest('');
        };

        /**
         * 跳转到理财详情页面
         * @param productId 商品id；
         * @param productType 商品类型，0 是 定期，1 是 活期
         */
        native.jumpToInvestDetail = function (productId, productType) {
            var params = native.getDefaultUrlParams();
            params.forwardUrl =  "eifnative://app.eif.com/licai/index";
            params.isH5 = 0;
            params.tplParam = {productId: productId, productType: productType};
            hybird.openLink(params);
        };

        /**
         * 有两种作用
         * 1: native新启页面,并作url跳转
         * 2: 跳转到native页面
         * @param var1 url 或 UrlParams(#native.getDefaultUrlParams)
         */
        native.openLink = function (var1,var2) {
            var params = native.getDefaultUrlParams();
            if (typeof var1 == 'string') {
                params.forwardUrl = var1;
                params.h5Title = var2;
            } else if (typeof var1 == 'object') {
                angular.extend(params, var1);
            }
            var origin = (/^https?:\/\/[\w.]+(:\d+)?/i.exec(params.forwardUrl) ||[''])[0];
            params.safeDomain = origin;
            hybird.openLink(params);
        };

        /**
         * 获取openlink所需的默认对象
         * @returns {{forwardUrl: string, h5Title: string, isH5: number, isNativeBar: number, maxVersion: string, minVersion: string, needLogin: number, safeDomain: string, tplParam: string}}
         */
        native.getDefaultUrlParams = function () {
            return {
                forwardUrl: "",
                h5Title: "",
                isH5: 1,
                isNativeBar: 1,
                maxVersion: "9.0.0",
                minVersion: "1.0.0",
                needLogin: 0,
                safeDomain: "",
                tplParam: ""
            };
        }

        /**
         * 跳转到app首页
         */
        native.gotoAppHome = function () {
            var params = native.getDefaultUrlParams();
            params.forwardUrl = "eifnative://app.eif.com/home/home";
            params.isH5 = 0;
            hybird.openLink(params);
        };
        /**
         * 注册页面show事件
         */
        native.onWebViewShow = function () {
            hybird.on('show', '', 'hybirdCallback.onWebViewShow');
        }
        native.showLoading = function(){
            hybird.loading(1);
        };

        native.hideLoading = function(){
            hybird.loading(0);
        };
        return native;
    }])
;



