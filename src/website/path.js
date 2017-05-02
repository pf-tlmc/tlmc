import path from 'path';

const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
function splitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}

path.parse = function parse(pathString) {
  const allParts = splitPath(pathString);
  if (!allParts || allParts.length !== 4) {
      throw new TypeError(`Invalid path '${pathString}'`);
  }

  allParts[1] = allParts[1] || '';
  allParts[2] = allParts[2] || '';
  allParts[3] = allParts[3] || '';

  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, allParts[1].length - 1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};
