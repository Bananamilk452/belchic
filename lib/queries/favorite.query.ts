import { queryOptions } from "@tanstack/react-query";

import { getFavoriteAction } from "../actions/favorite.action";
import { wrapQueryFn } from "../utils";

export const favoriteQueryOptions = () =>
  queryOptions({
    queryKey: ["favorite"],
    queryFn: wrapQueryFn(() => getFavoriteAction()),
  });
