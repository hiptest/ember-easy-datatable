import { computed, observer } from '@ember/object'
import Component from '@ember/component'
import { isNone } from '@ember/utils'
import { schedule, cancel, later } from '@ember/runloop'
import { Promise } from 'rsvp'
export default Component.extend({
  cell: null,
  row: null,
  table: null,
  rowIndex: null,
  editorShown: false,
  inError: computed.notEmpty('errorMessage'),
  errorMessage: '',
  showEditorForSelectedCell: null,
  highlightedRow: null,
  highlightedColumn: null,
  selectedCellPosition: null,
  isHighlighted: computed.or('inHighlightedRow', 'inHighlightedColumn'),
  classNameBindings: [
    'cell.isEditable::protected',
    'cell.isSelected:selected',
    'isHighlighted:highlighted',
    'inError:error',
    'inError:alert',
    'inError:alert-danger',
  ],
  attributeBindings: ['tabindex'],
  tabindex: 1,

  displayableIndex: computed('position.row', function () {
    return this.get('position.row') + 1
  }),

  focusIn() {
    if (this.get('cell.isSelected')) {
      return
    }
    this.set('selectedCellPosition', this.position)
  },

  keyDown(event) {
    if (event.ctrlKey) {
      if (this.get('cell.isHeader')) {
        this.keyManipulation(event)
      }
    } else if (!this.keyNavigation(event)) {
      this.startEdition()
    }
  },

  keyNavigation(event) {
    var mapping = {
        37: 'navigateLeft',
        38: 'navigateUp',
        39: 'navigateRight',
        40: 'navigateDown',
      },
      action = mapping[event.which]

    if (event.which === 9) {
      action = event.shiftKey ? 'navigateLeft' : 'navigateRight'
    }

    if (!isNone(action)) {
      event.preventDefault()
      this.navigate(action)
      return true
    }
  },

  keyManipulation(event) {
    var mapping, action
    if (this.get('position.row') === -1) {
      var column_index = this.get('position.column')
      mapping = {
        45: { label: 'insertColumnAfter', index: column_index + 1 },
        46: { label: 'removeColumn', index: column_index },
        37: { label: 'moveColumnLeft', index: column_index },
        39: { label: 'moveColumnRight', index: column_index },
      }
    } else {
      var row_index = this.get('position.row')
      mapping = {
        45: { label: 'insertRowAfter', index: row_index + 1 },
        46: { label: 'removeRow', index: row_index },
        38: { label: 'moveRowUp', index: row_index },
        40: { label: 'moveRowDown', index: row_index },
      }
    }

    action = mapping[event.which]
    if (!isNone(action)) {
      this.manipulate(action.label, action.index)
    }
  },

  columnIndex: computed('cell', 'row.cells.[]', function () {
    return this.get('row.cells').indexOf(this.cell)
  }),

  position: computed('rowIndex', 'columnIndex', function () {
    return {
      row: this.rowIndex,
      column: this.columnIndex,
    }
  }),

  init() {
    this._super(...arguments)
    this._showEditor()
  },

  didInsertElement() {
    this._super(...arguments)
    this._focusOnCell()
  },

  startEditionWhenAsked: observer('showEditorForSelectedCell', function () {
    this._showEditor()
  }),

  _showEditor() {
    schedule('afterRender', this, function () {
      if (!this.showEditorForSelectedCell) {
        return
      }

      if (this.get('cell.isSelected') && !this.editorShown) {
        this.startEdition()
        this.set('showEditorForSelectedCell', false)
      }
    })
  },

  focusWhenSelected: observer('cell.isSelected', function () {
    this._handleFocusState()
  }),

  click() {
    this.startEdition()
  },

  startEdition() {
    if (this.get('cell.isEditable')) {
      this.set('editorShown', true)
    }
  },

  actions: {
    navigate(direction) {
      this.navigate(direction)
    },

    manipulate(label, index) {
      this.manipulate(label, index)
    },

    stopEdition() {
      this.set('errorMessage', '')
      this.set('editorShown', false)
      this.notifyPropertyChange('cell.isSelected')
    },

    stopEditionAndKeepFocus() {
      this.send('stopEdition')
      this.$().focus()
    },

    save(newValue, postSaveAction) {
      var self = this

      self.get('targetObject') // to force self.sendAction to know targetObject - bug ember ?
      this.validateValue(newValue).then(
        function (validatedNewValue) {
          if (self.get('isDestroyed')) {
            return
          }
          self.set('cell.value', validatedNewValue)
          self.send('stopEdition')
          self.get('table').notifyPropertyChange('contentUpdated')
          if (!isNone(postSaveAction)) {
            self.sendAction('navigate', postSaveAction)
          }
        },
        function (error) {
          if (self.get('isDestroyed')) {
            return
          }
          self.set('errorMessage', error)
        }
      )
    },

    saveOnLeave(newValue) {
      var self = this

      this.validateValue(newValue).then(
        function (validatedNewValue) {
          if (self.get('isDestroyed')) {
            return
          }
          self.set('cell.value', validatedNewValue)
          self.send('stopEdition')
          self.get('table').notifyPropertyChange('contentUpdated')
        },
        function () {
          if (self.get('isDestroyed')) {
            return
          }
          self.send('stopEdition')
        }
      )
    },

    open(dropdown, e) {
      if (this.closeTimer) {
        cancel(this.closeTimer)
        this.closeTimer = null
      } else {
        dropdown.actions.open(e)
      }

      this.focusIn()
    },

    closeLater(dropdown, e) {
      this.closeTimer = later(() => {
        this.closeTimer = null
        dropdown.actions.close(e)
      }, 100)
    },

    closeAfterAction(dropdown) {
      dropdown.actions.close()
    },
  },

  validateValue(value) {
    var datatable = this.table,
      cell = this.cell,
      position = this.position,
      isValid
    isValid = datatable.validateCell(cell, position, value)
    // is it a promise? (async validation)
    if (isValid instanceof Promise) {
      return isValid
      // no, so it is a boolean (sync validation)
    } else if (isValid) {
      return Promise.resolve(value)
    } else {
      return Promise.reject('Invalid value')
    }
  },

  inHighlightedRow: computed('highlightedRow', 'position.row', function () {
    return this.get('position.row') === this.highlightedRow
  }),

  inHighlightedColumn: computed('highlightedColumn', 'position.column', function () {
    return this.get('position.column') === this.highlightedColumn
  }),

  calculatePosition(trigger, content) {
    let { top, left, height } = trigger.getBoundingClientRect()
    let { height: contentHeight, width: contentWidth } = content.getBoundingClientRect()
    let style = {
      left: left - contentWidth,
      top: top + window.pageYOffset + height / 2 - contentHeight / 2,
    }

    return { style }
  },

  _focusOnCell() {
    schedule('afterRender', this, function () {
      const position = this.position,
        selected = this.selectedCellPosition

      if (this.editorShown || isNone(selected)) {
        return
      }

      if (position.row === selected.row && position.column === selected.column) {
        this.$().focus()
      }
    })
  },

  _handleFocusState() {
    schedule('afterRender', this, function () {
      if (isNone(this.$())) {
        return
      }

      if (this.get('cell.isSelected') && !this.editorShown) {
        this.$().focus()
      } else {
        this.$().blur()
      }
    })
  },
})
