function wrapCell(cell) {
  cell.children = [
    {
      type: "tableCellInner",
      data: {
        hName: "div",
        hProperties: {
          className: ["table-cell-inner"],
        },
      },
      children: cell.children || [],
    },
  ]
}

function wrapTable(table) {
  for (const row of table.children || []) {
    if (row.type !== "tableRow") continue

    for (const cell of row.children || []) {
      if (cell.type !== "tableCell") continue
      wrapCell(cell)
    }
  }

  return {
    type: "tableScroll",
    data: {
      hName: "div",
      hProperties: {
        className: ["table-scroll"],
        tabIndex: 0,
        role: "region",
        "aria-label": "Scrollable table",
      },
    },
    children: [table],
  }
}

function wrapTables(node) {
  if (!node || !Array.isArray(node.children)) return

  node.children = node.children.map((child) => {
    if (child.type === "table") return wrapTable(child)

    wrapTables(child)
    return child
  })
}

module.exports = ({ markdownAST }) => {
  wrapTables(markdownAST)
  return markdownAST
}
