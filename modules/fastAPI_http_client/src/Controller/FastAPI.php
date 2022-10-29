<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\fastAPI_http_client\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Serialization\Json as Json;

use Symfony\Component\DependencyInjection\ContainerInterface;
use GuzzleHttp\ClientInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;



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


    $build = [
      '#theme' => 'afclm',
    ];


    \Drupal::service('messenger')->addMessage("<code>".print_r($remoteurl,TRUE)."</code>");

    return $build;

    // // USE IN PRODUCTION (DOCKER STACK)
    // // $request = $this->httpClient->request('GET', 'http://DAP_fastapi:8000');
    // $request = $this->httpClient->request('GET', 'http://localhost:5000/portfolios');
    //
    // // \Drupal::service('messenger')->addMessage("<code>".print_r($request->getStatusCode(),TRUE)."</code>");
    //
    // $status = $request->getStatusCode();
    //
    // $body = $request->getBody();
    // // \Drupal::service('messenger')->addMessage("<code>".print_r($body,TRUE)."</code>");
    //
    // $contents = $body->getContents();
    // // \Drupal::service('messenger')->addMessage("<code>".print_r($contents,TRUE)."</code>");
    //
    // // transform $contents to array !!!
    // // Dipende perchè non tutte le response di fastAPI sono json
    //
    // // 1- $contents viene jsonencodato 2 volte
    //
    // return new JsonResponse([ 'data' => $contents, 'method' => 'GET', 'status'=> $status]);

  }

  public function portfolios() {
    // Get configured url development or production for fastAPI service
    // development for localhost
    // production for docker container 
    $config = \Drupal::config('dap.settings');
    if ($config->get('fastapi_sel') == 0){
      $fastAPIurl = $config->get('fastapi_dev_url');
    } else {
      $fastAPIurl = $config->get('fastapi_prod_url');
    }

    // \Drupal::service('messenger')->addMessage("<code>".print_r($fastAPIurl .'/portfolios',TRUE)."</code>");

    $request  = $this->httpClient->request('GET', $fastAPIurl.'/portfolios');
    $status   = $request->getStatusCode();
    $body     = $request->getBody();
    $contents = $body->getContents();

    // transform $contents to array !!!
    // Dipende perchè non tutte le response di fastAPI sono json

    // 1- $contents viene jsonencodato 2 volte

    return new JsonResponse([ 'data' => $contents, 'method' => 'GET', 'status'=> $status]);
  }

  public function indicators($ind_route, Request $request) {

    $build = [
      '#theme' => 'afclm',
    ];

    \Drupal::service('messenger')->addMessage("<code>".print_r($ind_route,TRUE)."</code>");

    // \Drupal::service('messenger')->addMessage("<code>".print_r($request,TRUE)."</code>");

    // https://drupal.stackexchange.com/questions/207044/how-to-get-post-and-get-parameters
    // $test = $request->query->get('cesare');
    // GET all the GET parametrs from incoming request
    $test = $request->query->all();

    \Drupal::service('messenger')->addMessage("<code>".print_r($test,TRUE)."</code>");
    return $build;

    // $request = $this->httpClient->request('GET', 'http://localhost:5000/portfolios');
    // $status = $request->getStatusCode();
    // $body = $request->getBody();
    // $contents = $body->getContents();
    //
    // // transform $contents to array !!!
    // // Dipende perchè non tutte le response di fastAPI sono json
    //
    // // 1- $contents viene jsonencodato 2 volte
    //
    // return new JsonResponse([ 'data' => ["test" => "test"], 'method' => 'GET', 'status'=> 200]);
  }

}
