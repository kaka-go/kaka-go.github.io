---
layout: post
title: Cartesian Product
brief: A = {1,2}; B = {3,4}; A × B = {1,2} × {3,4} = {(1,3), (1,4), (2,3), (2,4)}; B × A = {3,4} × {1,2} = {(3,1), (3,2), (4,1), (4,2)}
---

```javascript
function cartesianProduct(arrs){
    var sum = 1;
    for(var i=0; i < arrs.length; i++){
        sum *= arrs[i].length;
    }
    var results = [];
    for(var i=0; i < sum; i++){
        var product = i;
        var res = [];
        for(var j=0; j < arrs.length; j++){
            var len = arrs[j].length;
            var pos = product % len;
            res[j] = arrs[j][pos];
            product = Math.floor(product / len);
        }
        results[i] = res;
    }
    return results;
}
```

e.g.

```javascript
var result = cartesianProduct([[1,2,3],['a','b'],[6]]);
console.log(result);
/*
result:
[
[1, 'a', 6], [2, 'a', 6], [3, 'a', 6], 
[1, 'b', 6], [2, 'b', 6], [3, 'c', 6]
]
*/
```

```javascript
function performanceTest(size){
	var testResult = [];

	var arrs = [];
	var x = [];
	for(var i=0; i < size; i++){
		x.push(i);
		arrs.push(x.slice(0));

		var start = new Date().getTime();
		var result = cartesianProduct(arrs);
		var end = new Date().getTime();

		var time = end - start;
		testResult.push(time);
	}
	
	return testResult;
}
```
<div id="container"></div>

### Java version
https://gist.github.com/edward9145/5ff6f97174b6ebd1c09c


### ref
http://en.wikipedia.org/wiki/Cartesian_product


<script type="text/javascript">
function cartesianProduct(arrs){
    var sum = 1;
    for(var i=0; i<arrs.length; i++){
        sum *= arrs[i].length;
    }
    var results = [];
    for(var i=0; i<sum; i++){
        var product = i;
        var res = [];
        for(var j=0; j<arrs.length; j++){
            var len = arrs[j].length;
            var pos = product % len;
            res[j] = arrs[j][pos];
            product = Math.floor(product / len);
        }
        results[i] = res;
    }
    return results;
}

function performanceTest(size){
	var testResult = [];

	var arrs = [];
	var x = [];
	for(var i=0; i<size; i++){
		x.push(i);
		arrs.push(x.slice(0));
		// console.log(arrs);

		var start = typeof(performance) != undefined ? performance.now() : new Date().getTime();
		
		var result = cartesianProduct(arrs);

		var end = typeof(performance) != undefined ? performance.now() : new Date().getTime();;

		var time = end - start;
		testResult.push(time);
	}
	
	return testResult;
}
</script>

<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/highcharts/4.1.5/highcharts.js"></script>

<script type="text/javascript">
$(function () {
	var result = performanceTest(9);
    $('#container').highcharts({
        title: {
            text: 'performanceTest(9)',
            x: -20 //center
        },
        subtitle: {
            text: '1~9',
            x: -20
        },
        xAxis: {
            categories: ['1', '2', '3', '4', '5', '6',
                '7', '8', '9']
        },
        yAxis: {
            title: {
                text: 'Time (ms)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: 'ms'
        },
        legend: {
            align: 'right',
            verticalAlign: 'top'
        },
        series: [{
            name: 'cartesianProduct',
            data: result
        }]
    });
});
</script>
