import EmberObject from "@ember/object";
import { computed } from '@ember/object'

export default EmberObject.extend({
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

  tag: computed('isHeader', function () {
		return this.get('isHeader') ? 'th' : 'td';
	})
});
