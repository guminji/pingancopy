/**
 * Created by yangzhilei on 16/5/16.
 */
var calculateModel = [
  {matchId: '1', array: [{type: 'win', value: 1.39}, {type: 'lose', value: 6.25}]},
  {matchId: '2', array: [{type: 'win', value: 2.2}, {type: 'lose', value: 2.74}]},
  {matchId: '3', array: [{type: 'win', value: 1.16}]},
  {matchId: '4', array: [{type: 'win', value: 1.75}]},
];

/**
 * 按每个奖项进行分组 [{matchId,type,value},{matchId,type,value}...]
 */
function groupSingle(calculateModel, num) {
  var result = [];
  for (var i = 0; i < calculateModel.length; i++) {
    if (i + num <= calculateModel.length) {
      regroup(calculateModel, num, result, i, 1);
    }
  }
  return result;
}

/**
 * 根据分组结果计算奖金范围
 */
function calculateReward(group, SINGLE) {
  var maxMap = {};
  var minValue;
  group.forEach(function (array) {
    var singleValue = SINGLE;
    var key = ",";
    array.forEach(function (obj) {
      singleValue *= obj.value;
      key += obj.matchId + ",";
    });
    if (typeof (maxMap[key]) == 'number') {
      if (maxMap[key] < singleValue) {
        maxMap[key] = round(singleValue);
      }
    } else {
      maxMap[key] = round(singleValue);
    }
    if (!minValue || minValue > singleValue) {
      minValue = singleValue;
    }
  });
  var maxValue = totalValue(maxMap);
  return {
    maxValue: maxValue,
    minValue: round(minValue)
  };
}

function totalValue(map) {
  var totalValue = 0;
  for (var key in map) {
    totalValue += map[key];
  }
  return round(totalValue);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function regroup(calculateModel, num, result, from, c_skip) {
  var current = calculateModel[from];
  for (var i = from + c_skip; i < calculateModel.length; i++) {
    var array = [];
    array.push(current);
    if (i + num - 1 <= calculateModel.length) {
      for (var j = 0; j < num - 1; j++) {
        array.push(calculateModel[i + j]);
      }
      singleRegroup(array, result);
    }
  }
}

function singleRegroup(array, result) {
  deep(0, array, result);
}

function deep(index, array, result, resultArray) {
  if (!resultArray) {
    resultArray = [];
  }
  var singleObj = array[index];
  var singleArray = singleObj.array;
  for (var i = 0; i < singleArray.length; i++) {
    var obj = singleArray[i];
    resultArray[index] = {
      matchId: singleObj.matchId,
      type: obj.type,
      value: obj.value
    };
    if (index == array.length - 1) {
      result.push(resultArray.concat());
    } else {
      deep(index + 1, array, result, resultArray);
    }
  }
}

var result = calculateReward(groupSingle(calculateModel, 2), 2);
console.log(result.minValue + "~~" + result.maxValue);
