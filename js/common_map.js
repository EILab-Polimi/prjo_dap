/**
 * @file
 * JavaScript for graph insertion.
 * see initMathjs in prjo_ucp_analysis
 */

(function ($) {


  Drupal.behaviors.OLCommon = {
    attach: function (context, settings) {

      Drupal.behaviors.OLCommon.qgsUrl = Drupal.behaviors.OLCommon.qgsUrl || settings.prjo_dap.qgis_url;
      Drupal.behaviors.OLCommon.qgisProject = Drupal.behaviors.OLCommon.qgisProject || {};

      // Drupal.behaviors.OLCommon.Map = Drupal.behaviors.OLCommon.Map || null;
      Drupal.behaviors.OLCommon.Map = Drupal.behaviors.OLCommon.Map || {};
      Drupal.behaviors.OLCommon.overGroup = Drupal.behaviors.OLCommon.overGroup || {};
      Drupal.behaviors.OLCommon.overLayers = Drupal.behaviors.OLCommon.overLayers || {};


      // OK exploited
      // recursive function to create json tree

      Drupal.behaviors.OLCommon.jsonTreeString = function (key, val) {
        Drupal.behaviors.OLCommon.GroupID = Drupal.behaviors.OLCommon.GroupID || 0;
        console.log("GROUP ID "+ Drupal.behaviors.OLCommon.GroupID);
        console.log('---- jsonTreeString ---- ' + key);
        console.log(val);

        if (val.Layer instanceof Array) {
          console.log("ENTERED ITERATION");
          // Reverse the array of layers
          // This is to have the order in Legend like in Qgis desktop project
          val.Layer.reverse()

          // Set the GroupID globally to fill the array
          Drupal.behaviors.OLCommon.GroupID = key;

          // Create the group with GroupID - the GroupID does not change in recursion
          Drupal.behaviors.OLCommon.overGroup[Drupal.behaviors.OLCommon.GroupID] = new ol.layer.Group({
            'title': val.Title,
            layers: [],
          })
          Drupal.behaviors.OLCommon.overLayers[Drupal.behaviors.OLCommon.GroupID] = Drupal.behaviors.OLCommon.overGroup[Drupal.behaviors.OLCommon.GroupID].getLayers();

          // Call recursion
          $.each(val.Layer, Drupal.behaviors.OLCommon.jsonTreeString);
        } else {
            var t = new ol.layer.Image({
                type: 'layer',
                title: val.Title,
                source: new ol.source.ImageWMS({
                  // url: qgsUrl + '?map=' + qgsMap,
                  url: Drupal.behaviors.OLCommon.qgsUrl + '?map=/project/' + Drupal.behaviors.OLCommon.qgisProject[Drupal.behaviors.OLCommon.id] +'.qgs',
                  params: {'LAYERS': val.Title},
                  ratio: 1,
                  serverType: 'qgis'
                })
              })

            // Manage Case with no subgroups
            if ( ! Drupal.behaviors.OLCommon.overLayers.hasOwnProperty(Drupal.behaviors.OLCommon.GroupID) ){
              Drupal.behaviors.OLCommon.overGroup[Drupal.behaviors.OLCommon.GroupID] = new ol.layer.Group({
                'title': 'TEST',
                layers: [],
              })
              Drupal.behaviors.OLCommon.overLayers[Drupal.behaviors.OLCommon.GroupID] = Drupal.behaviors.OLCommon.overGroup[Drupal.behaviors.OLCommon.GroupID].getLayers();
            }

            Drupal.behaviors.OLCommon.overLayers[Drupal.behaviors.OLCommon.GroupID].push(t);
        }
        Drupal.behaviors.OLCommon.overLayers[Drupal.behaviors.OLCommon.GroupID] = Drupal.behaviors.OLCommon.overGroup[Drupal.behaviors.OLCommon.GroupID].getLayers();

      }



      /**
      // Function to filter the map given the selected WPP and the map div
      //
      // @id - the div id for this map
      // @qgisProject - the project name of the Map to show
      */
      Drupal.behaviors.OLCommon.SetUp = function (id, qgisProject){
          console.log("CALLED SETUP WITH id=" + id + " and project=" +qgisProject);

          // Set global Drupal.behaviors.OLCommon.id to id
          // Inside this function use id
          // The Drupal.behaviors.OLCommon.id settled is used inside
          // Drupal.behaviors.OLCommon.jsonTreeString function after GetCapabilities
          // function parseGetCapabilities to fill Drupal.behaviors.OLCommon.overLayers
          Drupal.behaviors.OLCommon.id = id;
          // Set globally the qgisProject name
          // Used in Drupal.behaviors.OLCommon.jsonTreeString function
          Drupal.behaviors.OLCommon.qgisProject[id] = qgisProject;

          // console.log(Drupal.behaviors.OLCommon.qgsUrl);

          var mapCenter = [1833763.52, 5021650.70];
          var mapZoom = 8;

          // Instantiate the map
          var view = new ol.View({
                // projection: 'EPSG:4326',
                center: mapCenter,
                zoom: mapZoom
          })
          // var olMap = new ol.Map({
          Drupal.behaviors.OLCommon.Map[id] = new ol.Map({
            layers: [],
            // target: 'map',
            // target: 'outl_m2',
            target: id,
            view: view
          });

          // Create an empty object for overGroup
          // Drupal.behaviors.OLCommon.overGroup[id] = new ol.layer.Group({
          //   'title': 'All Layers',
          //   layers: [],
          //   // fold: 'open',
          // });
          //
          // // Create an empty object for overLayers
          // Drupal.behaviors.OLCommon.overLayers[id] = Drupal.behaviors.OLCommon.overGroup[id].getLayers();


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
            // Passiamo i valori dalla success al complete
            complete: setGCjsonObject,
          });

          // Success function callback for the ajax call
          function parseGetCapabilities (data, textStatus, jqXHR) {
            var capability = jqXHR.responseText;
            var jsonCap = new ol.format.WMSCapabilities().read(capability);
            // console.log(jsonCap);
            $.each(jsonCap.Capability.Layer.Layer.reverse(), Drupal.behaviors.OLCommon.jsonTreeString);
            // Get the extent form the getCapability result the EPSG:3857 bbox
            // console.log(capability.Layer.BoundingBox);
          }

          function setGCjsonObject (data, textStatus, jqXHR) {

            console.log('COMPLETE GetCapabilities REQUEST');


            //???????????? Perchè non creiamo qui la mappa vuota ?????


            // console.log(jqXHR.responseText); // undefined

            // console.log(overLayers);

            var baseGroup = new ol.layer.Group({
              'title': 'Basemaps',
              layers: [],
            })
            // Sembra che i baselayers vengano raddoppiati sul wpp=1 -> mappa dw_waterloops
            // Perchè è la seconda mappa e la variable baseLayers ha già i due base layers della prima
            var baseLayers = baseGroup.getLayers();

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

            // overGroup.setLayers(overLayers);
            // SIIIII Drupal.behaviors.OLCommon.overGroup[Drupal.behaviors.OLCommon.id].setLayers(Drupal.behaviors.OLCommon.overLayers[Drupal.behaviors.OLCommon.id]) ?????

            // Drupal.behaviors.OLCommon.overGroup[id].setLayers(Drupal.behaviors.OLCommon.overLayers[id])
            baseGroup.setLayers(baseLayers);

            // DO NOT REVERSE THE ORDER layer are added to map HERE

            console.log("ADDING LAYER TO MAP "+id);
            Drupal.behaviors.OLCommon.Map[id].addLayer(baseGroup);
            // Drupal.behaviors.OLCommon.Map[id].addLayer(overGroup);
            // Drupal.behaviors.OLCommon.Map[id].addLayer(Drupal.behaviors.OLCommon.overGroup[id]);
            $.each(Drupal.behaviors.OLCommon.overGroup, function(k,v){
                Drupal.behaviors.OLCommon.Map[id].addLayer(v);
            })


            // Drupal.behaviors.OLCommon.Map[id].getLayers().forEach(layer => {
            //   console.log('--- Drupal.behaviors.OLCommon.Map.getLayers() ---');
    				// 	// console.log(layer.type);// Always undefined
    				// 	console.log('    LAYER NAME : '+ layer.get('title'));
            //   console.log(layer.getProperties());
            //   // console.log(layer.getSource());
            //
            //   // PER I BASELAYERS LE DUE FUNZIONI QUI SOTTO DANNO ERRORE
            //   // var source = layer.getSource();
						// 	// var params = source.getParams();
            //   // console.log(source);
            //   // console.log(params);
            //
            //
            //   // // TODO VERIFICARE cosa e se filtri
    				// 	// if (layer.get('title') == 'All Layers'){
    				// 	// 	layer.getLayers().forEach(layer => {
            //   //
            //   //     console.log('--- ALL LAYERS ---');
    				// 	// 		console.log('    LAYER NAME : '+ layer.get('title'));
    				// 	// 		var source = layer.getSource();
    				// 	// 		var params = source.getParams();
            //   //
            //   //     console.log(source);
            //   //     console.log(params);
    				// 	// 		if (params.LAYERS == 'new_wells'){
            //   //       console.log("--- FILTERING new_wells ---");
            //   //       params.FILTER = ''+layer.get('title')+':"exp_id" = '+Drupal.behaviors.OutlineInfograph.WPP; // Funziona
    				// 	// 		     // params.FILTER = ''+layer.get('title')+':"exp_id" = 0'; // Funziona
            //   //          // params.FILTER = ''+layer.get('title')+':"exp_id" = 1'; // Sembra non funzionare anche se a db sembra che abbimao dati
    				// 	// 		}
    				// 	// 		// if (params.LAYERS == 'i_irr_def_mean_h'){
    				// 	// 		// 	// params.FILTER = ''+layer.get('title')+':"exp_id" = 0';
            //   //     //   // params.FILTER = ''+layer.get('title')+':"exp_id" = 1';
            //   //     //   // params.FILTER = ''+layer.get('title')+':"exp_id" = 2';
            //   //     //
            //   //     //   params.FILTER = ''+layer.get('title')+':"exp_id" = 0 AND "scen_id" = 0';
            //   //     //   // params.FILTER = ''+layer.get('title')+':"exp_id" = 1';
            //   //     //   // params.FILTER = ''+layer.get('title')+':"exp_id" = 2';
            //   //     //
    				// 	// 		// }
    				// 	// 		// // console.log(params);
    				// 	// 		source.updateParams(params);
            //   //
    				// 	// 	});
    				// 	// }
            //
    				// });

            /**
            / Default implementation for LayerSwitcher
            **/
            var layerSwitcher = new ol.control.LayerSwitcher({
                    tipLabel: 'Legenda', // Optional label for button
                    // groupSelectStyle: 'group' // Can be 'children' [default], 'group' or 'none'
                    groupSelectStyle: 'children',
            });
            Drupal.behaviors.OLCommon.Map[id].addControl(layerSwitcher);

          }

      }

      // $( "#target" ).click(function() {
      //   Drupal.behaviors.OLCommon.Map.getLayers().forEach(layer => {
      //     // console.log(layer.type);
      //     console.log(layer.get('title'));
      //     console.log(layer.getProperties());
      //     // console.log(layer.getSource());
      //
      //     // PER I BASELAYERS LE DUE FUNZIONI QUI SOTTO DANNO ERRORE
      //     // var source = layer.getSource();
      //     // var params = source.getParams();
      //     // console.log(source);
      //     // console.log(params);
      //
      //     // if (glayer.type == 'group'){
      //     // 	glayer.getLayers().forEach(layer => {
      //     // 		// console.log(layer.get('title'));
      //     // 		var source = layer.getSource();
      //     // 		var params = source.getParams();
      //     //
      //     // 		if (Drupal.behaviors.Siric.SelectedTable == 'rl_comuni_selezione'){
      //     // 			params.FILTER = ''+layer.get('title')+':"com_istat" = '+newString;
      //     // 		}
      //     // 		if (Drupal.behaviors.Siric.SelectedTable == 'bacini_afferenti'){
      //     // 			params.FILTER = ''+layer.get('title')+':"bacini_id" = '+newString;
      //     // 		}
      //     // 		// console.log(params);
      //     // 		source.updateParams(params);
      //     // 	});
      //     // }
      //   });
      // });


    }
  };

})(jQuery);
