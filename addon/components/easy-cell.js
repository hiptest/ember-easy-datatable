import Ember from 'ember';

export default Ember.Component.extend({
	cell: null,
	row: null,
	rowIndex: null,

	displayableIndex: Ember.computed('position', function () {
    return this.get('position.row') + 1;
  }),

  columnIndex: Ember.computed('cell', 'row.cells.[]', function () {
    return this.get('row.cells').indexOf(this.get('cell'));
  }),

  position: Ember.computed('rowIndex', 'columnIndex', function () {
    return {
      row: this.get('rowIndex'),
      column: this.get('columnIndex')
    };
  })
});