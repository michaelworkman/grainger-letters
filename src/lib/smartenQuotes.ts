export function smartenQuotes(text: string) {
  return text
    .replace(/(\w)'(\w)/g, "$1’$2")
    .replace(/(^|[\s([{-])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s([{-])'/g, "$1‘")
    .replace(/'/g, "’");
}

export function formatPullQuote(text: string) {
  return `“${smartenQuotes(text)}”`;
}
