export function boxWrap(text: string, width: number): string {
  if (width < 40) return text;
  return text
    .split("\n")
    .map((line) => {
      const chunks = line.match(/\s*\S+/g);
      if (chunks === null) return "";
      const lines: string[] = [];
      let current = chunks[0];
      for (const chunk of chunks.slice(1)) {
        if (current.length + chunk.length <= width) current += chunk;
        else {
          lines.push(current);
          current = chunk.trimStart();
        }
      }
      lines.push(current);
      return lines.join("\n");
    })
    .join("\n");
}
function optimalStringAlignmentDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return Math.max(a.length, b.length);
  const d: number[][] = [];
  for (let i = 0; i <= a.length; i++) d[i] = [i];
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let j = 1; j <= b.length; j++)
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}
export function suggestion(flag: string, knownFlags: readonly string[]): string {
  if (!flag.startsWith("--")) return "";
  const word = flag.slice(2);
  let best = 3;
  let similar: string[] = [];
  for (const candidate of knownFlags) {
    const name = candidate.slice(2);
    const distance = optimalStringAlignmentDistance(word, name);
    const length = Math.max(word.length, name.length);
    if ((length - distance) / length <= 0.4) continue;
    if (distance < best) {
      best = distance;
      similar = [candidate];
    } else if (distance === best) similar.push(candidate);
  }
  similar.sort((a, b) => a.localeCompare(b));
  if (similar.length > 1)
    return `\n(Did you mean one of ${similar.join(", ")}?)`;
  return similar.length === 1 ? `\n(Did you mean ${similar[0]}?)` : "";
}
