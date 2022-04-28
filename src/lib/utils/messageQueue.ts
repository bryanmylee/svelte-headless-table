import type { Subscriber } from 'svelte/store';

export class MessageQueue<Message> {
	private subscribers: Array<Subscriber<Message>>;
	constructor() {
		this.subscribers = [];
	}
	subscribe(fn: Subscriber<Message>) {
		this.subscribers.push(fn);
		return () => {
			const index = this.subscribers.indexOf(fn);
			if (index !== -1) {
				this.subscribers.splice(index, 1);
			}
		};
	}
	fire(message: Message) {
		this.subscribers.forEach((fn) => fn(message));
	}
}
