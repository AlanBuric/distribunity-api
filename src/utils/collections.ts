export function deleteFromArray<T>(elements: Array<T>, element: T) {
    const index = elements.indexOf(element);

    if (index > -1) {
        return elements.splice(index, 1)[0];
    }

    return undefined;
}