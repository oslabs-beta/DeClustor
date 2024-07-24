import { Paginator } from "@smithy/types";
import {
  DescribeAnomalyDetectorsCommandInput,
  DescribeAnomalyDetectorsCommandOutput,
} from "../commands/DescribeAnomalyDetectorsCommand";
import { CloudWatchPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeAnomalyDetectors: (
  config: CloudWatchPaginationConfiguration,
  input: DescribeAnomalyDetectorsCommandInput,
  ...rest: any[]
) => Paginator<DescribeAnomalyDetectorsCommandOutput>;
