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
class Evaluation extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   */
  public function infograph() {

    // Use external database
    // db_set_active('prjo_dap');
    // $query_test = db_query("SELECT DISTINCT storage.exp AS storage_exp
    //                         FROM
    //                         {storage} storage");
    //
    // $rows_ins = $query_test->fetchAll();
    //
    // // dpm($rows_ins);
    // // Go back to the default database,
    // // otherwise Drupal will not be able to access its own data later on.
    // db_set_active();

    $build = [
      // '#theme' => 'message_water_request',
      '#theme' => 'evaluation_infograph',
      // '#portfolios' => $rows_ins,
      '#attached' => [
        'library' => [
          // 'prjo_dap/jQuery-contextMenu',
          'prjo_dap/bootstrap-multiselect',
          'prjo_dap/plotly',
          'prjo_dap/test',
          'prjo_dap/charts',
        ]
      ],
    ];
    return $build;

  }

  public function pyplotly() {
    $build = [
      // '#theme' => 'message_water_request',
      '#theme' => 'evaluation_pyplotly',
      // '#portfolios' => $rows_ins,
      '#attached' => [
        'library' => [
          // 'prjo_dap/jQuery-contextMenu',
          'prjo_dap/bootstrap-multiselect',
          'prjo_dap/plotly',
          'prjo_dap/test-pyplotly',
          // 'prjo_dap/charts',
        ]
      ],
    ];
    return $build;

  }

}