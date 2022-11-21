/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.Scenarios = {
    attach: function (context, settings) {


      // import WMSCapabilities from 'ol/format/WMSCapabilities';

      /**
      // GLOBAL VARIABLES
      */
      // Complete experiments/WPPs output
      // Drupal.behaviors.Scenarios.WPPList = Drupal.behaviors.Scenarios.WPPList || null
      // Variable to store selected WPP
      // Drupal.behaviors.Scenarios.SCEN = Drupal.behaviors.Scenarios.SCEN || {}
      Drupal.behaviors.Scenarios.SCEN = Drupal.behaviors.Scenarios.SCEN || 0

      /**
      // Set url for fastAPI services development or production
      */
      // Drupal.behaviors.Scenarios.Url = settings.prjo_dap.fastapi_url
      Drupal.behaviors.Scenarios.FastApiUrl = settings.path.baseUrl+'api/fastapi'
      // Drupal.behaviors.Scenarios.Url = settings.prjo_dap.fastapi_prod_url


      /**
      // Function to draw/redraw all the graph given the selected WPP and the graph_id
      //
      // @id - the div id for this graph
      // @route - the fastAPI route to call to get the graph
      // @table - database table name // NOT USED in db v3
      // @exp -
      // @scen - scenF  - for some routes the scen variable is mandatory
      // @wpp - expF value // The selected WPP
      // @loc - locality
      */
      Drupal.behaviors.Scenarios.Redraw = function (id, route, table, scen, wpp, loc){
          // console.log(id);
          // Compose the url given the parameters
          // console.log(id, route, table, scen, wpp, loc);

          // Set part of url only if mandatory == mnd
          // var scenF = (scen == 'mnd') ? Drupal.behaviors.EvalInfograph.Scen : '';
          // var locality = (loc == 'mnd') ? "&loc=Locone" : '';

          console.log(scen);
          if (scen == 'opt') {
            // Add the fullPage=False to get the right answer from fastAPI
            // var url = Drupal.behaviors.Scenarios.Url+
            //         '/indicators/'+ route +
            //         '?fullPage=False&'+
            //         'plot_id='+ table +
            //         '&expF='+ wpp;
            //         // scenF+
            //         // locality;
            var url = settings.path.baseUrl+'api/fastapi'+
                    '/indicators/'+ route +
                    '?fullPage=False&'+
                    'plot_id='+ table +
                    '&expF='+ wpp;
                    // scenF+
                    // locality;

          } else {
            // var url = Drupal.behaviors.Scenarios.Url+
            //           '/indicators/'+ route +
            //           '?fullPage=False&'+
            //           'plot_id='+ table +
            //           '&expF='+ wpp +
            //           '&scenF='+ scen;

            var url = settings.path.baseUrl+'api/fastapi'+
                      '/indicators/'+ route +
                      '?fullPage=False&'+
                      'plot_id='+ table +
                      '&expF='+ wpp +
                      '&scenF='+ scen;


          }
          console.log(url);

          $.ajax({
            type: 'GET',
            url: url,
            success: function(data, textStatus, jqXHR){

              // console.log('DATA BACK FROM GRAPH')
              console.log(data)
              // console.log(id);
              $('#'+ id).empty()
              // console.log( $('#'+ id).closest('.card').children(".card-header") )
              $('#'+ id).closest('.card').children(".card-header").empty()
              $('#'+ id).closest('.card').children(".card-header").html(data['data'].title)
              $('#'+id).append(data['data'].graph);
            },
            error: function(data, textStatus, jqXHR){
              console.log('ERROR - fastAPI');
            }
           });
      }

      /**
      / Get the list of scenarios
      **/
      Drupal.behaviors.Scenarios.getScenarios = function () {
        $.ajax({
          type: 'GET',
          url: Drupal.behaviors.Scenarios.FastApiUrl+'/scenarios',
          success: function(data, textStatus, jqXHR){
            console.log(JSON.parse(data['data']));
            var scenarios = JSON.parse(data['data'])

            //Drupal.behaviors.Scenarios.SCEN = scenarios.label;
            console.log(Drupal.behaviors.Scenarios.SCEN);

            var out = '';
            $.each(scenarios.id, function( index, value ) {
              console.log(scenarios.label[index]);
              if (value == Drupal.behaviors.Scenarios.SCEN) {
                out += '<option selected value="'+value+'">'+scenarios.label[index]+'</option>'
              } else {
                out += '<option value="'+value+'">'+scenarios.label[index]+'</option>'
              }
            });
            $('#scen').append(out);

            /**
            // fill the explanation Cards
            **/
            // var cards = '';
            // var graph = '';
            // var map = '';
            // console.log(Drupal.behaviors.Scenarios.WPP);
            $.each(scenarios.descr[Drupal.behaviors.Scenarios.SCEN].cards, function( index, card ){
              console.log("---- Cards cycle ----");
              // console.log(portfolios.descr_plan[Drupal.behaviors.Scenarios.WPP]);
              console.log(card);

              var cards = '';
              var graph = '';
              var map = '';

              // TODO - aggiungere il bottone nella card che porta al relativo grafico o mappa
              cards += '<div class="col d-flex align-items-stretch">'+
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
                                 '<div class="card-text">'+
                                    '<a href="#rowcard_'+index+'" class="stretched-link">More</a>' +
                                 '</div>'+
                         '</div>'+
                       '</div>'+
                     '</div>';

                if ( card.hasOwnProperty('chart_api') && card.hasOwnProperty('item_type') ) {
                  if (card.hasOwnProperty('exp_id')) {
                    var exp = card.exp_id;
                  } else {
                    var exp = 'opt';
                  }
                  console.log(exp);
                  graph += '<div id="rowcard_'+index+'" class="row mt-3" style="scroll-margin-top: 100px;">'+
                              '<p ></p>'+
                              '<div class="col">'+
                                '<div class="card">'+
                                  '<div class="card-header">'+
                                  '</div>'+
                                  '<div class="card-body">'+
                                    '<div id="outl_g'+index+'" data-plot_id="'+card.item_type+'" data-plot_type="'+card.chart_api+'" data-scen="nonserve" data-exp="'+exp+'" data-loc="opt" class="dap_plot"></div>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</div>';
                } else if (card.hasOwnProperty('map')){
                  // Insert map instead of graph

                  // Chiamiamo una funzione che passa il nome del progetto qgis
                  //

                  // Drupal.behaviors.OLCommon.SetUp('outl_m'+index, card.map)

                  map += '<div id="rowcard_'+index+'" class="row mt-3" style="scroll-margin-top: 100px;">'+
                              '<div class="col">'+
                                '<div class="card">'+
                                  '<div class="card-header">'+
                                  card.title +
                                  '</div>'+
                                  '<div class="card-body">'+
                                    '<div id="outl_m'+index+'" data-qgis_map="'+card.map+'" data-scen="opt" data-exp="nonserve" data-loc="opt" class="dap_map" style="height:400px;"></div>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</div>';


                }

                // Fill cards with explanations
                $('#expl_cards').append(cards);
                // fill map
                $('#outline_charts').append(map);
                // fill charts
                $('#outline_charts').append(graph);

            });

            // CALL function to draw the maps
            $(".dap_map").each(function( index ) {
              var id = $(this).attr('id')
              var map = $(this).attr('data-qgis_map')
              // console.log('CALLING SETUP with MAP : '+ map);
              Drupal.behaviors.OLCommon.SetUp(id, map)
            });

            // CALL function to draw the graphs
            /**
            // Once settled the Drupal.behaviors.EvalInfograph.Scen string wiht all the scenarios
            // Set the initial graphs
            */
            $(".dap_plot").each(function( index ) {
              var id = $(this).attr('id')
              var plot_id = $(this).attr('data-plot_id')
              var plot_type = $(this).attr('data-plot_type') || null
              var exp = $(this).attr('data-exp')
              var scen = $(this).attr('data-scen')
              var loc = $(this).attr('data-loc')
              $.ajax({
                type: 'GET',
                url: Drupal.behaviors.Scenarios.FastApiUrl+'/graph_api_url?plot_id='+$(this).attr('data-plot_id'),
                success: function(data, textStatus, jqXHR){
                  var plot = JSON.parse(data['data'])
                  // console.log("------ graph api url -------");
                  // console.log(plot);
                  //
                  // console.log('ID - da modificare ' + id);

                  if (plot_type === null) {
                    // $(this) non è più disponibile nella success function
                    Drupal.behaviors.Scenarios.Redraw(id,
                                                          plot.api_root[0],
                                                          plot_id,
                                                          Drupal.behaviors.Scenarios.SCEN,
                                                          exp,
                                                          loc
                                                        );
                  } else {
                    Drupal.behaviors.Scenarios.Redraw(id,
                                                          plot_type,
                                                          plot_id,
                                                          Drupal.behaviors.Scenarios.SCEN,
                                                          exp,
                                                          loc
                                                        );

                  }

                }
              });
            });

          }
         });
      }

      /**
      // Once on the scen select box
      // TODO - Taken from selectors.js in geoviz module
      */
      $('#scen').once().each(function() {
        // get selected wpp from url params && set in behaviors
        var urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get('scen'));
        if (urlParams.get('scen') !== null) {
          Drupal.behaviors.Scenarios.SCEN = urlParams.get('scen');
        }
        // get list of scenarios
        Drupal.behaviors.Scenarios.getScenarios();

        $( "#scen" ).change(function() {
            Drupal.behaviors.Scenarios.SCEN = this.value
            // Clean the WPP selectbox
            $('#scen').empty();
            // Clean the explanation cards container
            $('#expl_cards').empty();
            // Clean charts and maps
            $('#outline_charts').empty();

            // Reload cards && everityng
            Drupal.behaviors.Scenarios.getScenarios()
        })

      });




    }
  };

})(jQuery);
