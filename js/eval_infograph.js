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

      // Drupal.behaviors.EvalInfograph.Environment = Drupal.behaviors.EvalInfograph.Environment || []
      //
      // // Set default grphs urls
      // Drupal.behaviors.EvalInfograph.Environment = [
      //   {'id': 'plot_def_cycloM', 'url': 'http://localhost:8008/indicators/plot_def_cycloM' },
      //   {'id': 'plot_def_drw_cycloM', 'url': 'http://localhost:8008/indicators/plot_def_drw_cycloM'}
      // ]


      /*
      * Fill the water portfolio select
      */
      $('#wpp').once().each(function() {

        console.log(settings.prjo_dap);
        // get selected wpp from url params
        var urlParams = new URLSearchParams(window.location.search);
        // console.log(urlParams.get('wpp'));
        Drupal.behaviors.EvalInfograph.WPP = urlParams.get('wpp');

        // Call portfolios list to fill the select box &&
        // set selected
        // TODO add configuration for url in module
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8008/portfolios',
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

        // Attach onChange Functionalities
        // https://stackoverflow.com/questions/12750307/jquery-select-change-event-get-selected-option

        $( "#wpp" ).change(function() {
          // console.log( "Handler for .change() called." );
          // var optionSelected = $("option:selected", this);
          var valueSelected = this.value;
          // console.log(optionSelected);
          console.log(valueSelected);

          // Get all plot ids
          $(".dap_plot").each(function( index ) {
            console.log( index + ": " + $( this ).attr('id') );
          });
          /*
          / Pass new value foreach graph
          */
          $.ajax({
              type: 'GET',
              // url: 'http://localhost:8008/indicators/plot_def_cycloM?fullPage=False&i_table=i_sqwdef_irrd_m&expF='+ valueSelected +'',
              url: Drupal.behaviors.EvalInfograph.Url+'/indicators/plot_def_cycloM?fullPage=False&i_table=i_sqwdef_irrd_m&expF='+ valueSelected +'',
              success: parseHTML,

              // complete: setGCjsonObject,
          });

          // Success function callback for the ajax call
          function parseHTML (data, textStatus, jqXHR) {
            // console.log(data);
            $('#plot_def_cycloM').empty()
            $('#plot_def_cycloM').append(data);
          }
        });


      });

      /*
      * Fill the scenario select
      */
      $('#scen').once().each(function() {

        // get selected wpp from url params
        var urlParams = new URLSearchParams(window.location.search);
        // console.log(urlParams.get('wpp'));
        var wpp = urlParams.get('wpp')

        // Call portfolios list to fill the select box &&
        // set selected
        // TODO add configuration for url in module
        $.ajax({
            type: 'GET',
            url: Drupal.behaviors.EvalInfograph.Url+'/scenarios',
            success: parseJson,
            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseJson (data, textStatus, jqXHR) {
          // console.log(data);
          // console.log(JSON.parse(data));
          var scenarios = JSON.parse(data);
          var out = '';
          $.each(scenarios.scen, function( index, value ) {
            // '<option selected>Open this select menu</option>'
            if (value == Drupal.behaviors.EvalInfograph.WPP) {
              out += '<option selected value="'+value+'">'+value+'</option>'
            } else {
              out += '<option value="'+value+'">'+value+'</option>'
            }

          });
          $('#scen').append(out);
          // $('#scen').bsMultiSelect({
          //     // setSelected: function(option /*element*/, value /*true|false*/){
          //     //     if (value)
          //     //         option.setAttribute('selected','');
          //     //     else
          //     //         option.removeAttribute('selected');
          //     //     option.selected = value;
          //     // }
          // });
        }

        // Attach onChange Functionalities
        // https://stackoverflow.com/questions/12750307/jquery-select-change-event-get-selected-option


        // $( "#scen" ).change(function() {
        //   // console.log( "Handler for .change() called." );
        //   // var optionSelected = $("option:selected", this);
        //   var valueSelected = this.value;
        //   // console.log(optionSelected);
        //   // console.log(valueSelected);
        //
        //   /*
        //   / Pass new value foreach graph
        //   */
        //   $.ajax({
        //       type: 'GET',
        //       url: 'http://localhost:8008/indicators/graph_params_new?fullPage=False&i_table=i_sqwdef_irrd_m&scenF='+ valueSelected +'&expF=s&loc=Locone',
        //       // http://localhost:8008/indicators/graph_params_new?fullPage=false&i_table=i_sqwdef_irrd_m&expF=WPP1
        //       success: parseHTML,
        //       // complete: setGCjsonObject,
        //   });
        //
        //   // Success function callback for the ajax call
        //   function parseHTML (data, textStatus, jqXHR) {
        //     // console.log(data);
        //     $('#plot_def_cycloM').empty()
        //     $('#plot_def_cycloM').append(data);
        //   }
        // });

      });


      /*
      * INIT Graph 1
      */
      $('#plot_def_cycloM').once().each(function() {

        $.ajax({
            type: 'GET',
            // url: 'http://localhost:8008/indicators/graph_params_new?fullPage=False&i_table=i_sqwdef_irrd_m&scenF=rcp8.5&expF=s&loc=Locone',
            // url: 'http://localhost:8008/indicators/plot_def_cycloM?fullPage=False&i_table=i_sqwdef_irrd_m',
            url: Drupal.behaviors.EvalInfograph.Url+'/indicators/plot_def_cycloM?fullPage=False&i_table=i_sqwdef_irrd_m&expF='+Drupal.behaviors.EvalInfograph.WPP,
            success: parseHTML,
            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseHTML (data, textStatus, jqXHR) {
          // console.log(data);
          $('#plot_def_cycloM').append(data);
        }

      });

      /*
      * Graph 2
      */
      $('#plot_def_drw_cycloM').once().each(function() {

        $.ajax({
            type: 'GET',
            // url: Drupal.behaviors.EvalInfograph.Url+'/indicators/plot_def_drw_cycloM?fullPage=False&scenF=rcp8.5&expF=s',
            url: Drupal.behaviors.EvalInfograph.Url+'/indicators/plot_def_drw_cycloM?fullPage=False&scenF=rcp8.5&expF=s',

            success: parseHTML,

            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseHTML (data, textStatus, jqXHR) {
          // console.log(data);
          $('#plot_def_drw_cycloM').append(data);
        }

      });

    }
  };

})(jQuery);
