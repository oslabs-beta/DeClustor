import { createPaginator } from "@smithy/core";
import { CloudWatchClient } from "../CloudWatchClient";
import { ListManagedInsightRulesCommand, } from "../commands/ListManagedInsightRulesCommand";
export const paginateListManagedInsightRules = createPaginator(CloudWatchClient, ListManagedInsightRulesCommand, "NextToken", "NextToken", "MaxResults");
