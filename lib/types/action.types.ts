export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export type ActionPromise<T> = Promise<ActionResult<T>>;
