import Component from '@ember/component'
import { computed } from '@ember/object'
import { and, alias } from '@ember/object/computed'
import $ from 'jquery'

export default Component.extend({
  position: null,
  cell: null,
  table: null,

  row: alias('position.row'),
  column: alias('position.column'),

  showEditButton: and('cell.isEditable', 'cell.showActions'),

  showColumnButtons: computed('row', 'cell.showActions', function () {
    return this.get('row') === -1 && this.get('cell.showActions');
  }),

  showRemoveColumnButton: and('showColumnButtons', 'cell.isRemovable'),

  showMoveColumnLeftButton: computed('showColumnButtons', 'cell.isMovable', 'column', 'table.headers.cells.length', function () {
    return this.get('table').columnCanMoveLeft(this.get('column')) && this.get('showColumnButtons');
  }),

  showMoveColumnRightButton: computed('showColumnButtons', 'cell.isMovable', 'column', 'table.headers.cells.length', function () {
    return this.get('table').columnCanMoveRight(this.get('column')) && this.get('showColumnButtons');
  }),

  showAddLastColumn: computed('cell.showAddLastColumn', 'column', 'row', 'table.headers.cells.length', function () {
    return this.get('row') === -1 && this.get('column') === this.get('table.headers.cells.length') - 1 && this.get('cell.showAddLastColumn');
  }),

  showAddFirstColumn: computed('cell.showAddFirstColumn', 'row', 'column', function () {
    return this.get('row') === -1 && this.get('column') === 0 && this.get('cell.showAddFirstColumn');
  }),

  showRowButtons: computed('row', 'cell.showActions', function () {
    return this.get('row') !== -1 && this.get('cell.showActions');
  }),

  showDuplicateRowButton: and('showRowButtons', 'showDuplicateRow'),

  showRemoveRowButton: and('showRowButtons', 'cell.isRemovable'),

  showMoveRowUpButton: computed('showRowButtons', 'cell.isMovable', 'row', 'table.body.length', function () {
    var row = this.get('row');
    if (row === -1) {
      return;
    }

    return this.get('table').rowCanMoveUp(row);
  }),

  showMoveRowDownButton: computed('showRowButtons', 'cell.isMovable', 'row', 'table.body.length', function () {
    var row = this.get('row');
    if (row === -1) {
      return;
    }

    return this.get('table').rowCanMoveDown(row);
  }),

  didInsertElement() {
    this._super(...arguments)
    let self = this;

    this.$().on('click', '.ht-dropdown__toggle', function (event) {
      var menu = self.$('.ht-dropdown__menu'),
        menuHeight = menu.height(),
        menuVisY = $(window).height() - (menuHeight + event.pageY);
      if (menuVisY < 0) {
        menu.css({
          top: 'initial',
          bottom: '100%'
        });
      } else {
        menu.css({
          top: '',
          bottom: ''
        });
      }
    });
  },


  actions: {
    manipulate: function (label, index) {
      this.get('manipulate')(label, index)
    },
  }
});
