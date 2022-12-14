<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\prjo_dap\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Serialization\Json as Json;

// use Drupal\Core\Language;
// use \Drupal\Core\Entity\EntityDefinitionUpdateManager;
// use Symfony\Component\HttpFoundation\Response;

/**
 * An example controller.
 */
class Outline extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   * @wpp - Name of the waterportfolio passed in route path
   */
  // public function infograph($wpp) {
  public function infograph() {

    // Get the configured url for fastAPI
    $config = \Drupal::config('dap.settings');

    if ($config->get('fastapi_sel') == 0){
      $fastAPIurl = $config->get('fastapi_dev_url');
    } else {
      $fastAPIurl = $config->get('fastapi_prod_url');
    }

    // Get the configured url for Qgis server
    $config = \Drupal::config('geoviz.settings');

    if ($config->get('qgis_server_sel') == 0){
      $QgisUrl = $config->get('qgis_server_dev_url');
    } else {
      $QgisUrl = $config->get('qgis_server_prod_url');
    }

    $build = [
      '#theme' => 'evaluation_outline',
      '#attached' => [
        'library' => [
          // 'prjo_dap/jQuery-contextMenu',
          // 'prjo_dap/bsmultiselect',
          'prjo_dap/openlayers',
          'prjo_dap/ol-layerswitcher',
          'prjo_dap/plotly',
          'prjo_dap/outline-infograph',
          // 'prjo_dap/charts',
        ],
        'drupalSettings' => [
          'prjo_dap' => [
              'fastapi_url' => $fastAPIurl,
              'qgis_url' => $QgisUrl,
          ]
        ]
      ],
    ];
    return $build;

  }

}
