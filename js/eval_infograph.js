/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.EvalInfograph = {
    attach: function (context, settings) {

      /**
      // Set url for fastAPI services development or production
      */
      Drupal.behaviors.EvalInfograph.Url = settings.prjo_dap.fastapi_url
      // Drupal.behaviors.EvalInfograph.Url = settings.prjo_dap.fastapi_prod_url

      /**
      // Global variable to store selected WPP
      */
      Drupal.behaviors.EvalInfograph.WPP = Drupal.behaviors.EvalInfograph.WPP || null

      /**
      // Scenarios
      */
      // Global variable to store scenarios
      Drupal.behaviors.EvalInfograph.Scen = Drupal.behaviors.EvalInfograph.Scen || ''
      // Get the list of scenarios and tranform it to "&scenF=s&scenF=f" for append to url
      Drupal.behaviors.EvalInfograph.getScen = function () {
        $.ajax({
          type: 'GET',
          url: Drupal.behaviors.EvalInfograph.Url+'/scenarios',
          success: function(data, textStatus, jqXHR){
            console.log(JSON.parse(data));
            var scenarios = JSON.parse(data)
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
              var loc = $(this).attr('data-loc')
              $.ajax({
                type: 'GET',
                url: Drupal.behaviors.EvalInfograph.Url+'/graph_api_url?plot_id='+$(this).attr('data-plot_id'),
                success: function(data, textStatus, jqXHR){
                  var plot = JSON.parse(data)
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
      // Call portfolios list to fill the select box and set selected
      */
      Drupal.behaviors.EvalInfograph.getPort = function (){
        $.ajax({
            type: 'GET',
            // url: 'http://localhost:8008/portfolios',
            url: Drupal.behaviors.EvalInfograph.Url+'/portfolios',
            success: parseJson,
            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseJson (data, textStatus, jqXHR) {
          // console.log(data);
          // console.log(JSON.parse(data));
          var portfolios = JSON.parse(data);
          var out = '';
          $.each(portfolios.id, function( index, value ) {
            if (portfolios.label[index] == Drupal.behaviors.EvalInfograph.WPP) {
              out += '<option selected value="'+portfolios.id[index]+'">'+portfolios.label[index]+'</option>'
            } else {
              out += '<option value="'+portfolios.id[index]+'">'+portfolios.label[index]+'</option>'
            }
          });
          $('#wpp').append(out);
        }
      }

      /**
      // Function to draw/redraw all the graph given the selected WPP and the graph_id
      // Si assume che le url di fastAPI abbiano lo stesso nome del graph_id
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
          var locality = (loc == 'mnd') ? "&loc=Locone" : '';

          // Add the fullPage=False to get the right answer from fastAPI
          var url = Drupal.behaviors.EvalInfograph.Url+
                    '/indicators/'+ route +
                    '?fullPage=False&'+
                    'plot_id='+ table +
                    '&expF='+ wpp +
                    scenF+
                    locality;

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

      /*
      * Once on the wpp select box
      */
      $('#wpp').once().each(function() {

        console.log(settings.prjo_dap);

        // get selected wpp from url params && set in behaviors
        var urlParams = new URLSearchParams(window.location.search);
        // console.log(urlParams.get('wpp'));
        Drupal.behaviors.EvalInfograph.WPP = urlParams.get('wpp');
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
              url: Drupal.behaviors.EvalInfograph.Url+'/graph_api_url?plot_id='+$(this).attr('data-plot_id'),
              success: function(data, textStatus, jqXHR){
                var plot = JSON.parse(data)
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

      /*
      * Once on the Add indicator select box
      */
      $('#add_ind').once().each(function() {

        // get selected wpp from url params && set in behaviors
        var urlParams = new URLSearchParams(window.location.search);
        // console.log(urlParams.get('wpp'));
        Drupal.behaviors.EvalInfograph.WPP = urlParams.get('wpp');

        /**
        // Call indicators list to fill the select box and set selected
        */
        // $.ajax({
        //     type: 'GET',
        //     url: Drupal.behaviors.EvalInfograph.Url+'/indicators',
        //     success: parseJson,
        // });
        //
        // // Success function callback for the ajax call
        // function parseJson (data, textStatus, jqXHR) {
        //   console.log(JSON.parse(data));
        //   var indicators = JSON.parse(data);
        //   var out = '<option selected value="null"></option>';
        //   $.each(indicators.label, function( index, value ) {
        //       out += '<option value="'+value+'">'+indicators.descr[index]+'</option>'
        //   });
        //   $('#add_ind').append(out);
        // }

        /**
        // Attach onChange Functionalities
        // https://stackoverflow.com/questions/12750307/jquery-select-change-event-get-selected-option
        */
        $( "#add_ind" ).change(function() {
          // console.log( "Handler for .change() called." );
          var optionSelected = $("option:selected", this);
          console.log(optionSelected.val());
          var descr = optionSelected.text()
          var indSelected = optionSelected.val();
          // console.log(wppSelected);

          var out = '<div class="row mt-3">'+
                    '<div class="col">'+
                      '<div class="card">'+
                        '<div class="card-header">'+ descr +'</div>'+
                        '<div class="card-body">'+
                          '<div id="'+ indSelected +'" data-plot_id="'+ indSelected +'" data-scen="opt" data-exp="nonserve" data-loc="opt" class="dap_plot_no"></div>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>';

          $("#opt_plots").append(out);

          // // Cycle on all plots
          // $(".dap_plot").each(function( index ) {
          //   console.log( index + ": " + $( this ).attr('id') );
          //   // $(this).data("plot_id");
          //   Drupal.behaviors.EvalInfograph.Redraw($(this).attr('id'),
          //                                         $(this).attr('data-plot_id'),
          //                                         $(this).attr('data-scen'),
          //                                         wppSelected, // The new selected WPP
          //                                         $(this).attr('data-loc')
          //                                       );
          // });
        });

      });

    }
  };

})(jQuery);
