import Component from '@ember/component'
import { computed } from '@ember/object'
import { isNone } from '@ember/utils'
import { observer } from '@ember/object'

export default Component.extend({
  tagName: 'div',
  classNames: ['easy-datatable-container'],
  classNameBindings: ['isFullScreen:full-screen'],

  selectedCellPosition: null,
  previouslySelectedCell: null,

  editAfterInsertion: false,
  showEditorForSelectedCell: false,
  addNewRowLabel: 'Add new row',
  showAddFirstRow: false,
  showAddLastRow: false,
  isFullScreen: false,
  tableClasses: '',
  showToolBar: false,
  showDuplicateRow: false,

  init() {
    this._super(...arguments)
    this.set('selectedCellPosition', {})
  },
  actions: {
    navigate: function (direction) {
      this.send(direction)
    },

    navigateLeft: function () {
      this.set('selectedCellPosition', this.computeNavigateLeftPosition())
    },

    navigateUp: function () {
      this.set('selectedCellPosition', this.computeNavigateUpPosition())
    },

    navigateRight: function () {
      this.set('selectedCellPosition', this.computeNavigateRightPosition())
    },

    navigateDown: function () {
      this.set('selectedCellPosition', this.computeNavigateDownPosition())
    },

    addFirstRow: function () {
      var index = this.table.getIndexForFirstInsertableRow()
      this.insertRowAt(index, { row: index, column: 0 })
    },

    addLastRow: function () {
      var index = this.table.getIndexForLastInsertableRow()
      this.insertRowAt(index, { row: index, column: 0 })
    },

    insertRowAfter: function (index) {
      if (this.table.rowCanBeInserted(index)) {
        this.insertRowAt(index, this.computeNavigateDownPosition)
      }
    },

    manipulate: function (label, index) {
      this.send(label, index)
    },

    removeRow: function (index) {
      if (this.table.rowCanBeRemoved(index)) {
        this.table.removeRow(index)

        if (this.selectedCellPosition.row === this.table.body.length) {
          this.send('navigateUp')
        } else {
          this.notifyPropertyChange('selectedCellPosition')
        }
      }
    },

    addFirstColumn: function () {
      var index = this.table.getIndexForFirstInsertableColumn()
      this.insertColumnAt(index, { row: -1, column: index })
    },

    addLastColumn: function () {
      var index = this.table.getIndexForLastInsertableColumn()
      this.insertColumnAt(index, { row: -1, column: index })
    },

    insertColumnAfter: function (index) {
      if (this.table.columnCanBeInserted(index)) {
        this.insertColumnAt(index, this.computeNavigateRightPosition)
      }
    },

    removeColumn: function (index) {
      if (this.table.columnCanBeRemoved(index)) {
        this.table.removeColumn(index)
        this.notifyPropertyChange('selectedCellPosition')
      }
    },

    moveRowUp: function (index) {
      if (this.table.rowCanMoveUp(index)) {
        this.table.moveRow(index, index - 1)
        this.send('navigateUp')
      }
    },

    moveRowDown: function (index) {
      if (this.table.rowCanMoveDown(index)) {
        this.table.moveRow(index, index + 1)
        this.send('navigateDown')
      }
    },

    duplicateRow: function (index) {
      if (this.table.rowCanBeInserted(index + 1)) {
        this.insertRowAt(index + 1, { row: index + 1, column: 0 })
        this.table.populateClonedRowCells(index)
      }
    },

    moveColumnLeft: function (index) {
      if (this.table.columnCanMoveLeft(index)) {
        this.table.moveColumn(index, index - 1)
        this.send('navigateLeft')
      }
    },

    moveColumnRight: function (index) {
      if (this.table.columnCanMoveRight(index)) {
        this.table.moveColumn(index, index + 1)
        this.send('navigateRight')
      }
    },
  },

  insertRowAt: function (index, nextPosition) {
    if (isNone(index)) {
      return
    }

    this.table.insertRow(index)

    if (typeof nextPosition === 'function') {
      nextPosition = nextPosition.apply(this)
    }

    this.set('selectedCellPosition', nextPosition)
    if (this.editAfterInsertion) {
      this.navigateToFirstEditableCellInRow()
      this.set('showEditorForSelectedCell', true)
    }
  },

  firstEditableCellIndexInColumn: function (columnIndex) {
    var index

    if (this.table.headers.cells[columnIndex].get('isEditable')) {
      return -1
    }
    for (index = 0; index < this.table.body.length; index++) {
      if (this.table.body[index].get('cells')[columnIndex].get('isEditable')) {
        return index
      }
    }
  },

  navigateToFirstEditableCellInColumn: function () {
    var columnIndex = this.selectedCellPosition.column,
      rowIndex = this.firstEditableCellIndexInColumn(columnIndex)

    if (!isNone(rowIndex)) {
      this.set('selectedCellPosition', { row: rowIndex, column: columnIndex })
    }
  },

  firstEditableCellIndexInRow: function (rowIndex) {
    var index,
      row = this.table.body[rowIndex].get('cells')

    for (index = 0; index < row.length; index++) {
      if (row[index].get('isEditable')) {
        return index
      }
    }
  },

  navigateToFirstEditableCellInRow: function () {
    var rowIndex = this.selectedCellPosition.row,
      columnIndex = this.firstEditableCellIndexInRow(rowIndex)

    if (!isNone(columnIndex)) {
      this.set('selectedCellPosition', { row: rowIndex, column: columnIndex })
    }
  },

  highlightedColumn: computed('selectedCellPosition', function () {
    var position = this.selectedCellPosition
    if (isNone(position) || position.row !== -1) {
      return
    }
    return position.column
  }),

  highlightedRow: computed('selectedCell', 'selectedCellPosition', function () {
    var position = this.selectedCellPosition,
      cell = this.selectedCell

    if (isNone(cell) || !cell.get('isHeader') || position.row < 0) {
      return
    }
    return position.row
  }),

  fixPosition: function (position) {
    if (!this.isRowValid(position)) {
      position = this.fixRowPosition(position)
    } else if (!this.isColumnValid(position)) {
      position = this.fixColumnPosition(position)
    }

    if (!this.isRowValid(position) || !this.isColumnValid(position)) {
      position.row = null
      position.column = null
    }

    return position
  },

  isRowValid: function (position) {
    var rowCount = this.table.body.length
    return position.row >= -1 && position.row < rowCount
  },

  isColumnValid: function (position) {
    var columnCount = this.table.headers.cells.length
    return position.column >= 0 && position.column < columnCount
  },

  fixRowPosition: function (position) {
    var rowCount = this.table.body.length

    if (position.row < -1) {
      position.row = rowCount - 1
      position.column -= 1
    }

    if (position.row >= rowCount) {
      position.row = -1
      position.column += 1
    }
    return position
  },

  fixColumnPosition: function (position) {
    var columnCount = this.table.body.firstObject.cells.length

    if (position.column < 0) {
      position.column = columnCount - 1
      position.row -= 1
    }

    if (position.column >= columnCount) {
      position.column = 0
      position.row += 1
    }

    return position
  },

  computeNavigateUpPosition: function () {
    var current = this.selectedCellPosition
    return this.fixPosition(this.giveValidRowPosition(current, current.row - 1))
  },

  computeNavigateDownPosition: function () {
    var current = this.selectedCellPosition
    return this.fixPosition(this.giveValidRowPosition(current, current.row + 1))
  },

  giveValidRowPosition: function (current, new_row) {
    var new_position = { row: new_row, column: current.column }
    if (!this.isRowValid(new_position)) {
      new_position = { row: current.row, column: current.column }
    }
    return new_position
  },

  computeNavigateRightPosition: function () {
    var current = this.selectedCellPosition
    return this.fixPosition({ row: current.row, column: current.column + 1 })
  },

  computeNavigateLeftPosition: function () {
    var current = this.selectedCellPosition
    return this.fixPosition({ row: current.row, column: current.column - 1 })
  },

  insertColumnAt: function (index, nextPosition) {
    if (isNone(index)) {
      return
    }

    this.table.insertColumn(index)
    if (typeof nextPosition === 'function') {
      nextPosition = nextPosition.apply(this)
    }

    this.set('selectedCellPosition', nextPosition)
    if (this.editAfterInsertion) {
      this.navigateToFirstEditableCellInColumn()
      this.set('showEditorForSelectedCell', true)
    }
  },

  selectedCell: computed('selectedCellPosition', 'table.{body.length,headers.cells}', function () {
    var position = this.selectedCellPosition
    if (isNone(position) || isNone(position.row) || isNone(position.column)) {
      return
    }
    if (position.row === -1) {
      return this.table.headers.cells[position.column]
    }
    if (position.row >= this.table.body.length) {
      this.fixPosition({ row: this.table.body.length - 1, column: position.column })
      return
    }
    return this.table.body[position.row].get('cells')[position.column]
  }),

  updateSelection: observer('selectedCell', function () {
    var previous = this.previouslySelectedCell,
      cell = this.selectedCell

    if (!isNone(previous) && !previous.isDestroying) {
      previous.set('isSelected', false)
    }

    if (isNone(cell)) {
      this.set('previouslySelectedCell', null)
    } else {
      cell.set('isSelected', true)
      this.set('previouslySelectedCell', cell)
    }
  }),
})
