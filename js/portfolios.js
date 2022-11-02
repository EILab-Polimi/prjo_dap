/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.Portfolios = {
    attach: function (context, settings) {


      Drupal.behaviors.Portfolios.Url = settings.prjo_dap.fastapi_url

      $('#portfolios').once().each(function() {

        console.log(settings);

        // $.ajax({
        //     type: 'GET',
        //     url: Drupal.behaviors.Portfolios.Url+'/portfolios',
        //     // url: 'http://85.94.200.117:8008/portfolios', // Docker FastAPI Production server
        //     // url: 'http://localhost:8008/portfolios', // Docker FastAPI development
        //     // url: 'http://localhost:5000/portfolios', // Dev on Pycharm FastAPI
        //
        //     success: parseJson,
        //
        //
        //     // complete: setGCjsonObject,
        // });

        //
        // TODO inject the drupal web_route before /api/
        //
        $.ajax({
            type: 'GET',
            url: settings.path.baseUrl+'api/fastapi/portfolios', // Guzzle http internal request
            // url: 'http://85.94.200.117:8008/portfolios', // Docker FastAPI Production server
            // url: 'http://localhost:8008/portfolios', // Docker FastAPI development
            // url: 'http://localhost:5000/portfolios', // Dev on Pycharm FastAPI

            success: parseJson,


            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseJson (data, textStatus, jqXHR) {
          console.log(data);

          // FROM Guzzle http internal request
          // console.log(JSON.parse(data['data']));
          var portfolios = JSON.parse(data['data']);
          // portfolios = JSON.parse(portfolios);

          // Elsewhere
          // // console.log(data);
          // console.log(JSON.parse(data));
          // var portfolios = JSON.parse(data);

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
                '<a type="button" class="btn" href='+settings.path.baseUrl+'"dap_out_infograph?wpp='+portfolios.id[index]+'">'+
                  '<i class="far fa-eye text-primary"></i>'+
                '</a>'+
                '</td>'+
                '<td>'+
                  '<a type="button" class="btn" href='+settings.path.baseUrl+'"dap_eval_infograph?wpp='+portfolios.id[index]+'">'+
                    '<i class="far fa-eye text-primary"></i>'+
                  '</a>'+
                  '<a type="button" class="btn" href='+settings.path.baseUrl+'"/geoviz_test_dashboard?wpp='+portfolios.id[index]+'">'+
                    '<i class="far fa-map text-primary"></i>'+
                  '</a>'+
                '</td>'+
              '</tr>';
              // TODO verificare che sia giusto nell'evaluation map girare sulla dashboard di geoviz con i vari tab per l'analisi
          });
          $('#portfolios').append(out);
        }

      });

    }
  };

})(jQuery);
