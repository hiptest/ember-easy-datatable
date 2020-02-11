import EmberObject from "@ember/object";
import DatatableFactory from "../utils/datatable-factory";
import { Promise } from 'rsvp'
import { A } from '@ember/array'

export default EmberObject.extend({
  canInsertColumns: true,
  canInsertRows: true,
  contentUpdated: false,

  /**
    Checks if a value is valid for a cell.

    For synchronous validation, it must return true if the value is valid, false
    otherwise.

    For asynchronous validation, it must return a Promise which
    resolves to the validated value, or rejects with the validation error
    message.
  */
  validateCell: function (cell, position, value) {
    return Promise.resolve(value);
  },

  columnCanMove: function (index) {
    return this.get('headers.cells')[index].get('isMovable');
  },

  columnCanMoveLeft: function (index) {
    return this.columnCanMove(index) && index > 0 && this.columnCanMove(index - 1);
  },

  columnCanMoveRight: function (index) {
    return this.columnCanMove(index) && index < this.get('headers.cells.length') - 1  && this.columnCanMove(index + 1);
  },

  rowCanMove: function (index) {
    return this.get('body')[index].get('cells').every(function (cell) {
      return cell.get('isMovable');
    });
  },

  rowCanMoveUp: function (index) {
    return this.rowCanMove(index) && index > 0 && this.rowCanMove(index - 1);
  },

  rowCanMoveDown: function (index) {
    return this.rowCanMove(index) && index < this.get('body.length') - 1  && this.rowCanMove(index + 1);
  },

  columnCanBeRemoved: function (index) {
    return this.get('headers.cells')[index].get('isRemovable');
  },

  rowCanBeRemoved: function (index) {
    return this.get('body')[index].get('cells').every(function (cell) {
      return cell.get('isRemovable');
    });
  },

  makeDefaultRow: function () {
    return DatatableFactory.makeListOf(this.get('headers.cells.length'));
  },

  makeDefaultColumn: function () {
    var column = DatatableFactory.makeListOf(this.get('body.length') + 1);
    column[0] = {isHeader: true};
    return column;
  },

  rowCanBeInserted: function (index) {
    if (this.get('canInsertRows')) {
      if (index === 0) { return true; }
      return this.get('body')[index - 1].get('cells').every(function (cell) {
        return cell.get('canInsertRowAfter');
      });
    }
    return false;
  },

  getInsertableRowsIndices: function () {
    var self = this,
      insertableIndices = A();

    if (this.get('canInsertRows')) {
      insertableIndices.push(0);

      this.get('body').forEach(function (row, index) {
        if (self.rowCanBeInserted(index + 1)) {
          insertableIndices.push(index + 1);
        }
      });
    }
    return insertableIndices;
  },

  getIndexForFirstInsertableRow: function () {
    var insertableIndices = this.getInsertableRowsIndices();
    if (insertableIndices.length > 0) { return Math.min.apply(Math, insertableIndices); }
  },

  getIndexForLastInsertableRow: function () {
    var insertableIndices = this.getInsertableRowsIndices();
    if (insertableIndices.length > 0) { return Math.max.apply(Math, insertableIndices); }
  },

  insertRow: function (index) {
    this.get('body').insertAt(index, DatatableFactory.makeRow(this.makeDefaultRow(index)));
    this.notifyPropertyChange('contentUpdated');
  },

  populateClonedRowCells: function (index) {
    let originalRowCells = this.get('body').objectAt(index).get('cells');
    let originalRowValues = originalRowCells.filter(cell => !cell.isHeader).map(cell => cell.get('value'));
    if(originalRowValues[0]){
      originalRowValues[0] = `${originalRowValues[0]}_copy`;
    } else {
      originalRowValues[0] = `${index+1}_copy`;
    }
    this.get('body').objectAt(index+1).cells.filter(cell => !cell.isHeader).map((cell, index) => cell.set('value', originalRowValues.objectAt(index)));
    this.notifyPropertyChange('contentUpdated');
  },

  columnCanBeInserted: function (index) {
    if (this.get('canInsertColumns')) {
      if (index === 0) { return true; }
      return this.get('headers.cells')[index - 1].get('canInsertColumnAfter');
    }
    return false;
  },

  getInsertableColumnsIndices: function () {
    var insertableIndices = A();

    if (this.get('canInsertColumns')) {
      insertableIndices.push(0);

      this.get('headers.cells').map(function (cell, index) {
        if (cell.get('canInsertColumnAfter')) {
          insertableIndices.push(index + 1);
        }
      });
    }
    return insertableIndices;
  },

  getIndexForFirstInsertableColumn: function () {
    var insertableIndices = this.getInsertableColumnsIndices();
    if (insertableIndices.length > 0) { return Math.min.apply(Math, insertableIndices); }
  },

  getIndexForLastInsertableColumn: function () {
    var insertableIndices = this.getInsertableColumnsIndices();
    if (insertableIndices.length > 0) { return Math.max.apply(Math, insertableIndices); }
  },

  insertColumn: function (index) {
    var column = this.makeDefaultColumn(index);
    this.get('headers.cells').insertAt(index, DatatableFactory.makeCell(column[0]));
    this.get('body').forEach(function (row, rowIndex) {
      row.get('cells').insertAt(index, DatatableFactory.makeCell(column[rowIndex + 1]));
    });
    this.notifyPropertyChange('contentUpdated');
  },

  removeRow: function (index) {
    this.get('body').removeAt(index);
    this.notifyPropertyChange('contentUpdated');
  },

  removeColumn: function (index) {
    this.get('headers.cells').removeAt(index);
    this.get('body').forEach(function (row) {
      row.get('cells').removeAt(index);
    });
    this.notifyPropertyChange('contentUpdated');
  },

  moveRow: function (from, to) {
    DatatableFactory.moveObject(this.get('body'), from, to);
    this.notifyPropertyChange('contentUpdated');
  },

  moveColumn: function (from, to) {
    this.get('headers').moveCell(from, to);
    this.get('body').forEach(function (row) {
      row.moveCell(from, to);
    });
    this.notifyPropertyChange('contentUpdated');
  }
});
