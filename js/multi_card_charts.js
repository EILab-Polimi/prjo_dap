/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.MultiCardCharts = {
    attach: function (context, settings) {

      // Drupal.behaviors.MultiCardCharts.StartPlot = Drupal.behaviors.MultiCardCharts.StartPlot || false;
      Drupal.behaviors.MultiCardCharts.SelectionArray = Drupal.behaviors.MultiCardCharts.SelectionArray || {};
      Drupal.behaviors.MultiCardCharts.Grid = Drupal.behaviors.MultiCardCharts.Grid || {};
      Drupal.behaviors.MultiCardCharts.Annotations = Drupal.behaviors.MultiCardCharts.Annotations || [];
      Drupal.behaviors.MultiCardCharts.Scenari = Drupal.behaviors.MultiCardCharts.Scenari || [];
      Drupal.behaviors.MultiCardCharts.SubPlots = Drupal.behaviors.MultiCardCharts.SubPlots || [];

      Drupal.behaviors.MultiCardCharts.GrphData = Drupal.behaviors.MultiCardCharts.GrphData || [];

      var colorScale = Plotly.d3.scale.category10();
      // console.log(colorScale('test'));


      $('#charts_wrapper').once().each(function() {


        $('#ind').on('change', function (e) {
          console.log($(this).val());
          console.log();
          if($(this).val() != '0' && ( !($('#'+$(this).val()+'_chart').length) ) ){
            // console.log($("option:selected", this).text());
            var out =  '<div class="row mt-3">' +
                '<div class="col">'+
                  '<div id="'+$(this).val()+'" class="card">'+
                    '<div class="card-header">'+$("option:selected", this).text()+ ' Chart'+
                    '<div class="dropdown float-right">'+
                      '<button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">'+
                        'Chart'+
                      '</button>'+
                      '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">'+
                        '<a class="dropdown-item" data-custom-value="edit" href="#">Edit</a>'+
                        '<a class="dropdown-item" data-custom-value="remove" href="#">Remove</a>'+
                        '<a class="dropdown-item" href="#">Something else here</a>'+
                      '</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="card-body">'+
                      '<div class="row"><div class="col"><div class="form-row align-items-center">'+
                        '<div class="col-auto my-1">'+
                          '<label class="mr-sm-2" for="wpp" style="font-size: 10px;">Selected water Portfolio</label>'+
                          '<select class="custom-select mr-sm-2 chart-select" data-option="wpp" style="background-color: #026698; color: white;">'+
                            '<option value="Bau">Bau</option>'+
                            '<option value="WPP1">WPP1</option>'+
                            '<option value="WPP2">WPP2</option>'+
                            '<option value="WPP3">WPP3</option>'+
                            '<option value="WPP4">WPP4</option>'+
                            '<option value="hist">hist</option>'+
                          '</select>'+
                        '</div>'+
                        '<div class="col-auto my-1">'+
                          '<label class="mr-sm-2" for="scen" style="font-size: 10px;">Selected Scenario</label>'+
                          '<select class="custom-select mr-sm-2 chart-select" multiple="multiple" data-option="scen" style="background-color: #026698; color: white;">'+
                            '<option value="baseline">baseline</option>'+
                            '<option value="rcp4.5">rcp4.5</option>'+
                            '<option value="rcp8.5">rcp8.5</option>'+
                          '</select>'+
                        '</div>'+
                        '<div class="col-auto my-1">'+
                          '<label class="mr-sm-2" for="loc" style="font-size: 10px;">Selected Locality</label>'+
                          '<select class="custom-select mr-sm-2 chart-select" multiple="multiple" data-option="loc" style="background-color: #026698; color: white;">'+
                            '<option value="Pertusillo">Pertusillo</option>'+
                            '<option value="Locone">Locone</option>'+
                            '<option value="Occhito">Occhito</option>'+
                            '<option value="MonteCotugno">MonteCotugno</option>'+
                            '<option value="Conza">Conza</option>'+
                          '</select>'+
                        '</div>'+

                      '</div></div></div>'+
                      '<div id="'+$(this).val()+'_chart"></div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>';
            $('#charts_wrapper').append(out);
          }

          // Attach functionalities to dropdown anchors
          $('.dropdown-item').on('click', function(e){
            console.log($(this).data('custom-value'));
            if($(this).data('custom-value') == 'edit'){

            }
          });

          // Enable bootstrap-multiselect on wpp, scen and loc select widget
          $('.chart-select').each(function(){
            $(this).multiselect({
                enableFiltering: true,
                templates: {
                  filter: '<div class="multiselect-filter"><div class="input-group input-group-sm p-1"><div class="input-group-prepend"></div><input class="form-control multiselect-search" type="text" /><div class="input-group-append"><button class="multiselect-clear-filter input-group-text" type="button"><i class="fas fa-times"></i></button></div></div></div>'
                   // filter: '<div class="multiselect-filter"><div class="input-group input-group-sm p-1"><div class="input-group-prepend"><i class="input-group-text fas fa-search"></i></div><input class="form-control multiselect-search" type="text" /><div class="input-group-append"><button class="multiselect-clear-filter input-group-text" type="button"><i class="fas fa-times"></i></button></div></div></div>'
                }
             });
          });

          // Attach functionalities when changing the options
          $('.chart-select').on('change', function (e) {
            Drupal.behaviors.MultiCardCharts.Annotations = [];
            $('.chart-select').each(function(){
              // Change locality array - each locality will print a subplot
              if($(this).data('option') == 'loc'){
                // $('#example option:selected');
                // var optionSelected = $("option:selected", this).val();
                console.log('Locality');
                var optionSelected = $("option:selected", $(this)).map(function(a, item){return item.value;})
                console.log(optionSelected);
                // Set the grid option to reflect the status of selected loc
                if (optionSelected.length > 1){
                  var quotient =  (optionSelected.length - optionSelected.length % 2) / 2;
                  var remainder = optionSelected.length % 2;
                  console.log(quotient);
                  console.log(remainder);
                  rows = quotient + remainder
                  Drupal.behaviors.MultiCardCharts.Grid = {rows: rows, columns: 2, pattern: 'independent'}


                  // Set Annotations
                  var pt = 0.2;
                  for (let i = 0; i < optionSelected.length ; i++) {
                    // pos = i+1;
                    // if(pos % 2 == 0) {
                    //   var xDomain = 0.75
                    //   var yDomain = 1 / pos;
                    // } else {
                    //   var xDomain = 0.25
                    //   var j = i-1
                    //   var yDomain = 1 / j;
                    // }

                    if (i == 0) {
                      var xDomain = 0.20
                      var yDomain = 1+pt
                    } else {
                      if(i % 2 == 0) {
                        var xDomain = 0.20
                        var yDomain = (1 / i)+pt;
                      } else {
                        var xDomain = 0.75
                        var j = i-1
                        if (j == 0) {
                          j = 1
                        }
                        var yDomain = (1 / j)+pt;
                      }
                    }

                    Drupal.behaviors.MultiCardCharts.Annotations.push(
                      {
                        text: optionSelected[i],
                        font: {
                          size: 16,
                          // color: 'green',
                        },
                        showarrow: false,
                        align: 'center',
                        x: xDomain, //position in x domain
                        y: yDomain, //position in y domain
                        xref: 'paper',
                        yref: 'paper',
                      }
                    )
                  }
                }
                // Set an array with subplot data
                Drupal.behaviors.MultiCardCharts.SubPlots = optionSelected


              }
              // Change scen array - each scen will print a trace inside each subplot
              if($(this).data('option') == 'scen'){
                console.log('Scenario');
                var optionSelected = $("option:selected", $(this)).map(function(a, item){return item.value;})
                console.log(optionSelected);
                Drupal.behaviors.MultiCardCharts.Scenari = optionSelected
              }

            }).promise().done( function(){
              // console.log(Drupal.behaviors.TestGraph.SelectionArray);
              // console.log($.inArray( "0", Drupal.behaviors.TestGraph.SelectionArray ));
              console.log('In promise');
              console.log(Drupal.behaviors.MultiCardCharts.SubPlots);
              console.log(Drupal.behaviors.MultiCardCharts.Scenari);
              // console.log(Drupal.behaviors.TestGraph.SelectionArray.wpp);
              // // $.each(Drupal.behaviors.TestGraph.SelectionArray, function(index, value){
              // //   console.log(value);
              // // })
              if(Drupal.behaviors.MultiCardCharts.Scenari.length >= 1 && Drupal.behaviors.MultiCardCharts.SubPlots.length >= 1 ){
                // Drupal.behaviors.TestGraph.StartPlot = true;
                setTraces();
              }
            });


          });
        });

      });
        // $.get("dap_composable?query={article(id:9){id title author body}}", function(data, status){
        //   console.log("Status: " + status);
        //   console.log(data);
        // });

        //
        // Utility function to get column values
        //
      function unpack(rows, key) {
        // return rows.map(function(row) { return row[key]; });
        return rows.map(function(row) { return parseFloat(row[key]); });

      }

      function calcDomain(index, N) {
        var pad = 0.02;
        var height = 1 / N;

        return [
          index * (width) + pad / 2,
          (index + 1) * (width) - pad / 2
        ];
      }

        function setTraces(){
          Drupal.behaviors.MultiCardCharts.GrphData = [];
          $.each( Drupal.behaviors.MultiCardCharts.SubPlots, function(spind, subplot){
            $.each( Drupal.behaviors.MultiCardCharts.Scenari, function(scenind, scenario){
              console.log(spind +' '+ subplot);
              console.log(scenind +' '+ scenario);
              // $.get('dap_ext_db?query={article(ind:"i_mean_y_s",scen:"'+scen+'",loc:"'+loc+'",exp:"'+exp+'"){value%20ts}}', function(response, status){
              var exp = 'WPP3'
              $.get('dap_ext_db?query={article(ind:"i_mean_y_s",scen:"'+scenario+'",loc:"'+subplot+'",exp:"'+exp+'"){value%20ts}}', function(response, status){
                console.log("Status: " + status);
                if(status == 'success'){
                  console.log(response.data.article);

                  var x = unpack(response.data.article, 'ts');
                  var y = unpack(response.data.article, 'value');

                  if (spind == 0){
                    var trace1 = {
                      x: x,
                      y: y,
                      name: scenario,
                      legendgroup: scenario,
                      mode: 'lines',
                      line: {
                        color: colorScale(scenario)
                      },
                    };
                  } else {
                    var subplotid = spind+1
                    var trace1 = {
                      x: x,
                      y: y,
                      legendgroup: scenario,
                      showlegend: false,
                      mode: 'lines',
                      xaxis: 'x'+subplotid,
                      yaxis: 'y'+subplotid,
                      line: {
                        color: colorScale(scenario)
                      },
                    };
                  }

                  Drupal.behaviors.MultiCardCharts.GrphData.push(trace1)

                }
              });
            })
          }).promise().done( function(){

            // Wait for all the ajax requests to be filled
            $(document).ajaxStop(function () {
              // 0 === $.active
              console.log(Drupal.behaviors.MultiCardCharts.GrphData);
              // var grphdata = [ trace1 ];

              // var title = loc+' '+ ind +' storage - Scenario: '+scen
              layout = {
                title: 'Test',
                // font: {size: 4},
                grid: Drupal.behaviors.MultiCardCharts.Grid,
                annotations: Drupal.behaviors.MultiCardCharts.Annotations,
              }

              var config = {responsive: true,
                            // scrollZoom: true // not working for radial
                          }

              Plotly.newPlot("lineplotly", Drupal.behaviors.MultiCardCharts.GrphData, layout, config)

            });
          });



        }

    }
  };
})(jQuery);
