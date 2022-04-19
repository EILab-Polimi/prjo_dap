<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\prjo_dap\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Serialization\Json as Json;
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

    // Use external database
    // db_set_active('prjo_dap_v2');
    $connection = Database::getConnection('prjo_dap_v2', 'default');
    $query_test = $connection->query("SELECT DISTINCT storage.exp AS storage_exp
                            FROM
                            {storage} storage");

    $rows_ins = $query_test->fetchAll();

    // dpm($rows_ins);
    // Go back to the default database,
    // otherwise Drupal will not be able to access its own data later on.
    db_set_active();

    $build = [
      // '#theme' => 'message_water_request',
      '#theme' => 'portfolios',
      '#portfolios' => $rows_ins,
      // '#attached' => [
      //   'library' => [
      //     'geoviz/openlayers',
      //   ]
      // ],
    ];
    return $build;

  }

}
