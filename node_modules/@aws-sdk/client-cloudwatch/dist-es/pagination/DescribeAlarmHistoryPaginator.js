import { createPaginator } from "@smithy/core";
import { CloudWatchClient } from "../CloudWatchClient";
import { DescribeAlarmHistoryCommand, } from "../commands/DescribeAlarmHistoryCommand";
export const paginateDescribeAlarmHistory = createPaginator(CloudWatchClient, DescribeAlarmHistoryCommand, "NextToken", "NextToken", "MaxRecords");
