import { Paginator } from "@smithy/types";
import {
  GetMetricDataCommandInput,
  GetMetricDataCommandOutput,
} from "../commands/GetMetricDataCommand";
import { CloudWatchPaginationConfiguration } from "./Interfaces";
export declare const paginateGetMetricData: (
  config: CloudWatchPaginationConfiguration,
  input: GetMetricDataCommandInput,
  ...rest: any[]
) => Paginator<GetMetricDataCommandOutput>;
