import { createPaginator } from "@smithy/core";
import { CloudWatchClient } from "../CloudWatchClient";
import { DescribeInsightRulesCommand, } from "../commands/DescribeInsightRulesCommand";
export const paginateDescribeInsightRules = createPaginator(CloudWatchClient, DescribeInsightRulesCommand, "NextToken", "NextToken", "MaxResults");
