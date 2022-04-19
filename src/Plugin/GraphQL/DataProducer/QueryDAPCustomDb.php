<?php

namespace Drupal\prjo_dap_gql\Plugin\GraphQL\DataProducer;

use Drupal\Core\Database\Connection;
use Drupal\Core\Cache\RefinableCacheableDependencyInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\graphql\Plugin\GraphQL\DataProducer\DataProducerPluginBase;
// use Drupal\prjo_dap_gql\Wrappers\QueryDAPConnection;
use GraphQL\Error\UserError;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @DataProducer(
 *   id = "query_dap_custom_db",
 *   name = @Translation("Load DAP data from custom db"),
 *   description = @Translation("Loads data from custom db given parameters."),
 *   produces = @ContextDefinition("any",
 *     label = @Translation("Custom db DAP connection")
 *   ),
 *   consumes = {
 *     "indicator" = @ContextDefinition("string",
 *       label = @Translation("Indicator name")
 *     ),
 *     "scenario" = @ContextDefinition("string",
 *       label = @Translation("Scenario name"),
 *       required = FALSE
 *     ),
 *     "locality" = @ContextDefinition("string",
 *       label = @Translation("Locality name"),
 *       required = FALSE
 *     ),
 *     "experiment" = @ContextDefinition("string",
 *       label = @Translation("Experiment name"),
 *       required = FALSE
 *     ),
 *     "offset" = @ContextDefinition("integer",
 *       label = @Translation("Offset"),
 *       required = FALSE
 *     ),
 *     "limit" = @ContextDefinition("integer",
 *       label = @Translation("Limit"),
 *       required = FALSE
 *     )
 *   }
 * )
 */
class QueryDAPCustomDb extends DataProducerPluginBase implements ContainerFactoryPluginInterface {

  const MAX_LIMIT = 100;

  /**
   * The database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $database;

  /**
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * {@inheritdoc}
   *
   * @codeCoverageIgnore
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('database'),
      $container->get('entity_type.manager')
    );
  }

  /**
   * Articles constructor.
   *
   * @param array $configuration
   *   The plugin configuration.
   * @param string $pluginId
   *   The plugin id.
   * @param mixed $pluginDefinition
   *   The plugin definition.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *
   * @codeCoverageIgnore
   */
  public function __construct(
    array $configuration,
    $pluginId,
    $pluginDefinition,
    Connection $database,
    EntityTypeManagerInterface $entityTypeManager
  ) {
    parent::__construct($configuration, $pluginId, $pluginDefinition);
    $this->database = $database;
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * Resolver.
   *
   * @param string $indicator
   * @param string $scenario
   * @param string $locality
   * @param string $experiment
   * @param int $offset
   * @param int $limit
   * @param \Drupal\Core\Cache\RefinableCacheableDependencyInterface $metadata
   *
   * @return \Drupal\graphql_examples\Wrappers\QueryConnection
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function resolve($indicator, $scenario, $locality, $experiment, $offset, $limit, RefinableCacheableDependencyInterface $metadata) {

    if ($limit > static::MAX_LIMIT) {
      throw new UserError(sprintf('Exceeded maximum query limit: %s.', static::MAX_LIMIT));
    }

    dpm('RESOLVING');
    // $this->database->setActiveConnection('prjo_dap');
    db_set_active('prjo_dap');
    dpm('settled tabase');
    dpm($indicator);
    // $database = "{".$indicator."}";
    dpm($scenario);
    dpm($locality);
    dpm($experiment);
    // Base of the query selecting term names and synonyms.
    // $query_test = db_query("SELECT $indicator.value AS value
    // FROM
    // {$indicator}
    // WHERE $indicator.scen IN ('baseline', '$scenario')
    // AND $indicator.loc_id = '$locality'
    // LIMIT 11 OFFSET 0");

    // $query_test = db_query("SELECT $indicator.'exp' AS 'exp' $indicator.'time' AS ts $indicator.value AS value
    // $query_test = db_query("SELECT $indicator.value AS value, $indicator.time AS ts, $indicator.exp AS exp
    // FROM {".$indicator."}
    // WHERE $indicator.scen IN ('baseline', '$scenario')
    // AND $indicator.loc_id = '$locality'
    // LIMIT 100 OFFSET 0");

    $query_test = db_query("SELECT $indicator.value AS value, $indicator.time AS ts
    FROM {".$indicator."}
    WHERE $indicator.scen IN ('baseline', '$scenario')
    AND $indicator.loc_id = '$locality'
    AND $indicator.exp = '$experiment'
    LIMIT 100 OFFSET 0");

    $rows_ins = $query_test->fetchAll();

    // $this->database->setActiveConnection();

    dpm($rows_ins);
    // $return = [];
    // foreach ($rows_ins as $key => $value) {
    //   // dpm($value);
    //   $return[] = $value->storage_exp;
    // }
    // dpm($return);
    db_set_active();
    // Original for Articles
    // $storage = $this->entityTypeManager->getStorage('node');
    // $entityType = $storage->getEntityType();
    // $query = $storage->getQuery()
    //   ->currentRevision()
    //   ->accessCheck();
    //
    // $query->condition($entityType->getKey('bundle'), 'article');
    // $query->range($offset, $limit);
    //
    // $metadata->addCacheTags($entityType->getListCacheTags());
    // $metadata->addCacheContexts($entityType->getListCacheContexts());

    // return new QueryConnection($query);
    // return $rows_ins[0];
    return $rows_ins;
    // return $return;
  }

}
