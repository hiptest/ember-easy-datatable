import Ember from 'ember';

export default Ember.Component.extend({
	cell: null,
	row: null,
  table: null,
	rowIndex: null,
  editorShown: false,
  inError: Ember.computed.notEmpty('errorMessage'),
  errorMessage: '',
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
        this.keyManipulation(event);
      }
    } else if (!this.keyNavigation(event)) {
      this.startEdition();
    }
  },

  keyNavigation: function (event) {
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
      this.sendAction('navigate', action);
      return true;
    }
  },

  keyManipulation: function (event) {
    var mapping, action;
    if (this.get('position.row') === -1) {
      var column_index = this.get('position.column');
      mapping = {
        45: {label: 'insertColumnAfter', index: column_index + 1},
        46: {label: 'removeColumn', index: column_index},
        37: {label: 'moveColumnLeft', index: column_index},
        39: {label: 'moveColumnRight', index: column_index}
      };
    } else {
      var row_index = this.get('position.row');
      mapping = {
        45: {label: 'insertRowAfter', index: row_index + 1},
        46: {label: 'removeRow', index: row_index},
        38: {label: 'moveRowUp', index: row_index},
        40: {label: 'moveRowDown', index: row_index}
      };
    }

    action = mapping[event.which];
    if (!Ember.isNone(action)) {
      this.sendAction('manipulate', action.label, action.index);
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

  startEditionWhenAsked: Ember.on('init', Ember.observer('showEditorForSelectedCell', function () {
    Ember.run.schedule('afterRender', this, function () {
      if (this.get('cell.isSelected') && !this.get('editorShown') && this.get('showEditorForSelectedCell')) {
        this.startEdition();
        this.set('showEditorForSelectedCell', false);
      }
    });
  })),

  focusWhenSelected: Ember.on('init', Ember.observer('cell.isSelected', function () {
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
  })),

  focusAfterRender: Ember.on('init', Ember.on('didInsertElement', function () {
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
  })),

  startEdition: function () {
    if (this.get('cell.isEditable')) {
      this.set('editorShown', true);
    }
  },

  actions: {
    navigate: function (direction) {
      this.sendAction('navigate', direction);
    },

    manipulate: function (label, index) {
      this.sendAction('manipulate', label, index);
    },

    stopEdition: function () {
      this.set('errorMessage', '');
      this.set('editorShown', false);
      this.notifyPropertyChange('cell.isSelected');
    },

    save: function (newValue, postSaveAction) {
      var self = this;

      self.get('targetObject'); // to force self.sendAction to know targetObject - bug ember ?
      this.validateValue(newValue).then(function (validatedNewValue) {
        if (self.get('isDestroyed')) {
          return;
        }
        self.set('cell.value', validatedNewValue);
        self.send('stopEdition');
        self.get('table').notifyPropertyChange('contentUpdated');
        if (!Ember.isNone(postSaveAction)) {
          self.sendAction('navigate', postSaveAction);
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
    }
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
