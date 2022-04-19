<?php

namespace Drupal\prjo_dap_gql\Plugin\GraphQL\Schema;

use Drupal\graphql\Plugin\GraphQL\Schema\ComposableSchema;

/**
 * @Schema(
 *   id = "dap_cdb_composable",
 *   name = "DAP custom database composable schema",
 *   extensions = "composable",
 * )
 */
class DAPSchemaCDb extends ComposableSchema {

}
