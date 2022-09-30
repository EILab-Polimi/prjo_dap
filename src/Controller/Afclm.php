<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\prjo_dap\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Serialization\Json as Json;

use Symfony\Component\DependencyInjection\ContainerInterface;
use GuzzleHttp\ClientInterface;

/**
 * An example controller.
 */
class Afclm extends ControllerBase {

  /**
     * Guzzle\Client instance.
     *
     * @var \GuzzleHttp\ClientInterface
     */
    protected $httpClient;

    /**
     * {@inheritdoc}
     */
    public function __construct(ClientInterface $http_client) {
      $this->httpClient = $http_client;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container) {
      return new static(
        $container->get('http_client')
      );
    }


  /**
   * Returns a render-able array for a test page.
   * @wpp - Name of the waterportfolio passed in route path
   */
  // public function infograph($wpp) {
  public function infograph() {



    $build = [
      '#theme' => 'afclm',
      // '#attached' => [
      //   'library' => [
      //     // 'prjo_dap/jQuery-contextMenu',
      //     'prjo_dap/bsmultiselect',
      //     'prjo_dap/plotly',
      //     'prjo_dap/hiplot_one',
      //     'prjo_dap/hiplot_two',
      //     'prjo_dap/afclm',
      //     // 'prjo_dap/charts',
      //   ]
      // ],
    ];

    $request = $this->httpClient->request('GET', 'http://DAP_fastapi:8000');

    \Drupal::service('messenger')->addMessage("<code>".print_r($request->getContents(),TRUE)."</code>");

    if ($request->getStatusCode() != 200) {
      return $build;
    }

    // return $build;

  }

}
