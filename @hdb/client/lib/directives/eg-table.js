/**
 * Created by jason on 12/11/15.
 */

var ui = require('./ui-directive');

/**
 *data table ui directive
 * ============ columns ===============
 [
   {
     field:'', //key in json result ,
     name:'',  // text in header th
     sortable:true, //if this column is sortable
     sortBy:''  //sort by name..., if not provided, will sort by field
     cssClass:'', //css in tbody td
     headCssClass:'', // css in thead th
     formatter:'', //function to call to gen the html in the td,
     ..., other needed functions passed
   }.....
 ]
 *
 */
ui.directive('egTable', [
  '$timeout',
  '$sce',
  '$filter',
  function ($timeout, $sce, $filter) {
    return {
      restrict: 'EA',
      scope: {
        params: '=', //especially the sortBy and sortDir
        columns: '=', //columns definition, @see above format
        data: '=', //json data from outside
        tableClass: '@', // css class for the whole table
        noStrip: '@',
        init: '&' //callback after DOM rendered
                  //<data-table .... init="myInit(ele)"></data-table>
      },
      replace: true,
      templateUrl: '/resources/views/directives/eg-table',
      controller: ['$scope', function ($scope) {
        var escapeHtml = $filter('linky');
        var asc = 'asc', desc = 'desc';
        $scope.defaultDesc = true;
        $scope.columnName = function(column) {
          return noEscape(column) ? column.name : escapeHtml(column.name);
        };
        $scope.displayContent = function (formatter, fieldData, rowData, column) {
          var html = '';
          if ('function' === typeof formatter) {
            html = formatter.call(rowData, fieldData, column);
          }
          else {
            html += formatter;
          }
          //return html;
          html = html.toString();
          if(noEscape(column)) {
            return html;
          }
          return escapeHtml(html);
        };
        $scope.addUndefinedSortBy = function () {
          for (var i in $scope.columns) {
            var item = $scope.columns[i];
            if (!item.sortBy) {
              item.sortBy = item.field;
            }
          }
        };
        $scope.sort = function (col) {
          if(!col.sortable) return;
          var field = col.sortBy ? col.sortBy : col.field;
          if (!field) return;
          var p = $scope.params;
          for (var i in $scope.columns) {
            if($scope.columns.hasOwnProperty(i)) {
              var item = $scope.columns[i];
              if (!item.sortable)
                continue;
              //get the column need to be sorted
              if (item.sortBy == field || item.field == field) {
                //if current column is already sorted, then sort it in opposite dir
                if (p.sortBy == field) {
                  p.sortDir = p.sortDir == asc ? desc : asc;
                  break;
                }
                //sort another column
                else {
                  p.sortBy = field;
                  p.sortDir = $scope.defaultDesc ? desc : asc;
                }
              }
            }
          }
        };
        function noEscape(column) {
          return false === column.autoEscape || $scope.trustHtml;
        }
      }],
      link: function ($scope, elem, attrs) {
        //globally escape html
        $scope.trustHtml = 'false' === attrs.autoEscape;
        $scope.addUndefinedSortBy();
        if ($scope.init) {
          $timeout(function () {
            $scope.init({ele: elem.html()}); //pass the element
          }, 500);
        }
      }
    };
  }]);