/**
 * Created by jason on 1/7/16.
 */

/**
 * Wechat JS SDK
 * @see http://mp.weixin.qq.com/wiki/11/74ad127cc054f6b80759c40f77ec03db.html
 */
  
var angular = require('angular');
  
var wechat = angular.module('wechat', [
    require('./utils')
  ]
);

wechat.factory("wechat", ['utils', '$http', function (utils, $http) {
  var urlParams = utils.getUrlParams();
  console.log(urlParams);
  var debug = "true" === urlParams.debug,
    signFinished = false;
  var refreshCounter = 0;
  var WechatService = {};

  WechatService.appInfo = "undefined" === typeof _wechat_config ? {} : _wechat_config;
  WechatService.pageSignature = "undefined" === typeof _wechat_signature ? null : _wechat_signature;
  //set default share config
  WechatService.shareOnTimelineConfig = {
    title: document.title,
    link: location.href,
    type: 'link',
    imgUrl: location.origin + '/public/img/logo.png'
  };
  WechatService.shareOnChatConfig = angular.extend({
    desc: document.title
  }, WechatService.shareOnTimelineConfig);

  //console.log(WechatService.pageSignature);
  WechatService.checkIfUrlMatch = function () {
    //console.log("match: ", WechatService.pageSignature.url.indexOf(location.protocol));
    return WechatService.pageSignature && WechatService.pageSignature.url && WechatService.pageSignature.url.indexOf(location.protocol) === 0;
  };
  WechatService.genNewSignature = function (forceTicketUpdate) {
    forceTicketUpdate && refreshCounter++;
    $http.get("/wechat/get-signature", {
      params: {
        https: location.protocol.indexOf("https") === 0,
        force: !!forceTicketUpdate && refreshCounter < 2,
        host: location.origin,
        path: location.pathname + location.search
      }
    }).then(function (response) {
      console.log("new signature:", response.data);
      WechatService.pageSignature = response.data;
      debug && alert(JSON.stringify(WechatService.pageSignature));
      WechatService.initWechatSK();
    });
  };
  WechatService.initSignature = function () {
    if (WechatService.checkIfUrlMatch()) {
      console.log("signature received...");
      debug && alert("signature received...");
      WechatService.initWechatSK();
    } else {
      WechatService.genNewSignature();
    }
  };

  WechatService.initWechatSK = function () {
    var config = {
      appId: WechatService.appInfo.appId,
      timestamp: WechatService.pageSignature.timestamp,
      nonceStr: WechatService.pageSignature.nonceStr,
      signature: WechatService.pageSignature.signature,
      jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "closeWindow", "showOptionMenu", "scanQRCode"]
    };
    if(debug) {
      config.debug = true;
    }
    if("undefined" === typeof wx) {
      console.warn("wechat js not defined");
      return;
    }
    wx.config(config);
    wx.ready(function () {
      console.log("sign signature finished....");
      debug && alert("sign signature finished....");
      wx.onMenuShareTimeline(WechatService.shareOnTimelineConfig);
      wx.onMenuShareAppMessage(WechatService.shareOnChatConfig);
      signFinished = true;
      //var event = new Event("wechatReady");
      //document.dispatchEvent(event);
    });

    wx.error(function (err) {
      debug && alert(err ? 'fucking err: ' + JSON.stringify(err) : "ok");
      WechatService.genNewSignature(true);
    });
  };

  WechatService.setShareOnChatConfig = function (info) {
    info && angular.extend(WechatService.shareOnChatConfig, info);
  };

  WechatService.setShareOnTimelineConfig = function (info) {
    info && angular.extend(WechatService.shareOnTimelineConfig, info);
  };

  WechatService.setShareConfig = function (chat, timelime) {
    WechatService.setShareOnChatConfig(chat);
    WechatService.setShareOnTimelineConfig(timelime);
  };

  WechatService.openOptionMenu = function() {
    wx.showOptionMenu();
  };

  WechatService.closeWindow = function() {
    wx.closeWindow();
  };
  WechatService.scanQRCode = function() {
    if(!signFinished) {
      //message.info('尚未验证微信JSSDK, 请联系程序猿小哥<i class="emoji emoji-monkey"></i>');
      return false;
    }
    wx.scanQRCode({
      needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        //console.log(res);
        //alert(JSON.stringify(res));
        //var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
      }
    });
  };

  if(WechatService.appInfo && WechatService.appInfo.enable) {
    var ele = document.createElement('script');
    ele.src = location.protocol + '//res.wx.qq.com/open/js/jweixin-1.0.0.js';
    ele.async = true;
    var linkEle = document.getElementsByTagName('script')[0];
    linkEle.parentNode.insertBefore(ele, linkEle);
    ele.onload = function() {
      console.log('script loaded');
      //init the wechat config
      WechatService.initSignature();
    };
  }

  return WechatService;
}]);

module.exports = 'wechat';
