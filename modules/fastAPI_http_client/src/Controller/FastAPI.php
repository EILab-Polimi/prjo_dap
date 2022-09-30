<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\fastAPI_http_client\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Serialization\Json as Json;

use Symfony\Component\DependencyInjection\ContainerInterface;
use GuzzleHttp\ClientInterface;
use Symfony\Component\HttpFoundation\JsonResponse;


/**
 * An example controller.
 */
class FastAPI extends ControllerBase {

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
  public function getData() {


    // USE IN PRODUCTION (DOCKER STACK)
    // $request = $this->httpClient->request('GET', 'http://DAP_fastapi:8000');
    $request = $this->httpClient->request('GET', 'http://localhost:5000/portfolios');

    // \Drupal::service('messenger')->addMessage("<code>".print_r($request->getStatusCode(),TRUE)."</code>");

    $status = $request->getStatusCode();

    $body = $request->getBody();
    // \Drupal::service('messenger')->addMessage("<code>".print_r($body,TRUE)."</code>");

    $contents = $body->getContents();
    // \Drupal::service('messenger')->addMessage("<code>".print_r($contents,TRUE)."</code>");

    // transform $contents to array !!!
    // Dipende perchè non tutte le response di fastAPI sono json

    return new JsonResponse([ 'data' => $contents, 'method' => 'GET', 'status'=> $status]);

  }

}
