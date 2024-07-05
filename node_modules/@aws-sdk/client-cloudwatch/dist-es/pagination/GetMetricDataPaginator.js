import { createPaginator } from "@smithy/core";
import { CloudWatchClient } from "../CloudWatchClient";
import { GetMetricDataCommand, } from "../commands/GetMetricDataCommand";
export const paginateGetMetricData = createPaginator(CloudWatchClient, GetMetricDataCommand, "NextToken", "NextToken", "MaxDatapoints");
