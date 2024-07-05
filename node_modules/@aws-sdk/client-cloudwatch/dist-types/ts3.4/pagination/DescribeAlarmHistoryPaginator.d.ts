import { Paginator } from "@smithy/types";
import {
  DescribeAlarmHistoryCommandInput,
  DescribeAlarmHistoryCommandOutput,
} from "../commands/DescribeAlarmHistoryCommand";
import { CloudWatchPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeAlarmHistory: (
  config: CloudWatchPaginationConfiguration,
  input: DescribeAlarmHistoryCommandInput,
  ...rest: any[]
) => Paginator<DescribeAlarmHistoryCommandOutput>;
