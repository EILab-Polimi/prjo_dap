<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\prjo_dap\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Serialization\Json as Json;
use Drupal\Core\Url;
use Drupal\Core\Database\Database;
// use Drupal\Core\Language;
// use \Drupal\Core\Entity\EntityDefinitionUpdateManager;
// use Symfony\Component\HttpFoundation\Response;

/**
 * An example controller.
 */
class Portfolios extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   */
  public function portfolios() {

    // get the url for links
    $url = Url::fromRoute('prjo_dap.out_infograph');
    // TODO on javascript side we don't have output

    $build = [
      // '#theme' => 'message_water_request',
      '#theme' => 'portfolios',
      // '#url' => $url,
      '#attached' => [
        'library' => [
          'prjo_dap/portfolios',
        ],
        'drupalSettings' => [
          'prjo_dap' => [
              'url_out_infograph' => $url,
          ]
        ]

      ],

    ];
    return $build;

  }

}
