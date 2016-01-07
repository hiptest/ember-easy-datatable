import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['easy-datatable-container'],

  selectedCellPosition: null,
  previouslySelectedCell : null,

  editAfterInsertion: false,
  showEditorForSelectedCell: false,

  actions: {
    navigateLeft: function () {
      this.set('selectedCellPosition', this.computeNavigateLeftPosition());
    },

    navigateUp: function () {
      this.set('selectedCellPosition', this.computeNavigateUpPosition());
    },

    navigateRight: function () {
      this.set('selectedCellPosition', this.computeNavigateRightPosition());
    },

    navigateDown: function () {
      this.set('selectedCellPosition', this.computeNavigateDownPosition());
    },

    removeRow: function (index) {
      if (this.get('table').rowCanBeRemoved(index)) {
        this.get('table').removeRow(index);

        if (this.get('selectedCellPosition.row') === this.get('table.body.length')) {
          this.send('navigateUp');
        } else {
          this.notifyPropertyChange('selectedCellPosition');
        }
      }
    },

    removeColumn: function (index) {
      if (this.get('table').columnCanBeRemoved(index)) {
        this.get('table').removeColumn(index);
        this.notifyPropertyChange('selectedCellPosition');
      }
    },

  },

  firstEditableCellIndexInColumn: function (columnIndex) {
    var index;

    if (this.get('table.headers.cells')[columnIndex].get('isEditable')) {
      return -1;
    }
    for (index = 0; index < this.get('table.body.length'); index++) {
      if (this.get('table.body')[index].get('cells')[columnIndex].get('isEditable')) {
        return index;
      }
    }
  },

  navigateToFirstEditableCellInColumn: function () {
    var columnIndex = this.get('selectedCellPosition.column'),
       rowIndex = this.firstEditableCellIndexInColumn(columnIndex);

    if (!Ember.isNone(rowIndex)) {
      this.set('selectedCellPosition', {row: rowIndex, column: columnIndex});
    }
  },

  firstEditableCellIndexInRow: function (rowIndex) {
    var index, row = this.get('table.body')[rowIndex].get('cells');

    for (index = 0; index < row.length; index++) {
      if (row[index].get('isEditable')) {
        return index;
      }
    }
  },

  navigateToFirstEditableCellInRow: function () {
    var rowIndex = this.get('selectedCellPosition.row'),
      columnIndex = this.firstEditableCellIndexInRow(rowIndex);

    if (!Ember.isNone(columnIndex)) {
      this.set('selectedCellPosition', {row: rowIndex, column: columnIndex});
    }
  },

  highlightedColumn: Ember.computed('selectedCellPosition', function () {
    var position = this.get('selectedCellPosition');
    if (Ember.isNone(position) || position.row !== -1) {
      return;
    }
    return position.column;
  }),

  highlightedRow: Ember.computed('selectedCellPosition', function () {
    var position = this.get('selectedCellPosition'),
      cell = this.get('selectedCell');

    if (Ember.isNone(cell) || !cell.get('isHeader') || position.row < 0) {
      return;
    }
    return position.row;
  }),

  fixPosition: function (position) {
    if (!this.isRowValid(position)) {
      position = this.fixRowPosition(position);
    } else if (!(this.isColumnValid(position))) {
      position = this.fixColumnPosition(position);
    }

    if (!this.isRowValid(position) || !this.isColumnValid(position)) {
      position.row = null;
      position.column = null;
    }

    return position;
  },

  isRowValid: function (position) {
    var rowCount = this.get('table.body.length');
    return position.row >= -1 && position.row < rowCount;
  },

  isColumnValid: function (position) {
    var columnCount = this.get('table.headers.cells.length');
    return position.column >= 0 && position.column < columnCount;
  },

  fixRowPosition: function (position) {
    var rowCount = this.get('table.body.length');

    if (position.row < - 1) {
      position.row = rowCount - 1;
      position.column -= 1;
    }

    if (position.row >= rowCount) {
      position.row = -1;
      position.column += 1;
    }
    return position;
  },

  fixColumnPosition: function (position) {
    var columnCount = this.get('table.body.firstObject.cells.length');

    if (position.column < 0) {
      position.column = columnCount - 1;
      position.row -= 1;
    }

    if (position.column >= columnCount) {
      position.column = 0;
      position.row += 1;
    }

    return position;
  },

  computeNavigateUpPosition: function () {
    var current = this.get('selectedCellPosition');
    return this.fixPosition({row: current.row - 1, column: current.column});
  },

  computeNavigateDownPosition: function () {
    var current = this.get('selectedCellPosition');
    return this.fixPosition({row: current.row + 1, column: current.column});
  },

  computeNavigateRightPosition: function () {
    var current = this.get('selectedCellPosition');
    return this.fixPosition({row: current.row, column: current.column + 1});
  },

  computeNavigateLeftPosition: function () {
    var current = this.get('selectedCellPosition');
    return this.fixPosition({row: current.row, column: current.column - 1});
  },

  insertRowAt: function (index, nextPosition) {
    if (Ember.isNone(index)) {
      return;
    }

    this.get('table').insertRow(index);
    if (typeof(nextPosition) === 'function') {
      nextPosition = nextPosition.apply(this);
    }

    this.set('selectedCellPosition', nextPosition);
    if (this.get('editAfterInsertion')) {
      this.navigateToFirstEditableCellInRow();
      this.set('showEditorForSelectedCell', true);
    }
  },

  insertColumnAt: function (index, nextPosition) {
    if (Ember.isNone(index)) {
      return;
    }

    this.get('table').insertColumn(index);
    if (typeof(nextPosition) === 'function') {
      nextPosition = nextPosition.apply(this);
    }

    this.set('selectedCellPosition', nextPosition);
    if (this.get('editAfterInsertion')) {
      this.navigateToFirstEditableCellInColumn();
      this.set('showEditorForSelectedCell', true);
    }
  },

  selectedCell: Ember.computed('selectedCellPosition', function () {
    var position = this.get('selectedCellPosition');
    if (Ember.isNone(position) || Ember.isNone(position.row) || Ember.isNone(position.column)) {
      return;
    }

    if (position.row === -1) {
      return this.get('table.headers.cells')[position.column];
    }
    return this.get('table.body')[position.row].get('cells')[position.column];
  }),

	updateSelection: Ember.observer('selectedCellPosition', function () {
    
    var previous = this.get('previouslySelectedCell'),
      cell = this.get('selectedCell');

    if (!Ember.isNone(previous)) {
      previous.set('isSelected', false);
    }

    if (Ember.isNone(cell)) {
      this.set('previouslySelectedCell', null);
    } else {
      cell.set('isSelected', true);
      this.set('previouslySelectedCell', cell);
    }
  })
});