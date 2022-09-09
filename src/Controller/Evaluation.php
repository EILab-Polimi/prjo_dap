<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\prjo_dap\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Serialization\Json as Json;

/**
 * An example controller.
 */
class Evaluation extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   */
  public function infograph() {

    $config = \Drupal::config('dap.settings');

    if ($config->get('fastapi_sel') == 0){
      $fastAPIurl = $config->get('fastapi_dev_url');
    } else {
      $fastAPIurl = $config->get('fastapi_prod_url');
    }

    $build = [
      // '#theme' => 'message_water_request',
      '#theme' => 'evaluation_infograph',
      // '#portfolios' => $rows_ins,
      '#attached' => [
        'library' => [
          // 'prjo_dap/bsmultiselect',
          'prjo_dap/plotly',
          'prjo_dap/eval-infograph',
          // 'prjo_dap/charts',
        ],
        'drupalSettings' => [
          'prjo_dap' => [
              'fastapi_url' => $fastAPIurl,
          ]
        ]
      ],
    ];
    return $build;

  }


  public function map() {

    $config = \Drupal::config('dap.settings');

    if ($config->get('fastapi_sel') == 0){
      $fastAPIurl = $config->get('fastapi_dev_url');
    } else {
      $fastAPIurl = $config->get('fastapi_prod_url');
    }

    $build = [
      // '#theme' => 'message_water_request',
      '#theme' => 'evaluation_infograph',
      // '#portfolios' => $rows_ins,
      '#attached' => [
        'library' => [
          // 'prjo_dap/bsmultiselect',
          'prjo_dap/plotly',
          'prjo_dap/eval-infograph',
          // 'prjo_dap/charts',
        ],
        'drupalSettings' => [
          'prjo_dap' => [
              'fastapi_url' => $fastAPIurl,
          ]
        ]
      ],
    ];
    return $build;

  }

  // TESTING
  public function pyplotly() {

    $build = [
      // '#theme' => 'message_water_request',
      '#theme' => 'evaluation_pyplotly',
      '#data' => $graph,
      '#attached' => [
        'library' => [
          // 'prjo_dap/bootstrap-multiselect',
          'prjo_dap/plotly',
          'prjo_dap/test-pyplotly',
          // 'prjo_dap/charts',
        ]
      ],
    ];
    return $build;

  }

}
