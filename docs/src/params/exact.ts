import type { ParamMatcher } from '@sveltejs/kit';

/**
 * Provides exact route matching.
 * Refer to https://kit.svelte.dev/docs/routing#advanced-routing-matching.
 */
export const match: ParamMatcher = (param) => {
  return param.length === 0;
};
