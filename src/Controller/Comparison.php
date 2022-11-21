<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\prjo_dap\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Serialization\Json as Json;

/**
 * An example controller.
 */
class Comparison extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   */
  public function comparison() {

    $build = [
      // '#theme' => 'message_water_request',
      '#theme' => 'comparison',
      '#attached' => [
        'library' => [
          'prjo_dap/hiplot',
        ]
      ],
    ];
    return $build;

  }

}
