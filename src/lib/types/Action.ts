// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionReturnType<Props = any> = {
	update?: (newProps: Props) => void;
	destroy?: () => void;
};

export type Action<Props> = (node: Element, props?: Props) => ActionReturnType<Props> | void;
