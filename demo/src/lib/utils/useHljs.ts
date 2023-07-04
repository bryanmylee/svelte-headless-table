import { getContext, setContext } from 'svelte';

const USE_HLJS = Symbol();

export const useHljs = (lang: string) => {
  setContext(USE_HLJS, lang);
};

export const getHljsLang = () => {
  return getContext(USE_HLJS) as string | undefined;
};
