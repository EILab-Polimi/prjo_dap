<?php

namespace Drupal\prjo_dap_gql\Plugin\GraphQL\Schema;

use Drupal\graphql\Plugin\GraphQL\Schema\ComposableSchema;

/**
 * @Schema(
 *   id = "dap_custom_composable",
 *   name = "DAP custom composable schema",
 *   extensions = "composable",
 * )
 */
class ExampleDAPSchema extends ComposableSchema {

}
