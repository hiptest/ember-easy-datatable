import Ember from 'ember';

export default Ember.Component.extend({
	cell: null,
	row: null,
  table: null,
	rowIndex: null,
  editorShown: false,
  showEditorForSelectedCell: null,
  highlightedRow: null,
  highlightedColumn: null,
  selectedCellPosition: null,
  isHighlighted: Ember.computed.or('inHighlightedRow', 'inHighlightedColumn'),
  classNameBindings: [
    'cell.isEditable::protected',
    'cell.isSelected:selected',
    'isHighlighted:highlighted',
    'inError:error',
    'inError:alert',
    'inError:alert-danger'
  ],
  attributeBindings: ['tabindex'],
  tabindex: 1,

	displayableIndex: Ember.computed('position', function () {
    return this.get('position.row') + 1;
  }),

  focusIn: function () {
    if (this.get('cell.isSelected')) {
      return;
    }
    this.set('selectedCellPosition', this.get('position'));
  },

  keyDown: function (event) {
    if (event.ctrlKey) {
      if (this.get('cell.isHeader')) {
        this.manipulate(event);
      }
    } else if (!this.navigate(event)) {
      this.send('startEdition');
    }
  },

  navigate: function (event) {
    var mapping = {
        37: 'navigateLeft',
        38: 'navigateUp',
        39: 'navigateRight',
        40: 'navigateDown'
      },
      action = mapping[event.which];

    if (event.which === 9) {
      action = event.shiftKey ? 'navigateLeft' : 'navigateRight';
    }

    if (!Ember.isNone(action)) {
      event.preventDefault();
      this.sendAction(action);
      return true;
    }
  },

  manipulate: function (event) {
    var mapping, action;
    if (this.get('position.row') === -1) {
      mapping = {
        45: 'insertColumnAfter',
        46: 'removeColumn',
        37: 'moveColumnLeft',
        39: 'moveColumnRight'
      };
    } else {
      mapping = {
        45: 'insertRowAfter',
        46: 'removeRow',
        38: 'moveRowUp',
        40: 'moveRowDown'
      };
    }

    action = mapping[event.which];
    if (!Ember.isNone(action)) {
      this.send(action);
    }
  },

  columnIndex: Ember.computed('cell', 'row.cells.[]', function () {
    return this.get('row.cells').indexOf(this.get('cell'));
  }),

  position: Ember.computed('rowIndex', 'columnIndex', function () {
    return {
      row: this.get('rowIndex'),
      column: this.get('columnIndex')
    };
  }),

  click: function () {
    this.startEdition();
  },

  startEditionWhenAsked: Ember.observer('showEditorForSelectedCell', function () {
    Ember.run.schedule('afterRender', this, function () {
      if (this.get('cell.isSelected') && !this.get('editorShown') && this.get('showEditorForSelectedCell')) {
        this.get('controller').send('startEdition');
        this.set('showEditorForSelectedCell', false);
      }
    });
  }),

  focusWhenSelected: Ember.observer('cell.isSelected', function () {
    Ember.run.schedule('afterRender', this, function () {
      if (Ember.isNone(this.$())) {
        return;
      }

      if (this.get('cell.isSelected') && !this.get('editorShown')) {
        this.$().focus();
      } else {
        this.$().blur();
      }
    });
  }),
  
  focusAfterRender: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, function () {
      var position = this.get('position'),
        selected = this.get('selectedCellPosition');

      if (this.get('editorShown') || Ember.isNone(selected)) {
        return;
      }

      if (position.row === selected.row && position.column === selected.column) {
        this.$().focus();
      }
    });
  }),

  startEdition: function () {
    if (this.get('cell.isEditable')) {
      this.set('editorShown', true);
    }
  },

  actions: {
    navigateLeft: function () {
      this.sendAction('navigateLeft');
    },

    navigateRight: function () {
      this.sendAction('navigateRight');
    },

    navigateDown: function () {
      this.sendAction('navigateDown');
    },

    stopEdition: function () {
      this.set('errorMessage', '');
      this.set('editorShown', false);
      this.notifyPropertyChange('cell.isSelected');
    },

    save: function (newValue, postSaveAction) {
      var self = this;

      this.validateValue(newValue).then(function (validatedNewValue) {
        if (self.get('isDestroyed')) {
          return;
        }
        self.set('cell.value', validatedNewValue);
        self.send('stopEdition');
        self.get('table').notifyPropertyChange('contentUpdated');
        if (!Ember.isNone(postSaveAction)) {
          self.sendAction(postSaveAction);
        }
      }, function (error) {
        if (self.get('isDestroyed')) {
          return;
        }
        self.set('errorMessage', error);
      });
    },

    saveOnLeave: function (newValue) {
      var self = this;

      this.validateValue(newValue).then(function (validatedNewValue) {
        if (self.get('isDestroyed')) {
          return;
        }
        self.set('cell.value', validatedNewValue);
        self.send('stopEdition');
        self.get('table').notifyPropertyChange('contentUpdated');
      }, function () {
        if (self.get('isDestroyed')) {
          return;
        }
        self.send('stopEdition');
      });
    },
  },

  validateValue: function (value) {
    var datatable = this.get('table'),
      cell = this.get('cell'),
      position = this.get('position'),
      isValid;
    isValid = datatable.validateCell(cell, position, value);
    // is it a promise? (async validation)
    if (isValid instanceof Ember.RSVP.Promise) {
      return isValid;
    // no, so it is a boolean (sync validation)
    } else if (isValid) {
      return Ember.RSVP.Promise.resolve(value);
    } else {
      return Ember.RSVP.Promise.reject("Invalid value");
    }
  },

  inHighlightedRow: Ember.computed('position', 'highlightedRow', function () {
    return this.get('position.row') === this.get('highlightedRow');
  }),

  inHighlightedColumn: Ember.computed('position', 'highlightedColumn', function () {
    return this.get('position.column') === this.get('highlightedColumn');
  }),
});