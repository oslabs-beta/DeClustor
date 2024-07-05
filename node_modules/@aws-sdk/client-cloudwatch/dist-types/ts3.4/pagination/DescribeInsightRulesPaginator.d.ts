import { Paginator } from "@smithy/types";
import {
  DescribeInsightRulesCommandInput,
  DescribeInsightRulesCommandOutput,
} from "../commands/DescribeInsightRulesCommand";
import { CloudWatchPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeInsightRules: (
  config: CloudWatchPaginationConfiguration,
  input: DescribeInsightRulesCommandInput,
  ...rest: any[]
) => Paginator<DescribeInsightRulesCommandOutput>;
