import { createPaginator } from "@smithy/core";
import { CloudWatchClient } from "../CloudWatchClient";
import { DescribeAlarmsCommand, } from "../commands/DescribeAlarmsCommand";
export const paginateDescribeAlarms = createPaginator(CloudWatchClient, DescribeAlarmsCommand, "NextToken", "NextToken", "MaxRecords");
