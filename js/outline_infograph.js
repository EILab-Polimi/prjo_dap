/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.OutlineInfograph = {
    attach: function (context, settings) {

      $('#wpp').once().each(function() {

        // get selected wpp from url params
        var urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get('wpp'));
        var wpp = urlParams.get('wpp')

        // Call portfolios list to fill the select box &&
        // set selected
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8008/portfolios',
            success: parseJson,
            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseJson (data, textStatus, jqXHR) {
          console.log(data);
          console.log(JSON.parse(data));
          var portfolios = JSON.parse(data);
          var out = '';
          $.each(portfolios.exp, function( index, value ) {
            // '<option selected>Open this select menu</option>'
            if (value == wpp) {
              out += '<option selected value="'+value+'">'+value+'</option>'
            } else {
              out += '<option value="'+value+'">'+value+'</option>'
            }

          });
          $('#wpp').append(out);
        }

      });

    }
  };

})(jQuery);
