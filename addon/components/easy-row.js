import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  row: null,
  table: null,

	// because in addon prototype extensions are turned off
	// https://dockyard.com/blog/2015/03/22/tips-for-writing-ember-addons
	// https://guides.emberjs.com/v1.11.0/configuring-ember/disabling-prototype-extensions/
  rowIndex: Ember.computed('row', 'table.body.[]', function () {
    return this.get('table.body').indexOf(this.get('row'));
  }),

  actions : {
    navigateLeft: function () {
  		this.sendAction('navigateLeft');
  	},

  	navigateUp: function () {
  		this.sendAction('navigateUp');
  	},
  	
  	navigateRight: function () {
  		this.sendAction('navigateRight');
  	},

  	navigateDown: function () {
  		this.sendAction('navigateDown');
  	},

    removeRow: function (index) {
      this.sendAction('removeRow', index);
    },

    removeColumn: function (index) {
      this.sendAction('removeColumn', index);
    },

    insertRowAfter: function (index) {
      this.sendAction('insertRowAfter', index);
    },

    moveRowDown: function (index) {
      this.sendAction('moveRowDown', index);
    }
  }
});