
// https://stackoverflow.com/questions/34528392/sharing-traces-in-multiple-subplots-in-plotly-js
// http://codepen.io/etpinard/pen/MKbqPB
var rawDataURL = 'https://raw.githubusercontent.com/plotly/datasets/master/iris.csv';

var colorScale = Plotly.d3.scale.category10();

Plotly.d3.csv(rawDataURL, function(error, rawData) {

  var traits = Object.keys(rawData[0]).filter(function(k) {
    return k !== 'Name';
  });
  var N = traits.length;

  var traces = [];
  var layout = { annotations: [] };

  for(var i = 0; i < N; i++) {
    var xVar = traits[i];
    var xId = indexToId(i);

    for(var j = 0; j < N; j++) {
      var yVar = traits[j];
      var yId = indexToId(j);

      traces = traces.concat(makeTraces(rawData, xVar, yVar, xId, yId))

      var xDomain = calcDomain(i, N);
      var yDomain = calcDomain(j, N);

      layout['xaxis' + xId] = {
        domain: xDomain,
        zeroline: false
      };
      layout['yaxis' + yId] = {
        domain: yDomain,
        zeroline: false
      };

      if(xId === yId) {
        layout.annotations.push({
          showarrow: false,
          text: xVar,
          xref: 'paper',
          xanchor: 'left',
          yref: 'paper',
          yanchor: 'top',
          x: xDomain[0],
          y: yDomain[1]
        })
      }

    }
  }

  Plotly.plot('graph', traces, layout);
});

function makeTraces(rawData, xVar, yVar, xId, yId) {

  var tracesObj = {};
  rawData.forEach(function(item) {
    var name = item.Name;

    if(Object.keys(tracesObj).indexOf(name) === -1) {
      tracesObj[name] = {
        type: 'scatter',
        mode: 'markers',
        x: [],
        y: [],
        name: name,
        legendgroup: name,
        xaxis: 'x' + xId,
        yaxis: 'y' + yId,
        marker: {
          color: colorScale(name)
        },
        showlegend: (!xId && !yId)
      };
    }

    tracesObj[name].x.push(item[xVar]);
    tracesObj[name].y.push(item[yVar]);
  });

  var traces = [];
  Object.keys(tracesObj).forEach(function(k) {
    traces.push(tracesObj[k]);
  });

  return traces;
}

function calcDomain(index, N) {
  var pad = 0.02;
  var width = 1 / N;

  return [
    index * (width) + pad / 2,
    (index + 1) * (width) - pad / 2
  ];
}

function indexToId(index) {
  return (index === 0) ? '' : String(index + 1);
}
