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

        $('.custom-select').on('change', function (e) {
            $('.custom-select').each(function(){
              console.log(this.id);
              var id = this.id;
              var optionSelected = $("option:selected", this);
              var valueSelected = this.value;
              Drupal.behaviors.TestGraph.SelectionArray[id] = valueSelected;
              console.log(optionSelected);
              console.log(valueSelected);
            }).promise().done( function(){
              // console.log(Drupal.behaviors.TestGraph.SelectionArray);
              // console.log($.inArray( "0", Drupal.behaviors.TestGraph.SelectionArray ));
              console.log('In promise');
              console.log(Drupal.behaviors.TestGraph.SelectionArray.wpp);
              // $.each(Drupal.behaviors.TestGraph.SelectionArray, function(index, value){
              //   console.log(value);
              // })
              if(Drupal.behaviors.TestGraph.SelectionArray.wpp != "0" && Drupal.behaviors.TestGraph.SelectionArray.scen != "0" && Drupal.behaviors.TestGraph.SelectionArray.ind != 0 && Drupal.behaviors.TestGraph.SelectionArray.loc != "0" ){
                // Drupal.behaviors.TestGraph.StartPlot = true;
                plotGraph();
              }
            });
        });
        // $.get("dap_composable?query={article(id:9){id title author body}}", function(data, status){
        //   console.log("Status: " + status);
        //   console.log(data);
        // });

        //
        // Utility function to get column values
        //
        function unpack(rows, key) {
          // return rows.map(function(row) { return row[key]; });
          return rows.map(function(row) { return parseFloat(row[key]); });

        }


        function plotGraph(){
          var exp = Drupal.behaviors.TestGraph.SelectionArray.wpp
          var scen = Drupal.behaviors.TestGraph.SelectionArray.scen
          var ind = Drupal.behaviors.TestGraph.SelectionArray.ind
          var loc = Drupal.behaviors.TestGraph.SelectionArray.loc

          $.get('dap_ext_db?query={article(ind:"i_mean_y_s",scen:"'+scen+'",loc:"'+loc+'",exp:"'+exp+'"){value%20ts}}', function(response, status){
            console.log("Status: " + status);
            if(status == 'success'){
              console.log(response.data.article);

              console.log(unpack(response.data.article, 'ts'));
              console.log(unpack(response.data.article, 'value'));

              var x = unpack(response.data.article, 'ts');
              var y = unpack(response.data.article, 'value');

              var trace1 = {
                // x: [1, 2, 3, 4],
                // y: [10, 15, 13, 17],
                x: x,
                y: y,

                mode: 'lines'
              };


              var grphdata = [ trace1 ];

              var title = loc+' '+ ind +' storage - Scenario: '+scen
              layout = {
                title: title,
                // font: {size: 4},
              }

              var config = {responsive: true,
                            // scrollZoom: true // not working for radial
                          }

              Plotly.newPlot("lineplotly", grphdata, layout, config)

            }
          });
        }
        // var trace1 = {
        //   x: [1, 2, 3, 4],
        //   y: [10, 15, 13, 17],
        //   mode: 'markers'
        // };
        //
        // var trace2 = {
        //   x: [2, 3, 4, 5],
        //   y: [16, 5, 11, 9],
        //   mode: 'lines'
        // };
        //
        // var trace3 = {
        //   x: [1, 2, 3, 4],
        //   y: [12, 9, 15, 12],
        //   mode: 'lines+markers'
        // };
        //
        // var grphdata = [ trace1, trace2, trace3 ];
        //
        // layout = {
        //   title: 'Make it dynamic',
        //   // font: {size: 4},
        // }
        //
        // var config = {responsive: true,
        //               // scrollZoom: true // not working for radial
        //             }
        //
        // Plotly.newPlot("lineplotly", grphdata, layout, config)


      });


    }
  };

})(jQuery);
