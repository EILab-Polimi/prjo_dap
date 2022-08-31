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
          // console.log(Drupal.behaviors.OutlineInfograph.WPP);
          // console.log(Drupal.behaviors.OutlineInfograph.WPPList.descr_plan[Drupal.behaviors.OutlineInfograph.WPP]);
          // console.log(Drupal.behaviors.OutlineInfograph.WPPList.descr_plan[Drupal.behaviors.OutlineInfograph.WPP].cards);
          $.each(Drupal.behaviors.OutlineInfograph.WPPList.descr_plan[Drupal.behaviors.OutlineInfograph.WPP].cards, function( index, card ){
            console.log(card);
            out += '<div class="col d-flex align-items-stretch">'+
                     '<div class="card mb-3 shadow">'+
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
                   '</div>'
          });
          $('#expl_cards').append(out);

        }
      }

      /*
      * Once on the wpp select box
      */
      $('#wpp').once().each(function() {

        // Set size of fixed card to other cards size
        var new_width = $('#size').width();
        $('#fixed').width(new_width);


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
