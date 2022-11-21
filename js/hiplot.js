/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.HiPlot = {
    attach: function (context, settings) {

      /*
      * Once on the wpp select box
      */
      $('#wpp').once().each(function() {

        // // get selected wpp from url params
        // var urlParams = new URLSearchParams(window.location.search);
        // // console.log(urlParams.get('wpp'));
        // // set selected wpp id
        // if (urlParams.get('wpp') !== null) {
        //   Drupal.behaviors.OutlineInfograph.WPP = urlParams.get('wpp');
        // }
        // // get and set Portfolios list in the WPP selectbox
        // Drupal.behaviors.OutlineInfograph.getPortfolios()
        //
        // $( "#wpp" ).change(function() {
        //     Drupal.behaviors.OutlineInfograph.WPP = this.value
        //     // Clean the WPP selectbox
        //     $('#wpp').empty();
        //     // Clean the explanation cards container
        //     $('#expl_cards').empty();
        //     // Clean charts and maps
        //     $('#outline_charts').empty();
        //
        //     // Reload cards && everityng
        //     Drupal.behaviors.OutlineInfograph.getPortfolios()
        //     // // Call the function to filter the layers
        //     // Drupal.behaviors.OlMap.filterLayers(Drupal.behaviors.OlMap.Map);
        // })

      });

      /*
      * Once on the wpp select box
      */
      $('#hiplot_chart').once().each(function() {

        // var url = 'http://localhost:5000/hiplot/comparison'
        var url = settings.path.baseUrl+'api/fastapi/hiplot'

        $.ajax({
          type: 'GET',
          url: url,
          success: function(data, textStatus, jqXHR){

            console.log('DATA BACK FROM GRAPH')
            console.log(data)

            $('#hiplot_chart').append(data['data']);
            // $('#hiplot_chart').append(data);
          },
          error: function(data, textStatus, jqXHR){
            console.log('ERROR - fastAPI');
          }
         });

      });



    }
  };

})(jQuery);
