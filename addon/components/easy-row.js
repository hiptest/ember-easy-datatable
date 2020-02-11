import Component from '@ember/component'

import { computed } from '@ember/object'

export default Component.extend({
  tagName: 'tr',
  row: null,
  table: null,

  rowIndex: computed('row', 'table.body.[]', function () {
    return this.get('table.body').indexOf(this.get('row'));
  }),

  actions : {
    navigate: function (direction) {
      this.get('navigate')(direction);
    },

    manipulate: function (label, index) {
      this.get('manipulate')(label, index);
    }
  }
});
