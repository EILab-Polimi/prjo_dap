/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.EvalInfograph = {
    attach: function (context, settings) {

      /**
      // Define an object wich contain the available graph to be selected in the Add indicator select box
      */
      Drupal.behaviors.EvalInfograph.apiObj = Drupal.behaviors.EvalInfograph.apiObj || null
      /**
      // Set url for fastAPI services development or production - TODO generalize
      */
      // Drupal.behaviors.EvalInfograph.FastApiUrl = settings.prjo_dap.fastapi_url
      Drupal.behaviors.EvalInfograph.FastApiUrl = settings.path.baseUrl+'api/fastapi'
      // Drupal.behaviors.EvalInfograph.FastApiUrl = settings.prjo_dap.fastapi_prod_url

      /**
      // Global variable to store selected WPP
      */
      Drupal.behaviors.EvalInfograph.WPP = Drupal.behaviors.EvalInfograph.WPP || 0

      /**
      // Scenarios
      */
      // Global variable to store scenarios
      Drupal.behaviors.EvalInfograph.Scen = Drupal.behaviors.EvalInfograph.Scen || ''
      // Get the list of scenarios and tranform it to "&scenF=s&scenF=f" for append to url
      Drupal.behaviors.EvalInfograph.getScen = function () {
        $.ajax({
          type: 'GET',
          url: Drupal.behaviors.EvalInfograph.FastApiUrl+'/scenarios',
          success: function(data, textStatus, jqXHR){
            console.log(JSON.parse(data['data']));
            var scenarios = JSON.parse(data['data'])
            $.each(scenarios.label, function( index, value ) {
                Drupal.behaviors.EvalInfograph.Scen += '&scenF='+value
            });

            /**
            // Once settled the Drupal.behaviors.EvalInfograph.Scen string wiht all the scenarios
            // Set the initial graphs
            */
            $(".dap_plot").each(function( index ) {
              var id = $(this).attr('id')
              var plot_id = $(this).attr('data-plot_id')
              var plot_type = $(this).attr('data-plot_type') || null
              var scen = $(this).attr('data-scen')
              var loc = $(this).attr('data-loc') || null
              $.ajax({
                type: 'GET',
                url: Drupal.behaviors.EvalInfograph.FastApiUrl+'/graph_api_url?plot_id='+$(this).attr('data-plot_id'),
                success: function(data, textStatus, jqXHR){
                  var plot = JSON.parse(data['data'])
                  console.log("------ graph api url -------");
                  console.log(plot);

                  console.log('ID - da modificare ' + id);

                  if (plot_type === null) {
                    // $(this) non è più disponibile nella success function
                    Drupal.behaviors.EvalInfograph.Redraw(id,
                                                          plot.api_root[0],
                                                          plot_id,
                                                          scen,
                                                          Drupal.behaviors.EvalInfograph.WPP,
                                                          loc
                                                        );
                  } else {
                    Drupal.behaviors.EvalInfograph.Redraw(id,
                                                          plot_type,
                                                          plot_id,
                                                          scen,
                                                          Drupal.behaviors.EvalInfograph.WPP,
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
      // Call portfolios list to fill the select box and set selected - TODO generalize
      */
      Drupal.behaviors.EvalInfograph.getPort = function (){
        $.ajax({
            type: 'GET',
            // url: 'http://localhost:8008/portfolios',
            url: Drupal.behaviors.EvalInfograph.FastApiUrl+'/portfolios',
            success: parseJson,
            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseJson (data, textStatus, jqXHR) {
          // console.log(data);
          // console.log(JSON.parse(data));
          var portfolios = JSON.parse(data['data']);
          var out = '';
          $.each(portfolios.id, function( index, value ) {
            // console.log(value);
            // console.log(Drupal.behaviors.EvalInfograph.WPP);
            if (value == Drupal.behaviors.EvalInfograph.WPP) {
              out += '<option selected value="'+value+'">'+portfolios.label[index]+'</option>'
            } else {
              out += '<option value="'+value+'">'+portfolios.label[index]+'</option>'
            }
          });
          $('#wpp').append(out);
        }
      }

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
      Drupal.behaviors.EvalInfograph.Redraw = function (id, route, table, scen, wpp, loc){
          // console.log(id);
          // Compose the url given the parameters
          console.log(id, route, table, scen, wpp, loc);

          // Set part of url only if mandatory == mnd
          var scenF = (scen == 'mnd') ? Drupal.behaviors.EvalInfograph.Scen : '';
          var locality = (loc == null) ? '' : loc;
          console.log(locality);

          // Add the fullPage=False to get the right answer from fastAPI
          // var url = Drupal.behaviors.EvalInfograph.FastApiUrl+
          //           '/indicators/'+ route +
          //           '?fullPage=False&'+
          //           'plot_id='+ table +
          //           '&expF='+ wpp +
          //           scenF+
          //           locality;

          var url = Drupal.behaviors.EvalInfograph.FastApiUrl+
                    '/indicators/'+ route +
                    '?fullPage=False&'+
                    'plot_id='+ table +
                    '&expF='+ wpp +
                    '&loc='+locality;

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
              $('#'+ id).closest('.card').children(".card-header").html(data['data'].title)
              $('#'+id).append(data['data'].graph);
            }
           });
      }

      /*
      * Once on the wpp select box
      */
      $('#wpp').once().each(function() {

        console.log(settings.prjo_dap);

        // get selected wpp from url params && set in behaviors
        var urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get('wpp'));
        if (urlParams.get('wpp') !== null) {
          Drupal.behaviors.EvalInfograph.WPP = urlParams.get('wpp');
        }
        // else {
        //   Drupal.behaviors.EvalInfograph.WPP = 0;
        // }
        // get list of scenarios
        Drupal.behaviors.EvalInfograph.getScen();
        // get and set Portfolios list in the WPP selectbox
        Drupal.behaviors.EvalInfograph.getPort()

        /**
        // Attach onChange Functionalities
        // https://stackoverflow.com/questions/12750307/jquery-select-change-event-get-selected-option
        */
        $( "#wpp" ).change(function() {
          // console.log( "Handler for .change() called." );
          // var optionSelected = $("option:selected", this);
          // var wppSelected = this.value;
          Drupal.behaviors.EvalInfograph.WPP = this.value
          // console.log(wppSelected);
          $(".dap_plot").each(function( index ) {
            var id = $(this).attr('id')
            var plot_id = $(this).attr('data-plot_id')
            var plot_type = $(this).attr('data-plot_type') || null
            var scen = $(this).attr('data-scen')
            var loc = $(this).attr('data-loc')
            $.ajax({
              type: 'GET',
              url: Drupal.behaviors.EvalInfograph.FastApiUrl+'/graph_api_url?plot_id='+$(this).attr('data-plot_id'),
              success: function(data, textStatus, jqXHR){
                var plot = JSON.parse(data['data'])
                console.log(plot);

                console.log('ID - da modificare ' + id);

                if (plot_type === null) {
                  // $(this) non è più disponibile nella success function
                  Drupal.behaviors.EvalInfograph.Redraw(id,
                                                        plot.api_root[0],
                                                        plot_id,
                                                        scen,
                                                        Drupal.behaviors.EvalInfograph.WPP,
                                                        loc
                                                      );
                } else {
                  Drupal.behaviors.EvalInfograph.Redraw(id,
                                                        plot_type,
                                                        plot_id,
                                                        scen,
                                                        Drupal.behaviors.EvalInfograph.WPP,
                                                        loc
                                                      );

                }

              }
            });
          });
        });
      });


      // Define a function to get an object with diff elements between
      // Possible indicators and plotted indicators
      Drupal.behaviors.EvalInfograph.AddIndicatorObject = function (){
        // get selected wpp from url params && set in behaviors
        // var urlParams = new URLSearchParams(window.location.search);
        // // console.log(urlParams.get('wpp'));
        // Drupal.behaviors.EvalInfograph.WPP = urlParams.get('wpp');

        /**
        // Call indicators list to fill the select box and set selected
        */
        $.ajax({
            type: 'GET',
            url: Drupal.behaviors.EvalInfograph.FastApiUrl+'/indicators',
            success: parseJson,
        });

        // Success function callback for the ajax call
        function parseJson (data, textStatus, jqXHR) {
          console.log('INDICATORS LIST');
          console.log(JSON.parse(data['data']));
          var indicators = JSON.parse(data['data']);

          // Make a diff array between what we have in interface
          var apiObj = {}
          var count = Object.keys(indicators['type']).length
          console.log(count);
          $.each(indicators.type, function( index, value ) {
            $.ajax({
              type: 'GET',
              url: Drupal.behaviors.EvalInfograph.FastApiUrl+'/graph_api_url?plot_id='+value,
              success: function(data, textStatus, jqXHR){
                var plot = JSON.parse(data['data'])
                // console.log("------ OOOOOOOO -------");
                // console.log(plot);
                // data-plot_id="i_cyclo_mean_dw_def_M" data-plot_type="cyclost_heatmap"

                // filter by data-plot_id
                // Se abbiamo l'indicatore in interfaccia
                if( $('[data-plot_id="'+value+'"]').length ){
                  // console.log($('[data-plot_id="'+value+'"]'))
                  // console.log(Object.keys(plot['api_root']).length);
                  // Verifichiamo che l'oggetto plot abbia o meno più di un api_root
                  if( Object.keys(plot['api_root']).length > 1 ){
                    // console.log('MORE THAN ONE');

                    $.each(plot['api_root'], function( ind, val ) {
                      if( $('[data-plot_id="'+value+'"][data-plot_type="'+val+'"]').length ){
                        // console.log('ECCO : ' + ind);
                        delete plot['api_root'][ind]
                        delete plot['descr'][ind]
                        delete plot['id'][ind]
                      }
                    });

                    // Se abbiamo tolto tutti i data-plot_type rimuovi anche api_root
                    if(Object.keys(plot['api_root']).length == 0) {
                      delete plot['api_root']
                    } else {
                      apiObj[value] = plot
                      apiObj[value]['descr'] = indicators.descr[index]
                    }
                  }
                } else {
                  // data-plot_id NON esiste in interfaccia inseriamo l'oggetto
                  // plot completo
                  // che può avere più di un api_root
                  apiObj[value] = plot
                  apiObj[value]['descr'] = indicators.descr[index]
                }

                // console.log('INDEX');
                // console.log(parseInt(index)+1);
                if (parseInt(index)+1 === count){
                  console.log('EACH TERMINATED');
                  console.log(apiObj)
                  Drupal.behaviors.EvalInfograph.apiObj = apiObj
                  Drupal.behaviors.EvalInfograph.fillAddInd()
                }

              }
            });
          });

        }
      }


      /**
      // Function to compose the entry inside the Add Indicator select box
      //
      // @Drupal.behaviors.EvalInfograph.apiObj - the object filled
      */
      Drupal.behaviors.EvalInfograph.fillAddInd = function (){
        // console.log(Drupal.behaviors.EvalInfograph.apiObj);
        var out = '<option selected value="null"></option>';
        $.each(Drupal.behaviors.EvalInfograph.apiObj, function( i, v ) {
          // console.log("INNER EACH");
          // console.log(i);
          // console.log(v);
          out += '<option value="'+i+'">'+v.descr+'</option>'
        });
        $('#add_ind').append(out);
      }


      /*
      * Once on the Add indicator select box
      */
      $('#add_ind').once().each(function() {

        // Fill the Drupal.behaviors.EvalInfograph.apiObj calling
        Drupal.behaviors.EvalInfograph.AddIndicatorObject();

        /**
        // Attach onChange Functionalities
        // https://stackoverflow.com/questions/12750307/jquery-select-change-event-get-selected-option
        */
        $( "#add_ind" ).change(function() {
          // console.log( "Handler for .change() called." );
          var optionSelected = $("option:selected", this);
          console.log(optionSelected.val());
          console.log(Drupal.behaviors.EvalInfograph.apiObj[optionSelected.val()])

          if( Object.keys(Drupal.behaviors.EvalInfograph.apiObj[optionSelected.val()].api_root).length > 1 ){
            // TODO
            // Add multistep graph creation if we have more than one data-plot_type/api_root


          } else {
            // var descr = optionSelected.text()
            var indSelected = optionSelected.val();
            // console.log(wppSelected);
            // data-plot_type="cyclost_lineplot"
            console.log(Drupal.behaviors.EvalInfograph.apiObj[optionSelected.val()].api_root[0]);

            var out = '<div class="row mt-3">'+
                      '<div class="col">'+
                        '<div class="card">'+
                          '<div class="card-header"></div>'+
                          '<div class="card-body">'+
                            '<div id="'+ Date.now() +'" data-plot_id="'+optionSelected.val()+'" data-plot_type="'+Drupal.behaviors.EvalInfograph.apiObj[optionSelected.val()].api_root[0]+'" data-scen="opt" data-exp="nonserve" data-loc="opt" class="dap_plot"></div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                    '</div>';

            $("#opt_plots").append(out);

            // // Cycle on all plots
            $(".dap_plot").each(function( index ) {
              var id = $(this).attr('id')
              var plot_id = $(this).attr('data-plot_id')
              var plot_type = $(this).attr('data-plot_type') || null
              var scen = $(this).attr('data-scen')
              var loc = $(this).attr('data-loc')
              $.ajax({
                type: 'GET',
                url: Drupal.behaviors.EvalInfograph.FastApiUrl+'/graph_api_url?plot_id='+$(this).attr('data-plot_id'),
                success: function(data, textStatus, jqXHR){
                  var plot = JSON.parse(data['data'])
                  console.log(plot);

                  console.log('ID - da modificare ' + id);

                  if (plot_type === null) {
                    // $(this) non è più disponibile nella success function
                    Drupal.behaviors.EvalInfograph.Redraw(id,
                                                          plot.api_root[0],
                                                          plot_id,
                                                          scen,
                                                          Drupal.behaviors.EvalInfograph.WPP,
                                                          loc
                                                        );
                  } else {
                    Drupal.behaviors.EvalInfograph.Redraw(id,
                                                          plot_type,
                                                          plot_id,
                                                          scen,
                                                          Drupal.behaviors.EvalInfograph.WPP,
                                                          loc
                                                        );

                  }

                }
              });
            });
          }

          // Empty the select box and refill it
          $('#add_ind').empty();
          Drupal.behaviors.EvalInfograph.AddIndicatorObject();
        });

      });

    }
  };

})(jQuery);
