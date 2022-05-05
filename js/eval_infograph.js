/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.EvalInfograph = {
    attach: function (context, settings) {

      // Set url for services
      Drupal.behaviors.EvalInfograph.Url = settings.prjo_dap.fastapi_dev_url
      // Drupal.behaviors.EvalInfograph.Url = settings.prjo_dap.fastapi_prod_url

      Drupal.behaviors.EvalInfograph.WPP = Drupal.behaviors.EvalInfograph.WPP || null

      //
      // Function to draw/redraw all the graph given the selected WPP && the graph_id
      // Si assume che le url di fastAPI abbiano lo stesso nome del graph_id
      // @id - the div id for this graph
      // @table - table name
      // @scen -scenF value
      // @wpp - expF value // The new selected WPP
      // @loc - locality
      Drupal.behaviors.EvalInfograph.Redraw = function (id, table, scen, wpp, loc){
          // console.log(id);
          // Compose the url given the parameters
          console.log(id, table, scen, wpp, loc);

          // Set part of url only if mandatory == mnd
          var scenF = (scen == 'mnd') ? "&scenF=s" : '';
          var locality = (loc == 'mnd') ? "&loc=Locone" : '';

          var url = Drupal.behaviors.EvalInfograph.Url+
                    '/indicators/'+ id +
                    '?fullPage=False&'+
                    'i_table='+ table +
                    '&expF='+ wpp +
                    scenF+
                    locality;


          $.ajax({
            type: 'GET',
            url: url,
            success: function(data, textStatus, jqXHR){
              // console.log(id);
              $('#'+ id).empty()
              $('#'+id).append(data);
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

        /**
        // Call portfolios list to fill the select box && set selected
        */
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
          $.each(portfolios.exp, function( index, value ) {
            if (value == Drupal.behaviors.EvalInfograph.WPP) {
              out += '<option selected value="'+value+'">'+value+'</option>'
            } else {
              out += '<option value="'+value+'">'+value+'</option>'
            }
          });
          $('#wpp').append(out);
        }

        /**
        // Attach onChange Functionalities
        // https://stackoverflow.com/questions/12750307/jquery-select-change-event-get-selected-option
        */
        $( "#wpp" ).change(function() {
          // console.log( "Handler for .change() called." );
          // var optionSelected = $("option:selected", this);
          var wppSelected = this.value;
          // console.log(wppSelected);

          // Cycle on all plots
          $(".dap_plot").each(function( index ) {
            console.log( index + ": " + $( this ).attr('id') );
            // $(this).data("i_table");
            Drupal.behaviors.EvalInfograph.Redraw($(this).attr('id'),
                                                  $(this).attr('data-i_table'),
                                                  $(this).attr('data-scen'),
                                                  wppSelected, // The new selected WPP
                                                  $(this).attr('data-loc')
                                                );
          });
        });

        /**
        // Set the initial graphs
        */
        $(".dap_plot").each(function( index ) {
          // console.log( index + ": " + $( this ).attr('id')  );
          // console.log($(this).data("i_table"));
          // console.log($(this).data("scen"));
          // // console.log($(this).data("exp")); // not used
          // console.log($(this).data("loc"));

          Drupal.behaviors.EvalInfograph.Redraw($(this).attr('id'),
                                                $(this).attr('data-i_table'),
                                                $(this).attr('data-scen'),
                                                Drupal.behaviors.EvalInfograph.WPP,
                                                $(this).attr('data-loc')
                                              );
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
        // Call portfolios list to fill the select box && set selected
        */
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
          $.each(portfolios.exp, function( index, value ) {
            if (value == Drupal.behaviors.EvalInfograph.WPP) {
              out += '<option selected value="'+value+'">'+value+'</option>'
            } else {
              out += '<option value="'+value+'">'+value+'</option>'
            }
          });
          $('#add_ind').append(out);
        }

        /**
        // Attach onChange Functionalities
        // https://stackoverflow.com/questions/12750307/jquery-select-change-event-get-selected-option
        */
        $( "#add_ind" ).change(function() {
          // console.log( "Handler for .change() called." );
          // var optionSelected = $("option:selected", this);
          var wppSelected = this.value;
          // console.log(wppSelected);

          var out = '<div class="row mt-3">'+
                    '<div class="col">'+
                      '<div class="card">'+
                        '<div class="card-header">'+ wppSelected +'</div>'+
                        '<div class="card-body">'+
                          '<div id="'+ wppSelected +'" class="dap_plot_no"></div>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>';

          $("#opt_plots").append(out);
          // // Cycle on all plots
          // $(".dap_plot").each(function( index ) {
          //   console.log( index + ": " + $( this ).attr('id') );
          //   // $(this).data("i_table");
          //   Drupal.behaviors.EvalInfograph.Redraw($(this).attr('id'),
          //                                         $(this).attr('data-i_table'),
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
