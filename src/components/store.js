import { writable } from "svelte/store";

export const store = writable({
	open: false,
	width: 247,
});

export const loginDetails = writable({
	id: undefined,
	password: undefined,
});
