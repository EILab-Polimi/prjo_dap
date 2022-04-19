/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.TestPyPlotlyGraph = {
    attach: function (context, settings) {

      // Drupal.behaviors.TestPyPlotlyGraph.StartPlot = Drupal.behaviors.TestPyPlotlyGraph.StartPlot || false;
      Drupal.behaviors.TestPyPlotlyGraph.SelectionArray = Drupal.behaviors.TestPyPlotlyGraph.SelectionArray || {};

      $('#wpp').once().each(function() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8008/portfolios',
            success: parseJson,
            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseJson (data, textStatus, jqXHR) {
          // console.log(data);
          const obj = JSON.parse(data);
          $.each(obj.exp, function( index, value ) {
            $('#wpp').append('<option value="'+value+'">'+value+'</option>');
          })
        }

      });

      $('#lineplotly').once().each(function() {

        $.ajax({
            type: 'GET',
            url: 'http://localhost:8008/indicators/graph_test',
            success: parseHTML,
            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseHTML (data, textStatus, jqXHR) {

          $('#lineplotly').append(data);
        }

      });


      $('#parameters').once().each(function() {

        $.ajax({
            type: 'GET',
            url: 'http://localhost:8008/indicators/graph_params?i_label=mean_y&i_name=yearly mean&var=s&scen=rcp8.5&loc=Locone',
            success: parseHTML,
            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseHTML (data, textStatus, jqXHR) {
          $('#parameters').append(data);
        }

      });

    }
  };

})(jQuery);
