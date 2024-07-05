import { createPaginator } from "@smithy/core";
import { CloudWatchClient } from "../CloudWatchClient";
import { ListMetricsCommand } from "../commands/ListMetricsCommand";
export const paginateListMetrics = createPaginator(CloudWatchClient, ListMetricsCommand, "NextToken", "NextToken", "");
