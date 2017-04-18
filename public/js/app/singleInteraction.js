/**
 * Created by guminji on 2016/5/13.
 */
var app = require('../bootstrap');

app.controller('singleInteraction', ['$scope', 'api', '$http', 'message', 'utils', '$filter', 'native', function ($scope, api, $http, message, utils, $filter, native) {
    //native.showLoading();
    //初始化頁面
    $scope.initpage = function () {
        getPrivileged();
        getMatchDetail($scope.matchID);
    }

    //获取数据

    var URLParams = utils.getUrlParams();
    $scope.matchID = utils.getUrlParams().matchID;
    $scope.times = [10,20, 50, 100, 200,500];
    $scope.time = '10';
    $scope.price = 0;
    $scope.money = '';
    $scope.paymoney = 10;
    $scope.leagueName = "";
    $scope.selected = '';
    $scope.pbs =false;
    $scope.show = {
        footer: false,
        pay: true,
        inform: true,
        failinform: true,
        cover: true,
        unbet: false,
        head:true,
    }
    $scope.order= {
        game1:'',
        game3:'',
        game3_5:'',
        game4:'',

    }
    //數據分組
    $scope.allDetails = {};
    $scope.partDetails = {
        game4: [],
    };
    $scope.realDetails = {};
    $scope.Openinvest =function(){
        native.jumpToInvest();
    }
    var origin = location.origin;
    var link = [
        {
            'forwardUrl': origin + '/football/interaction',
            'isNativeBar': 1,
            'h5Title': '每日宝箱'
        },
        {
            'forwardUrl': origin + '/laba',
            'isNativeBar': 0
        },
        {
            'forwardUrl': origin + '/footballbet',
            'isNativeBar': 1
        },
        {
            'forwardUrl': origin + '/footballbet/my-bet',
            'isNativeBar': 1
        }
    ];
    $scope.openmyLink = function () {
        native.openLink(link[0]);
    };
    $scope.opendetail = function(){
        //window.location.href="my-join-bet"
         native.openLink(origin+'/football/my-join-bet','我的参与');
    }
    $scope.changeTime = function (y) {
        $scope.paymoney = 1 * $scope.time;
        $scope.price = parseInt($scope.selected.rate * 1 * $scope.time);
    };
    $scope.continue = function () {
        $scope.show.failinform = true;
        $scope.show.inform = true;
        $scope.show.cover = true;
        $scope.show.pay = true;
        $scope.show.footer=false;
        $scope.selected = '';
        $scope.pbs =false;

    };
    $scope.formDo = function (name) {
        //eval('$scope.'+name+'()');
        name();
        //$scope.formfunctions[name];
    };
    //出事化更多的数据
    function initDetails() {
        /*$scope.realDetails = $scope.allDetails;*/
        if ($scope.partDetails.game3) {
            $scope.realDetails.game3 = $scope.partDetails.game3;
        }
        if ($scope.allDetails.game4) {
            for (var i = 0; i < $scope.allDetails.game4.length; i++) {
                var obj = $scope.allDetails.game4[i];
                $scope.partDetails.game4[i] = [];
                if (obj.length > 10) {
                    for (var y = 0; y < 9; y++) {
                        $scope.partDetails.game4[i][y] = $scope.allDetails.game4[i][y];
                    }
                    $scope.partDetails.game4[i][9] = {
                        'title': '更多',
                        'rate': '',
                        'name': 'game4',
                        'second': i
                    };
                }
                else {
                    $scope.partDetails.game4[i] = $scope.allDetails.game4[i];
                }

            }
            $scope.realDetails.game4 = $scope.partDetails.game4;
        }
        var seconds = 1;
        for(var key in $scope.allDetails){
            //alert(key);
            $scope.order[key] = seconds;
            seconds++;
        }
        console.log($scope.partDetails);
        console.log($scope.allDetails);
        console.log($scope.realDetails);
    };

    //判斷分組
    $scope.switchGame = function (a) {
        console.log(a.indexOf('first_team_to_score'));
        console.log(a.indexOf('first_team_to_score'));
        console.log(a.indexOf('number_of_goals'));

        if(a.indexOf('first_team_to_score')>=0){
            return 'game1';
        }
        if(a.indexOf('number_of_goals')>=0){
            return 'game3';
        }
        if(a.indexOf('correct_score')>=0){
            return 'game4';
        }
        if(a.indexOf('halftime_fulltime')>=0){
            return 'game3_5';
        }
        /*switch (a) {
            case '90分钟内(含伤停补时)先得分的球队':
                return 'game1';
                break;
            case '':
                return 'game2';
                break;
            case '90分钟内(含伤停补时)两队的总进球数':
                return 'game3';
                break;
            case '90分钟内(含伤停补时)两队的比分':
                return 'game4';
                break;
        }*/
    }
    //獲取特權本金
    function getPrivileged() {
        /*var defaultConfig = {
         url: './hdf/uc/vcash?&X-Hdfax-AuthToken='+'4dcb882c-1556-4145-87ba-b8ffcbea152f'+'&X-Hdfax-ClientId='+'a799695e-f4f9-4cbc-928c-08404ac04b3eb96a37a2-7465-40f7-ab43-910c780fa2ff',
         //url:'/check/user',
         timeout: 20000, //20s
         //withCredentials: true,
         headers: {
         'X-Hdfax-AuthToken':'6884b4f2-4880-4df4-b676-4847ed868dd8',
         'X-Hdfax-ClientId':'59e604b6-4b17-4308-8f78-dee69bb6e06a450fea4b-be68-41e0-ae14-2c38a827a0b7'
         }
         };
         $http(defaultConfig).then(function(res){
         //console.log(res);
         console.log(res);
         if(res.data.code==20000){
         $scope.money = res.data.result.vcash;
         }
         if(api.tokenExpired(res.data.code)){
         console.log('bbb');
         native.appToken(getPrivileged);
         return false
         }
         },function(res){
         console.log("error");
         })*/
        api.uc.getUcash()
            .then(function (res) {
                //console.log(res);
                $scope.money = res.result.vcash;
            }, function (res) {
                native.appToken(getPrivileged);

            })
    }

    //判斷彈出信息
    $scope.Checkmoney = function () {
        //console.log($scope.money);
        //console.log($scope.paymoney);
        if ($scope.money < $scope.paymoney) {
            message.info('你的金額不足');
            return false;
        }
        else {
            return true;
        }

    }
    $scope.Checkmoneyd = function () {
        if ($scope.money < $scope.paymoney){
            return false;
        }
        else {
            return true;
        }

    }
    //确认购买信息
    $scope.initBetInformation = function () {
        return {
            "type": "0",
            "times": $scope.time,
            "betNum": 1,
            "matchInfos": [
                {
                    "matchId": $scope.matchID,
                    "homeTeam": $scope.result.homeTeam.teamName,
                    "guestTeam": $scope.result.guestTeam.teamName,
                    "entityPos": [
                        {
                            "id": $scope.selected.vid,
                            "title": $scope.selected.maintitle,
                            "oddVos": [
                                {
                                    "id": $scope.selected.oid,
                                    "title": $scope.selected.title,
                                    "rate": $scope.selected.rate
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
    //判断比赛状态
    function jugdeStatus() {
        if ($scope.status == '0') {
            $scope.show.head = false;
            $scope.matchdetail.beginTime = $filter('date')(new Date($scope.result.beginTime), 'MM-dd HH:mm');
            $scope.matchdetail.middleTitle = 'VS'
            return true;
        }
        if ($scope.status == '1') {
            $scope.matchdetail.beginTime = '进行中';
            $scope.matchdetail.middleTitle = $scope.result.homeScore + ':' + $scope.result.guestScore;
            $scope.show.unbet = true;
            return true;
        }
        if ($scope.status == '2') {
            $scope.matchdetail.beginTime = '已结束';
            $scope.matchdetail.middleTitle = $scope.result.homeScore + ':' + $scope.result.guestScore;
            $scope.show.unbet = true;
            return true;
        }
        if ($scope.status == '3') {
            $scope.matchdetail.beginTime = '延期';
            $scope.matchdetail.middleTitle = 'VS';
            $scope.show.unbet = true;
            return true;
        }
        if ($scope.status == '4') {
            $scope.matchdetail.beginTime = '取消';
            $scope.matchdetail.middleTitle = 'VS';
            return true;
        }
        if ($scope.status == '5') {
            $scope.matchdetail.beginTime = '弃赛';
            $scope.matchdetail.middleTitle = 'VS';
            $scope.show.unbet = true;
            return true;
        }
    }

    function getMatchDetail(a) {
        api.getMacthdetail.getmatchdetail(a).then(function (res) {
            //console.log(res);
            if (res.code == '20000') {
                $scope.result = res.result;
                $scope.status = res.result.status;
                $scope.leagueName = res.result.leagueName;
                $scope.matchPhase = res.result.matchPhase;
                $scope.guestdetail = res.result.guestTeam;
                $scope.homedetail = res.result.homeTeam;
                $scope.matchdetail = {
                    beginTime: $filter('date')(new Date(res.result.beginTime), 'MM-dd HH:mm'),
                    middleTitle: 'VS'
                }
                jugdeStatus();
                angular.forEach(res.result.fbEntityVoList, function (data, index) {
                    var obj = [];
                    var obj2 = [];
                    var obj3 = [];
                    var id = data.id;
                    var maintitle = data.title;
                    var kind = $scope.switchGame(data.name);
                    if (kind) {
                        if (kind == "game4") {
                            var winArray = [];
                            var drawArray = [];
                            var loseArray = [];
                            for (var i = 0; i < data.betOddVoList.length; i++) {
                                //console.log(data.betOddVoList[i].title);
                                var scoreTitle = data.betOddVoList[i].title.split(':');
                                //console.log(parseInt(scoreTitle[0])>=parseInt(scoreTitle[1]));
                                var obj = {
                                    'title': data.betOddVoList[i].title,
                                    'rate': data.betOddVoList[i].rate,
                                    'name': data.betOddVoList[i].name,
                                    'vid': id,
                                    'oid': data.betOddVoList[i].id,
                                    'maintitle': maintitle
                                };
                                if (parseInt(scoreTitle[0]) > parseInt(scoreTitle[1])) {
                                        if(winArray.length<15) {
                                            //console.log(1);
                                            winArray.push(obj);
                                        }
                                }
                                else if (parseInt(scoreTitle[0]) == parseInt(scoreTitle[1])) {
                                    //console.log(2);
                                    if(drawArray.length<15) {
                                        drawArray.push(obj);
                                    }
                                }
                                else if (parseInt(scoreTitle[0]) < parseInt(scoreTitle[1])) {
                                    //console.log(3);
                                    if(loseArray.length<15) {
                                        loseArray.push(obj);
                                    }
                                }
                            }
                            $scope.allDetails.game4 = [];

                            $scope.allDetails.game4[0] = winArray.length > 0 ? winArray : false;
                            $scope.allDetails.game4[1] = drawArray.length > 0 ? drawArray : false;
                            $scope.allDetails.game4[2] = loseArray.length > 0 ? loseArray : false;
                        }
                        else {
                            if (kind == 'game3') {
                                if (data.betOddVoList.length > 6) {
                                    for (var i = 0; i < 6; i++) {
                                        console.log(data.betOddVoList[i]);
                                        obj2[i] = {
                                            'title': data.betOddVoList[i].title,
                                            'rate': data.betOddVoList[i].rate,
                                            'name': data.betOddVoList[i].name,
                                            'vid': id,
                                            'oid': data.betOddVoList[i].id,
                                            'maintitle': maintitle,
                                        };
                                    }
                                    ;
                                    obj2[5] = {
                                        'title': '更多',
                                        'rate': ' ',
                                        'name': 'game3'
                                    };
                                    $scope.partDetails[kind] = obj2;
                                    console.log($scope.partDetails);
                                }

                            }
                            angular.forEach(data.betOddVoList, function (data, index) {
                                obj[index] = {
                                    'title': data.title,
                                    'rate': data.rate,
                                    'name': data.name,
                                    'vid': id,
                                    'oid': data.id,
                                    'maintitle': maintitle
                                };
                                //delete obj[index]["$$hashKey"];
                            });
                            //delete obj["$$hashKey"];
                            $scope.allDetails[kind] = obj;
                            $scope.realDetails[kind] = obj;
                        }
                    }
                    else {

                    }
                });
                initDetails();
                //native.hideLoading();
            }
        }, function (res) {
            //console.log(res);
            native.appToken(getMatchDetail);
        })
    }

    $scope.judge = function (a) {
        if ($scope.selected == a) {
            //console.log(1);
            return 'active';
        }
        else {
            return false;
        }
    }
    $scope.test = function (a) {
        if ($scope.status == '0') {
            //$scope.Checkmoney();
            if ($scope.selected == a) {
                $scope.selected = {};
                $scope.show.footer = false;
                $scope.show.pay = true;
                $scope.pbs =false;
            }
            else {
                if (a.title == '更多') {
                    //console.log(1);
                    //console.log(a.name);
                    if (a.name == "game3") {
                        //console.log(2);
                        $scope.realDetails.game3 = $scope.allDetails.game3;
                        console.log($scope.realDetails);
                    }
                    if (a.name == "game4") {
                        $scope.realDetails.game4[a.second] = $scope.allDetails.game4[a.second];
                    }
                    /// $scope.testObj5 = $scope.testObj6;
                }
                else {
                    //$scope.Checkmoney();
                    //console.log(a);
                    $scope.time='10';
                    $scope.choice = a[0];
                    $scope.selected = a;
                    $scope.price = $scope.selected.rate ? parseInt($scope.selected.rate * 1 * $scope.time) : 0;
                    $scope.show.footer = true;
                    $scope.show.pay = false;
                    $scope.choice = a.title;
                    $scope.pbs = true;
                }
            }
        }
        else {
            message.info('投注时间已过，无法投注');
        }
    }
    $scope.submitStatus = true;
    $scope.Fsubmit = function () {
        if($scope.submitStatus){
            $scope.submitStatus = false;
            submit();
        }
        //submit();
    }
    function submit() {
        //$scope.submitStatus = false;
        if (!$scope.Checkmoneyd()) {
            $scope.show.failinform = false;
            $scope.show.cover = false;
            $scope.submitStatus = true;
        }
        else {
            var bodys = $scope.initBetInformation();
            api.uc.betting(bodys).then(function (res) {
                if (res.code == '20000') {
                    $scope.show.inform = false;
                    $scope.show.cover = false;
                    getPrivileged();
                    $scope.submitStatus = true;
                }
                if (res.code == '41703') {
                    message.info('比赛一开始，不能投注');
                    $scope.submitStatus = true;
                }
                console.log(res);
                console.log(api.getToken());
            }, function (res) {
                message.info('投注失败');
                if (res.code == '41703') {
                    message.info('比赛已开始，不能投注');
                    $scope.submitStatus = true;
                }
                if (api.tokenExpired(res.code)) {
                    native.appToken(submit);
                }

            });
            //$scope.submitStatus = true;
        }
    }
    $scope.initpage();
}])