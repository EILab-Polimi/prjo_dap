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
            // url: 'http://localhost:8008/portfolios', // Dev on Docker FastAPI
            url: 'http://localhost:5000/portfolios', // Dev on Pycharm FastAPI

            success: parseJson,


            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseJson (data, textStatus, jqXHR) {
          // console.log(data);
          console.log(JSON.parse(data));
          var portfolios = JSON.parse(data);
          var out = '';
          $.each(portfolios.id, function( index, value ) {
            console.log(index +' '+value );
            console.log(portfolios.label[index]);
            out += '<tr>'+
              '<td>'+
                '<span class="fa-stack">'+
                  '<i class="fas fa-circle fa-stack-2x text-primary"></i>'+
                  '<i class="fas fa-folder-open fa-stack-1x fa-inverse"></i>'+
                '</span>'+
                portfolios.label[index] +'</td>'+
                '<td>4</td>'+
                '<td>'+ portfolios.descr_plan[index].short_descr +'</td>'+
                '<td>'+
                '<a type="button" class="btn" href="/dap_out_infograph?wpp='+portfolios.id[index]+'">'+
                  '<i class="far fa-eye text-primary"></i>'+
                '</a>'+
                '</td>'+
                '<td>'+
                  '<a type="button" class="btn" href="/dap_eval_infograph?wpp='+portfolios.id[index]+'">'+
                    '<i class="far fa-eye text-primary"></i>'+
                  '</a>'+
                  // '<a type="button" class="btn">'+
                  //   '<i class="far fa-map text-primary"></i>'+
                  // '</a>'+
                '</td>'+
              '</tr>';

          });
          $('#portfolios').append(out);
        }

      });

    }
  };

})(jQuery);
