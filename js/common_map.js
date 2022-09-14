/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.OLCommon = {
    attach: function (context, settings) {

      Drupal.behaviors.OLCommon.qgsUrl = Drupal.behaviors.OLCommon.qgsUrl || settings.prjo_dap.qgis_url;
      Drupal.behaviors.OLCommon.qgisProject = Drupal.behaviors.OLCommon.qgisProject || null;

      Drupal.behaviors.OLCommon.Map = Drupal.behaviors.OLCommon.Map || null;

      // var mapCenter = [1833763.52, 5021650.70];
      // var mapZoom = 8;
      //
      // // Instantiate the map
      // var view = new ol.View({
      //       // projection: 'EPSG:4326',
      //       center: mapCenter,
      //       zoom: mapZoom
      // })
      // // var olMap = new ol.Map({
      // // Drupal.behaviors.OlCommon.OlMap = new ol.Map({
      // //   layers: [],
      // //   // target: 'map',
      // //   target: 'outl_m2',
      // //   view: view
      // // });
      //
      // Create the empty baseGroup and get it's layers
      var baseGroup = new ol.layer.Group({
        'title': 'Basemaps',
        layers: [],
      })
      var baseLayers = baseGroup.getLayers();

      // Create the empty overGroup and get it's layers
      var overGroup = new ol.layer.Group({
        'title': 'All Layers',
        layers: [],
        // fold: 'open',
      })
      var overLayers = overGroup.getLayers();


      // OK exploited
      // recursive function to create json tree
      Drupal.behaviors.OLCommon.jsonTreeString = function (key, val) {
        // console.log(key);
        // console.log(val);
        // TODO to be tested for layer groups
        if (val.Layer instanceof Array) {
          $.each(val.Layer, jsonTreeString);
        } else {
            var t = new ol.layer.Image({
              // visible: true,
              // visible: false,
                type: 'layer',
                title: val.Title,
                source: new ol.source.ImageWMS({
                  url: Drupal.behaviors.OLCommon.qgsUrl + '?map=/project/' + Drupal.behaviors.OLCommon.qgisProject +'.qgs',
                  // params: {'LAYERS': val.Name},
                  params: {'LAYERS': val.Title},
                  ratio: 1,
                  serverType: 'qgis'
                })
              })
            overLayers.push(t);
        }
      }

      /**
      // Function to filter the map given the selected WPP and the map div
      //
      // @id - the div id for this map
      // @qgisProject - the project name of the Map to show
      */
      Drupal.behaviors.OLCommon.SetUp = function (id, qgisProject){
          // console.log(id);
          // Compose the url given the parameters
          console.log(id, qgisProject);
          // Set the qgisProject name
          Drupal.behaviors.OLCommon.qgisProject = qgisProject;

          console.log(Drupal.behaviors.OLCommon.qgsUrl);

          var mapCenter = [1833763.52, 5021650.70];
          var mapZoom = 8;

          // Instantiate the map
          var view = new ol.View({
                // projection: 'EPSG:4326',
                center: mapCenter,
                zoom: mapZoom
          })
          // var olMap = new ol.Map({
          Drupal.behaviors.OLCommon.Map = new ol.Map({
            layers: [],
            // target: 'map',
            // target: 'outl_m2',
            target: id,
            view: view
          });

          // http://localhost:9003/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities&map=/project/dw_waterloops.qgs

          var url = Drupal.behaviors.OLCommon.qgsUrl+
                    '?SERVICE=WMS'+
                    '&VERSION=1.3.0'+
                    '&REQUEST=GetCapabilities'+
                    '&map=/project/'+ qgisProject +'.qgs';
          //
          console.log(url);
          //
          $.ajax({
            type: 'GET',
            url: url,
            success: parseGetCapabilities,
            complete: setGCjsonObject,
          });

          // Success function callback for the ajax call
          function parseGetCapabilities (data, textStatus, jqXHR) {
            var capability = jqXHR.responseText;
            var jsonCap = new ol.format.WMSCapabilities().read(capability);
            console.log(jsonCap);
            $.each( jsonCap.Capability.Layer.Layer.reverse(), Drupal.behaviors.OLCommon.jsonTreeString);
            // Get the extent form the getCapability result the EPSG:3857 bbox
            // console.log(capability.Layer.BoundingBox);
          }

          function setGCjsonObject (data, textStatus, jqXHR) {
            // ADD base layers
            baseLayers.push(
              new ol.layer.Tile({
                // A layer must have a title to appear in the layerswitcher
                title: 'OSM',
                // Again set this layer as a base layer
                type: 'base',
                visible: true,
                source: new ol.source.OSM({
                  // url: 'https://tiles.wmflabs.org/bw-mapnik/${z}/${x}/${y}.png',
                  // url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
                  // crossOrigin: 'http://tile.openstreetmap.org'
                })
              }),
            );
            baseLayers.push(
              new ol.layer.Tile({
                title: 'Stamen',
                type: 'base',
                source: new ol.source.Stamen({
                  layer: 'toner-lite',
                }),
              })
            );

            overGroup.setLayers(overLayers);
            baseGroup.setLayers(baseLayers);

            Drupal.behaviors.OLCommon.Map.addLayer(baseGroup);
            Drupal.behaviors.OLCommon.Map.addLayer(overGroup);

            Drupal.behaviors.OLCommon.Map.getLayers().forEach(layer => {
    					console.log(layer.type);
    					console.log(layer.get('title'));
              console.log(layer.getProperties());
              // console.log(layer.getSource());

              // PER I BASELAYERS LE DUE FUNZIONI QUI SOTTO DANNO ERRORE
              // var source = layer.getSource();
							// var params = source.getParams();
              // console.log(source);
              // console.log(params);

    					if (layer.get('title') == 'All Layers'){
    						layer.getLayers().forEach(layer => {
    							// console.log(layer.get('title'));
    							var source = layer.getSource();
    							var params = source.getParams();

                  console.log(source);
                  console.log(params);
    							if (params.LAYERS == 'new_wells'){
    							     // params.FILTER = ''+layer.get('title')+':"exp_id" = 0'; // Funziona
                       params.FILTER = ''+layer.get('title')+':"exp_id" = 1'; // Sembra non funzionare anche se a db sembra che abbimao dati
    							}
    							// if (Drupal.behaviors.Siric.SelectedTable == 'bacini_afferenti'){
    							// 	params.FILTER = ''+layer.get('title')+':"bacini_id" = '+newString;
    							// }
    							// // console.log(params);
    							source.updateParams(params);
    						});
    					}
    				});

            /**
            / Default implementation for LayerSwitcher
            **/
            var layerSwitcher = new ol.control.LayerSwitcher({
                    tipLabel: 'Legenda', // Optional label for button
                    // groupSelectStyle: 'group' // Can be 'children' [default], 'group' or 'none'
                    groupSelectStyle: 'children',
            });
            Drupal.behaviors.OLCommon.Map.addControl(layerSwitcher);

          }

      }

      $( "#target" ).click(function() {
        Drupal.behaviors.OLCommon.Map.getLayers().forEach(layer => {
          // console.log(layer.type);
          console.log(layer.get('title'));
          console.log(layer.getProperties());
          // console.log(layer.getSource());

          // PER I BASELAYERS LE DUE FUNZIONI QUI SOTTO DANNO ERRORE
          // var source = layer.getSource();
          // var params = source.getParams();
          // console.log(source);
          // console.log(params);

          // if (glayer.type == 'group'){
          // 	glayer.getLayers().forEach(layer => {
          // 		// console.log(layer.get('title'));
          // 		var source = layer.getSource();
          // 		var params = source.getParams();
          //
          // 		if (Drupal.behaviors.Siric.SelectedTable == 'rl_comuni_selezione'){
          // 			params.FILTER = ''+layer.get('title')+':"com_istat" = '+newString;
          // 		}
          // 		if (Drupal.behaviors.Siric.SelectedTable == 'bacini_afferenti'){
          // 			params.FILTER = ''+layer.get('title')+':"bacini_id" = '+newString;
          // 		}
          // 		// console.log(params);
          // 		source.updateParams(params);
          // 	});
          // }
        });

      });


    }
  };

})(jQuery);
