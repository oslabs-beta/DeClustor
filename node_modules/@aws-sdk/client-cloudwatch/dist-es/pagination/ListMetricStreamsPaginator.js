import { createPaginator } from "@smithy/core";
import { CloudWatchClient } from "../CloudWatchClient";
import { ListMetricStreamsCommand, } from "../commands/ListMetricStreamsCommand";
export const paginateListMetricStreams = createPaginator(CloudWatchClient, ListMetricStreamsCommand, "NextToken", "NextToken", "MaxResults");
