import { queryOptions } from "@tanstack/react-query";

import { getCartAction } from "../actions/cart.action";
import { wrapQueryFn } from "../utils";

export const cartQueryOptions = () =>
  queryOptions({
    queryKey: ["cart"],
    queryFn: wrapQueryFn(() => getCartAction()),
  });
