/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.TestGraph = {
    attach: function (context, settings) {

      // Drupal.behaviors.TestGraph.StartPlot = Drupal.behaviors.TestGraph.StartPlot || false;
      Drupal.behaviors.TestGraph.SelectionArray = Drupal.behaviors.TestGraph.SelectionArray || {};

      $('#lineplotly').once().each(function() {



        //
        // Utility function to get column values
        //
        function unpack(rows, key) {
          // return rows.map(function(row) { return row[key]; });
          return rows.map(function(row) { return parseFloat(row[key]); });

        }


        var trace1 = {
          x: [1, 2, 3, 4],
          y: [10, 15, 13, 17],
          name: 'test',
          legendgroup: 'test',
          mode: 'markers'
        };

        var trace2 = {
          x: [2, 3, 4, 5],
          y: [16, 5, 11, 9],
          // name: 'test',
          legendgroup: 'test',
          showlegend: false,
          mode: 'lines'
        };

        var trace3 = {
          x: [1, 2, 3, 4],
          y: [12, 9, 15, 12],
          mode: 'lines+markers',
          xaxis: 'x2',
          yaxis: 'y2',
        };

        var grphdata = [ trace1, trace2, trace3 ];

        layout = {
          title: 'Make it dynamic',
          // font: {size: 4},
          grid: {rows: 2, columns: 2, pattern: 'independent'},
          annotations: [            // all "annotation" attributes: #layout-annotations
              {
                text: "First subplot",
                  font: {
                  size: 16,
                   color: 'green',
                },
                showarrow: false,
                align: 'center',
                x: 0.13, //position in x domain
                y: 1, //position in y domain
                xref: 'paper',
                yref: 'paper',
              },
              {
                text: "Second subplot",
                font: {
                size: 16,
                color: 'orange',
              },
              showarrow: false,
              align: 'center',
              x: 0.9, //position in x domain
              y: 1,  // position in y domain
              xref: 'paper',
              yref: 'paper',
              }
          ]
        }

        console.log(grphdata);
        var config = {responsive: true,
                      // scrollZoom: true // not working for radial
                    }

        Plotly.newPlot("lineplotly", grphdata, layout, config)


      });


    }
  };

})(jQuery);
