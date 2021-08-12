import Component from '@ember/component'

import { computed } from '@ember/object'

export default Component.extend({
  tagName: 'tr',
  row: null,
  table: null,

  rowIndex: computed('row', 'table.body.[]', function () {
    return this.table.body.indexOf(this.row)
  }),

  actions: {
    navigate: function (direction) {
      this.navigate(direction)
    },

    manipulate: function (label, index) {
      this.manipulate(label, index)
    },
  },
})
