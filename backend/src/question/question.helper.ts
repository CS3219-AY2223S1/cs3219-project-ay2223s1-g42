export function sanitizeFilters(query: string | string[], separator = ",") {
  const splitQuery: string[] = [];
  if (!Array.isArray(query)) {
    splitQuery.push(...query.split(separator));
  } else {
    splitQuery.push(...query.flatMap((v) => v.split(separator)));
  }
  return splitQuery.reduce((prev: string[], curr: string) => {
    if (curr.trim()) {
      prev.push(curr.trim().toLowerCase());
    }
    return prev;
  }, []);
}

export function sanitizeDifficulty(query: string | string[], separator = ",") {
  const splitQuery: string[] = [];
  if (!Array.isArray(query)) {
    splitQuery.push(...query.split(separator));
  } else {
    splitQuery.push(...query.flatMap((v) => v.split(separator)));
  }

  return splitQuery.reduce((prev: string[], curr: string) => {
    if (curr.trim()) {
      prev.push(capitalizeFirstLetter(curr.trim()));
    }
    return prev;
  }, []);
}

// Defaults to "OR"
export function sanitizeTopicMatch(query = "OR") {
  const res = query.trim().toUpperCase();
  if (res == "AND" || res == "OR") {
    return res;
  } else {
    return "OR";
  }
}

function capitalizeFirstLetter(word: string) {
  return word.toLowerCase().charAt(0).toUpperCase() + word.slice(1);
}
