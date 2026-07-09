export type ComponentInstance = HTMLElement & {
	prototypeType: string;
};

export type ComponentConstructor = new (...args: any[]) => ComponentInstance;

export declare const ComponentElement: <TBase extends CustomElementConstructor>(
	Base: TBase,
	className: string
) => ComponentConstructor;
