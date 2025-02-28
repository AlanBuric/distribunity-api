export function deleteFromArray<T>(array: Array<T>, element: T) {
	const index = array.indexOf(element);

	if (index > -1) {
		return array.splice(index, 1)[0];
	}

	return undefined;
}
