/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.Portfolios = {
    attach: function (context, settings) {

      $('#portfolios').once().each(function() {

        console.log(settings);

        $.ajax({
            type: 'GET',
            url: 'http://localhost:8008/portfolios',
            // url: 'http://local.wp4dap_dev.it:8008/portfolios',

            // Questi due non esistono in quanto non c'è un servizio su localhost:8000
            // esiste su fastapi:8000 che forwarda la sua 8000 sulla 8008
            // url: 'http://localhost:8000/portfolios',
            // url: 'http://local.wp4dap_dev.it:8000/portfolios',

            success: parseJson,


            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseJson (data, textStatus, jqXHR) {
          // console.log(data);
          console.log(JSON.parse(data));
          var portfolios = JSON.parse(data);
          var out = '';
          $.each(portfolios.exp, function( index, value ) {
            out += '<tr>'+
              '<td>'+
                '<span class="fa-stack">'+
                  '<i class="fas fa-circle fa-stack-2x text-primary"></i>'+
                  '<i class="fas fa-folder-open fa-stack-1x fa-inverse"></i>'+
                '</span>'+
                value +'</td>'+
                '<td>4</td>'+
                '<td>Test description</td>'+
                '<td>'+
                '<a type="button" class="btn" href="/dap_out_infograph?wpp='+value+'">'+
                  '<i class="far fa-eye text-primary"></i>'+
                '</a>'+
                '</td>'+
                '<td>'+
                  '<a type="button" class="btn" href="/dap_eval_infograph?wpp='+value+'">'+
                    '<i class="far fa-eye text-primary"></i>'+
                  '</a>'+
                  '<a type="button" class="btn">'+
                    '<i class="far fa-map text-primary"></i>'+
                  '</a>'+
                '</td>'+
              '</tr>';
          });
          $('#portfolios').append(out);
        }

      });

    }
  };

})(jQuery);
