import Ember from 'ember';

export default Ember.Component.extend({
	position: null,
	cell: null,
	table: null,
	classNameBindings: [
    'showColumnButtons:datatable-column-actions',
    'showRowButtons:datatable-row-actions'
  ],

  row: Ember.computed.alias('position.row'),
  column: Ember.computed.alias('position.column'),
  
  showEditButton: Ember.computed.and('cell.isEditable', 'cell.showActions'),

  showColumnButtons: Ember.computed('row', 'cell.showActions', function () {
    return this.get('row') === -1 && this.get('cell.showActions');
  }),

  showRemoveColumnButton: Ember.computed.and('showColumnButtons', 'cell.isRemovable'),

  showMoveColumnLeftButton: Ember.computed('showColumnButtons', 'cell.isMovable', 'column', 'table.headers.cells.length', function () {
    return this.get('table').columnCanMoveLeft(this.get('column')) && this.get('showColumnButtons');
  }),

  showMoveColumnRightButton: Ember.computed('showColumnButtons', 'cell.isMovable', 'column', 'table.headers.cells.length', function () {
    return this.get('table').columnCanMoveRight(this.get('column')) && this.get('showColumnButtons');
  }),

  showRowButtons: Ember.computed('row', 'cell.showActions', function () {
    return this.get('row') !== -1 && this.get('cell.showActions');
  }),

  showRemoveRowButton: Ember.computed.and('showRowButtons', 'cell.isRemovable'),

  showMoveRowUpButton: Ember.computed('showRowButtons', 'cell.isMovable', 'row', 'table.body.length', function () {
    var row = this.get('row');
    if (row === -1) {
      return;
    }

    return this.get('table').rowCanMoveUp(row);
  }),

  showMoveRowDownButton: Ember.computed('showRowButtons', 'cell.isMovable', 'row', 'table.body.length', function () {
    var row = this.get('row');
    if (row === -1) {
      return;
    }

    return this.get('table').rowCanMoveDown(row);
  }),

  actions: {
    manipulate: function (label, index) {
      this.sendAction('manipulate', label, index);
    }
  }
});