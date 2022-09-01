/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.OutlineInfograph = {
    attach: function (context, settings) {

      /**
      // GLOBAL VARIABLES
      */
      // Complete experiments/WPPs output
      Drupal.behaviors.OutlineInfograph.WPPList = Drupal.behaviors.OutlineInfograph.WPPList || null
      // Variable to store selected WPP
      Drupal.behaviors.OutlineInfograph.WPP = Drupal.behaviors.OutlineInfograph.WPP || null

      /**
      // Set url for fastAPI services development or production
      */
      Drupal.behaviors.OutlineInfograph.Url = settings.prjo_dap.fastapi_url
      // Drupal.behaviors.OutlineInfograph.Url = settings.prjo_dap.fastapi_prod_url


      /**
      // Function to draw/redraw all the graph given the selected WPP and the graph_id
      //
      // @id - the div id for this graph
      // @route - the fastAPI route to call to get the graph
      // @table - database table name // NOT USED in db v3
      // @scen - scenF  - for some routes the scen variable is mandatory
      // @wpp - expF value // The selected WPP
      // @loc - locality
      */
      Drupal.behaviors.OutlineInfograph.Redraw = function (id, route, table, scen, wpp, loc){
          // console.log(id);
          // Compose the url given the parameters
          console.log(id, route, table, scen, wpp, loc);

          // Set part of url only if mandatory == mnd
          // var scenF = (scen == 'mnd') ? Drupal.behaviors.EvalInfograph.Scen : '';
          // var locality = (loc == 'mnd') ? "&loc=Locone" : '';

          // Add the fullPage=False to get the right answer from fastAPI
          var url = Drupal.behaviors.OutlineInfograph.Url+
                    '/indicators/'+ route +
                    '?fullPage=False&'+
                    'plot_id='+ table +
                    '&expF='+ wpp;
                    // scenF+
                    // locality;

          console.log(url);

          $.ajax({
            type: 'GET',
            url: url,
            success: function(data, textStatus, jqXHR){

              // console.log('DATA BACK FROM GRAPH')
              // console.log(data)
              // console.log(id);
              $('#'+ id).empty()
              // console.log( $('#'+ id).closest('.card').children(".card-header") )
              $('#'+ id).closest('.card').children(".card-header").empty()
              $('#'+ id).closest('.card').children(".card-header").html(data.title)
              $('#'+id).append(data.graph);
            }
           });
      }


      /**
      // Call portfolios list to fill the select box and set selected
      */
      Drupal.behaviors.OutlineInfograph.getPort = function (){
        $.ajax({
            type: 'GET',
            // url: 'http://localhost:8008/portfolios',
            url: Drupal.behaviors.OutlineInfograph.Url+'/portfolios',
            success: parseJson,
            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseJson (data, textStatus, jqXHR) {
          // console.log(data);
          console.log(JSON.parse(data));
          Drupal.behaviors.OutlineInfograph.WPPList = JSON.parse(data);
          var out = '';
          $.each(Drupal.behaviors.OutlineInfograph.WPPList.id, function( index, value ) {
            if (Drupal.behaviors.OutlineInfograph.WPPList.label[index] == Drupal.behaviors.OutlineInfograph.WPP) {
              out += '<option selected value="'+Drupal.behaviors.OutlineInfograph.WPPList.id[index]+'">'+Drupal.behaviors.OutlineInfograph.WPPList.label[index]+'</option>'
            } else {
              out += '<option value="'+Drupal.behaviors.OutlineInfograph.WPPList.id[index]+'">'+Drupal.behaviors.OutlineInfograph.WPPList.label[index]+'</option>'
            }
          });
          $('#wpp').append(out);

          // fill the explanation Cards
          var out = '';
          var graph = '';
          // console.log(Drupal.behaviors.OutlineInfograph.WPP);
          // console.log(Drupal.behaviors.OutlineInfograph.WPPList.descr_plan[Drupal.behaviors.OutlineInfograph.WPP]);
          // console.log(Drupal.behaviors.OutlineInfograph.WPPList.descr_plan[Drupal.behaviors.OutlineInfograph.WPP].cards);
          $.each(Drupal.behaviors.OutlineInfograph.WPPList.descr_plan[Drupal.behaviors.OutlineInfograph.WPP].cards, function( index, card ){
            console.log(card);
            out += '<div class="col d-flex align-items-stretch">'+
                     '<div class="card mb-3 shadow" style="min-width: -webkit-fill-available;">'+
                       '<div class="card-body px-4">'+
                       '<div class="d-flex justify-content-start align-items-center mb-2">'+
                                 '<div class="me-2">'+
                                 '<span class="fa-stack fa-2x">'+
                                   '<i class="fa-solid fa-circle fa-stack-2x"></i>'+
                                   '<i class="'+ card.icon +' fa-stack-1x fa-inverse"></i>'+
                                 '</span>'+
                                 '</div>'+
                                 '<div>'+
                                 '<h5 class="card-title">'+ card.title +'</h5>'+
                                 '</div>'+
                         '</div>'+
                               '<div class="card-text">'+
                                  card.body +
                               '</div>'+
                       '</div>'+
                     '</div>'+
                   '</div>';

              if ( card.hasOwnProperty('chart_api') && card.hasOwnProperty('item_type') ) {
                graph += '<div class="row mt-3">'+
                            '<div class="col">'+
                              '<div class="card">'+
                                '<div class="card-header">'+
                                '</div>'+
                                '<div class="card-body">'+
                                  '<div id="outl_g'+index+'" data-plot_id="'+card.item_type+'" data-plot_type="'+card.chart_api+'" data-scen="opt" data-exp="nonserve" data-loc="opt" class="dap_plot"></div>'+
                                '</div>'+
                              '</div>'+
                            '</div>'+
                          '</div>';
              }
          });
          // Fill cards with explanations
          $('#expl_cards').append(out);
          // fill charts
          $('#outline_charts').append(graph);


          // CALL function to draw the graphs
          /**
          // Once settled the Drupal.behaviors.EvalInfograph.Scen string wiht all the scenarios
          // Set the initial graphs
          */
          $(".dap_plot").each(function( index ) {
            var id = $(this).attr('id')
            var plot_id = $(this).attr('data-plot_id')
            var plot_type = $(this).attr('data-plot_type') || null
            var scen = $(this).attr('data-scen')
            var loc = $(this).attr('data-loc')
            $.ajax({
              type: 'GET',
              url: Drupal.behaviors.OutlineInfograph.Url+'/graph_api_url?plot_id='+$(this).attr('data-plot_id'),
              success: function(data, textStatus, jqXHR){
                var plot = JSON.parse(data)
                console.log("------ graph api url -------");
                console.log(plot);

                console.log('ID - da modificare ' + id);

                if (plot_type === null) {
                  // $(this) non è più disponibile nella success function
                  Drupal.behaviors.OutlineInfograph.Redraw(id,
                                                        plot.api_root[0],
                                                        plot_id,
                                                        scen,
                                                        Drupal.behaviors.OutlineInfograph.WPP,
                                                        loc
                                                      );
                } else {
                  Drupal.behaviors.OutlineInfograph.Redraw(id,
                                                        plot_type,
                                                        plot_id,
                                                        scen,
                                                        Drupal.behaviors.OutlineInfograph.WPP,
                                                        loc
                                                      );

                }

              }
            });
          });

        }
      }



      /*
      * Once on the wpp select box
      */
      $('#wpp').once().each(function() {

        // get selected wpp from url params
        var urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get('wpp'));
        // set selected wpp id
        Drupal.behaviors.OutlineInfograph.WPP = urlParams.get('wpp');
        // get and set Portfolios list in the WPP selectbox
        Drupal.behaviors.OutlineInfograph.getPort()

      });



    }
  };

})(jQuery);
