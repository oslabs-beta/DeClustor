import { Paginator } from "@smithy/types";
import {
  ListManagedInsightRulesCommandInput,
  ListManagedInsightRulesCommandOutput,
} from "../commands/ListManagedInsightRulesCommand";
import { CloudWatchPaginationConfiguration } from "./Interfaces";
export declare const paginateListManagedInsightRules: (
  config: CloudWatchPaginationConfiguration,
  input: ListManagedInsightRulesCommandInput,
  ...rest: any[]
) => Paginator<ListManagedInsightRulesCommandOutput>;
