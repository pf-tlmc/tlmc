function parseCue (cueStr) {
  const cue = {}
  let currIndent = 0
  let node = cue

  for (const line of cueStr.split('\n')) {
    if (!line.trim()) continue
    const { indent, args: [command, ...args] } = parseLine(line)

    while (indent < currIndent) {
      node = node._parent
      --currIndent
    }

    if (indent > currIndent) {
      node = node.TRACK
        ? node.TRACK[node.TRACK.length - 1]
        : node._child || (node._child = { _parent: node })
      currIndent = indent
    }

    switch (command) {
      case 'REM':
        (node.REM || (node.REM = {}))[args[0]] = args[1]
        break
      case 'TITLE':
      case 'PERFORMER':
      case 'INDEX':
        node[command] = args[0]
        break
      case 'FILE':
        node[command] = {
          name: args[0],
          type: args[1]
        }
        break
      case 'TRACK':
        (node.TRACK || (node.TRACK = [])).push({
          number: args[0],
          type: args[1],
          _parent: node
        })
        break
      default:
        throw new Error(`Unkown command: ${command}`)
    }
  }

  return cue
}

function parseLine (line) {
  const indent = line.search(/\S/) >> 1

  const args = []
  const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"|([^\s]+)/g
  let match
  while ((match = regex.exec(line))) {
    args.push(match[1] || match[2])
  }

  return { indent, args }
}

export default parseCue
