export const getItemsFromMd = (text) => {
  const included = {aliases: [], full: []};
  const links = {aliases: [], full: []};
  const arrayMatch = [...text.matchAll(/\[\[(.*?)\]\]/g)];

  arrayMatch.forEach((match) => {
    const endindex = match.index + match[0].length;
    if (text.substring(endindex, endindex + 2) === '()') {
      links.aliases.push(match[1]);
      links.full.push(`${match[0]}()`);
    } else {
      included.aliases.push(match[1]);
      included.full.push(match[0]);
    }
  });
  return {included, links};
};
