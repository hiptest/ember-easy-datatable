import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  row: null,
  table: null,

  rowIndex: Ember.computed('row', 'table.body.[]', function () {
    return this.get('table.body').indexOf(this.get('row'));
  }),

  actions : {
    navigate: function (direction) {
      this.sendAction('navigate', direction);
    },

    manipulate: function (label, index) {
      this.sendAction('manipulate', label, index);
    }
  }
});
