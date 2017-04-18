/**
 * Created by gsh on 5/11/16.
 */

var app = require('../bootstrap');

app.controller('BetFootball', [
  '$scope',
  'api',
  function($scope,api) {
    $scope.dataTable=[
      {
        day:'2016.5.11',
        match:[{
          team1:'中国',
          team2:'美国',
          win:'3',
          draw:'1.2',
          lose:'0.4',
          id:'12312312'
        },{
          team1:'中国2',
          team2:'美国2',
          win:'21',
          draw:'12',
          lose:'0.33'
        },{
          team1:'中国3',
          team2:'美国3',
          win:'14',
          draw:'12',
          lose:'0.34'
        }]
     },
      {
        day:'2016.5.13',
        match:[{
          team1:'中1国',
          team2:'美1国',
          win:'25',
          draw:'16',
          lose:'0.37'
        },{
          team1:'中1国2',
          team2:'美1国2',
          win:'28',
          draw:'18',
          lose:'0.38'
        },{
          team1:'中1国3',
          team2:'美1国3',
          win:'29',
          draw:'19',
          lose:'0.39'
        }]
      },
      {
        day:'2016.5.15',
        match:[{
          team1:'中2国',
          team2:'美2国',
          win:'29',
          draw:'19',
          lose:'0.39'
        },{
          team1:'中2国2',
          team2:'美2国2',
          win:'23',
          draw:'14',
          lose:'0.35'
        },{
          team1:'中2国3',
          team2:'美2国3',
          win:'2',
          draw:'1',
          lose:'0.3'
        }]
      }
    ];


  }
]);