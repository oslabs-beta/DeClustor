import { createPaginator } from "@smithy/core";
import { CloudWatchClient } from "../CloudWatchClient";
import { ListDashboardsCommand, } from "../commands/ListDashboardsCommand";
export const paginateListDashboards = createPaginator(CloudWatchClient, ListDashboardsCommand, "NextToken", "NextToken", "");
