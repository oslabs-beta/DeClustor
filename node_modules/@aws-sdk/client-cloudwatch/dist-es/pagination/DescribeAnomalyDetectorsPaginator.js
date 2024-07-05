import { createPaginator } from "@smithy/core";
import { CloudWatchClient } from "../CloudWatchClient";
import { DescribeAnomalyDetectorsCommand, } from "../commands/DescribeAnomalyDetectorsCommand";
export const paginateDescribeAnomalyDetectors = createPaginator(CloudWatchClient, DescribeAnomalyDetectorsCommand, "NextToken", "NextToken", "MaxResults");
