import Ember from 'ember';

export default Ember.TextField.extend({
	valueState: 'unmodified',  // valid values are 'unmodified', 'modified', 'saved'
	oneWayValue: null,
	valueBinding: Ember.computed.oneWay('oneWayValue'),  // so updating input value
                                                      // does not update the originating value
  originalValue: Ember.computed('oneWayValue', function() {
    if (Ember.isNone(this.get('oneWayValue'))) {
      return this.get('oneWayValue');
    } else {
      return this.get('oneWayValue').toString();
    }
  }),

  onValueChanged: Ember.observer('value', function() {
    if (this.get('originalValue') !== this.get('value')) {
      this.set('valueState', 'modified');
    }
  }),

	keyDown: function (event) {
    event.stopPropagation();//TODO: pas besoin à mon avis
    if (event.which === 27) {
      this.set('valueState', 'unmodified');
      this.sendAction('stopEdition');
    }

    if (event.which === 13 || event.which === 9) {
      event.preventDefault();

      var postSaveAction = 'navigateDown';
      if (event.which === 9) {
        postSaveAction = event.shiftKey ? 'navigateLeft' : 'navigateRight';
      }

      if (this.get('valueState') === 'unmodified') {
        // warning: if edition is not leaved at this point, then it will trigger
        // an extra valueDidChange and it will save the value on focusOut. I
        // could not reproduce it in the test 'cell validation is not called at
        // all if not modified' because this behavior is at the jquery events
        // level and the test acts at the ember events level...
        this.sendAction('stopEdition');
        this.sendAction('navigate', postSaveAction);
      } else {
        this.sendAction('save', this.get('value'), postSaveAction);
        this.set('valueState', 'saved');
      }
    }
  },

  focusOut: function () {
    if (this.get('valueState') === 'modified') {
      this.sendAction('saveOnLeave', this.get('value'));
    } else {
      this.sendAction('stopEdition');
    }
  },

  placeAndFocusOnShow: Ember.on('didInsertElement', function () {
    var selectedCell = this.$().closest('th, td'),
      domElement = this.$().get(0),
      value = this.get('value') || '';

    // We need absolute positionning before checking the width/height of the cell
    // Otherwise, the input counts in the cell size
    this.$()
      .css({position: 'absolute'})
      .css({
        width: selectedCell.outerWidth(),
        height: selectedCell.outerHeight(),
        top: selectedCell.position().top,
        left: selectedCell.position().left
      }).focus();

    domElement.selectionStart = 0;
    domElement.selectionEnd = value.toString().length;
  }),
});
