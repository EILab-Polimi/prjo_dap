<?php

namespace Drupal\prjo_dap_gql\Plugin\GraphQL\DataProducer;

// use Drupal\Core\Entity\EntityInterface;
use Drupal\graphql\Plugin\GraphQL\DataProducer\DataProducerPluginBase;

/**
 * Returns the ID of an entity.
 *
 * @DataProducer(
 *   id = "test_id",
 *   name = @Translation("Entity identifier"),
 *   description = @Translation("Returns the entity identifier."),
 *   produces = @ContextDefinition("any",
 *     label = @Translation("Element")
 *   ),
 *   consumes = {
 *     "input" = @ContextDefinition("any",
 *       label = @Translation("Input array"),
 *       required = FALSE
 *     ),
 *   }
 * )
 */
class TestCustomDB extends DataProducerPluginBase {

  /**
   * Resolver.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *
   * @return int|string|null
   */
  public function resolve($input) {
    // return $entity->id();
    dpm($input); // Array ['storage_exp'] o stdClass {storage_exp: "Bau"} dipende da come viene mappato in DAPSchemaCDbExtension.php
    return $input;
  }

}
