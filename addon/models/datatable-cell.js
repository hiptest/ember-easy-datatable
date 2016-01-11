import Ember from "ember";

export default Ember.Object.extend({
  isSelected: false,
  isHeader: false,
  isEditable: true,
  isMovable: true,
  isRemovable: true,
  canInsertColumnAfter: true,
  canInsertRowAfter: true,
  value: null,
  showActions: false,
  showAddLastColumn: false,

  tag: Ember.computed('isHeader', function () {
		return this.get('isHeader') ? 'th' : 'td';
	})
});