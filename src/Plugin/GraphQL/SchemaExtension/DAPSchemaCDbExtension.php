<?php

namespace Drupal\prjo_dap_gql\Plugin\GraphQL\SchemaExtension;

use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql\GraphQL\ResolverRegistryInterface;
// use Drupal\graphql\GraphQL\Response\ResponseInterface;
use Drupal\graphql\Plugin\GraphQL\SchemaExtension\SdlSchemaExtensionPluginBase;
// use Drupal\prjo_dap_gql\GraphQL\Response\ArticleResponse;

/**
 * @SchemaExtension(
 *   id = "dap_cdb_composable_extension",
 *   name = "DAP custom db extension",
 *   description = "A schema extension for custom DAP database.",
 *   schema = "dap_cdb_composable"
 * )
 */
class DAPSchemaCDbExtension extends SdlSchemaExtensionPluginBase {

  /**
   * {@inheritdoc}
   */
  public function registerResolvers(ResolverRegistryInterface $registry): void {
    $builder = new ResolverBuilder();

    $registry->addFieldResolver('Query', 'article',
      $builder->produce('query_dap_custom_db')
        ->map('indicator', $builder->fromArgument('ind'))
        ->map('scenario', $builder->fromArgument('scen'))
        ->map('locality', $builder->fromArgument('loc'))
        ->map('experiment', $builder->fromArgument('exp'))
    );

    // $registry->addFieldResolver('Article', 'id',
    //   $builder->produce('test_id')
    //     // ->map('input', $builder->fromValue(['storage_exp'])) //
    //     ->map('input', $builder->fromParent()) // $builder->fromParent() passa a test_id stdClass {storage_exp: "Bau"} che è quello che
    //                                            // viene risolto da query_dap_custom_db
    // );

    //
    // $registry->addFieldResolver('Article', 'title',
    //   $builder->compose(
    //     $builder->produce('entity_label')
    //       ->map('entity', $builder->fromParent())
    //   )
    // );
    //
    // $registry->addFieldResolver('Article', 'body',
    //   $builder->produce('property_path')
    //     ->map('type', $builder->fromValue('entity:node'))
    //     ->map('value', $builder->fromParent())
    //     // ->map('path', $builder->fromValue('field_tt_geolocation_point.value')
    //     ->map('path', $builder->fromValue('body.value'))
    // );

    // $registry->addFieldResolver('Article', 'dbresp',
    //   $builder->produce('query_dap_custom_db')
    //     // ->map('type', $builder->fromValue('entity:node'))
    //     // ->map('value', $builder->fromParent())
    //     // // ->map('path', $builder->fromValue('field_tt_geolocation_point.value')
    //     // ->map('path', $builder->fromValue('body.value'))
    // );

    // $registry->addFieldResolver('Article', 'author',
    //   $builder->compose(
    //     $builder->produce('entity_owner')
    //       ->map('entity', $builder->fromParent()),
    //     $builder->produce('entity_label')
    //       ->map('entity', $builder->fromParent())
    //   )
    // );

  }

}
