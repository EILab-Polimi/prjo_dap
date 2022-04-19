<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\prjo_dap_gql\Controller;

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
  public function infograph($wpp) {

    // dpm($wpp);

    $build = [
      '#theme' => 'evaluation_outline',
      '#attached' => [
        'library' => [
          // 'prjo_dap_gql/jQuery-contextMenu',
          'prjo_dap_gql/bootstrap-multiselect',
          'prjo_dap_gql/plotly',
          'prjo_dap_gql/outline-infograph',
          // 'prjo_dap_gql/charts',
        ],
        'drupalSettings' => [
          'prjo_dap' => [
              'wpp' => $wpp,
          ]
        ]

      ],
    ];
    return $build;

  }

}
