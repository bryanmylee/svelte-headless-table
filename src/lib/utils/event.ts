export const isShiftClick = (event: Event) => {
	if (!(event instanceof MouseEvent)) return false;
	return event.shiftKey;
};
