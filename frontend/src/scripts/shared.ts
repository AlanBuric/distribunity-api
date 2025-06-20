const DEFAULT_LANGUAGE = 'en';

export function getLanguage() {
  const result = new Set(...navigator.languages, navigator.language);

  if (result.size == 0) {
    return new Set(DEFAULT_LANGUAGE);
  }

  return result;
}

function findFirstNext(element, tagName = element.tagName.toUpperCase()) {
  let next = element.nextElementSibling;

  while (next) {
    if (next.tagName === tagName) {
      return next;
    }

    next = next.nextElementSibling;
  }

  return null;
}

function findFirstPrevious(element, tagName = element.tagName.toUpperCase()) {
  let previous = element.previousElementSibling;

  while (previous) {
    if (previous.tagName === tagName) {
      return previous;
    }

    previous = previous.previousElementSibling;
  }

  return null;
}

function findElement(event) {
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return findFirstNext(event.target);
    case 'ArrowLeft':
    case 'ArrowUp':
      return findFirstPrevious(event.target);
  }

  return null;
}

export function navigateInput(event) {
  const target = findElement(event);

  if (target) {
    event.preventDefault();
    target.focus();
  }
}

export const NO_PERMISSIONS_MESSAGE = "You don't have the permission to do that.";
