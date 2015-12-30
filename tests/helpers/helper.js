import Ember from 'ember';

export default Ember.Object.create({
  assertDatatableContent: function (assert, table, content, message) {
    assert.deepEqual(this.getDatatableContent(table), content, message || 'The datatable content is correct');
  },

  assertEditorShown: function (assert, table, message) {
    assert.ok(this.getInputField(table).length === 1, message || 'Editor is displayed');
  },

  assertNoSelectedDatatableCell: function (assert, table, message) {
    assert.equal(this.getSelectedCell(table).length, 0, message || 'No cell is currently selected');
  },

  assertSelectedDatatableCell: function (assert, table, row, column, message) {
    assert.deepEqual(this.getSelectedPosition(table), {row: row, column: column}, message || 'The correct cell is selected');
  },

  clickOnDatatableCell: function(table, row, column) {
    var element = table.find(Ember.String.fmt('tr:nth(%@)', row)).find('td, th').eq(column);
    element.focus();
    element.click();
  },

  pressEnterInDatatable: function (table) {
   this.pressKey(table, 13);
  },

  pressEscInDatatable: function (table) {
   this.pressKey(table, 27);
  },

  pressUpKeyInDatatable: function (table) {
   this.pressKey(table, 38);
  },

  pressDownKeyInDatatable: function (table) {
   this.pressKey(table, 40);
  },

  pressRightKeyInDatatable: function (table) {
   this.pressKey(table, 39);
  },

  pressLeftKeyInDatatable: function (table) {
   this.pressKey(table, 37);
  },

  pressCtrlUpKeyInDatatable: function (table) {
   this.pressKey(table, 38, true);
  },

  pressCtrlDownKeyInDatatable: function (table) {
   this.pressKey(table, 40, true);
  },

  pressCtrlRightKeyInDatatable: function (table) {
   this.pressKey(table, 39, true);
  },

  pressCtrlLeftKeyInDatatable: function (table) {
   this.pressKey(table, 37, true);
  },

  pressCtrlDelKeyInDatatable: function (table) {
   this.pressKey(table, 46, true);
  },
  
  pressCtrlInserKeyInDatatable: function (table) {
   this.pressKey(table, 45, true);
  },
  
  pressTabKeyInDatatable: function (table) {
   this.pressKey(table, 9);
  },
  
  pressShiftTabKeyInDatatable: function (table) {
   this.pressKey(table, 9, false, true);
  },

  typeInDatatable: function(table, value) {
    if (value !== '') {
      this.pressKey(table, value.charCodeAt(0));
      this.typeInDatatable(table, value.slice(1));
    }
  },

  getSelectedPosition: function (table) {
    var selected = this.getSelectedCell(table),
      rowElement = selected.parent(),
      column = rowElement.find('td, th').index(selected),
      row = rowElement.closest('table').find('tr').index(rowElement);

    return {row: row, column: column};
  },


  getSelectedCell: function (table) {
    return table.find('th.selected, td.selected').eq(0);
  },

  getDatatableContent: function (table) {
    var datatable = [];

    table.find('tbody tr').each(function () {
      var row = [];
      $(this).find('td').each(function () {
        row.push($(this).text().trim());
      });
      datatable.push(row);
    });
    return datatable;
  },

  getInputField: function (table) {
    return table.find('input');
  },

  pressKey: function (table, keyCode, ctrlKey, shiftKey) {
    // Does not ask for an element, send event to the currently focused element.
    var $el = $(document.activeElement),
      eventData = {
        which: keyCode,
        keyCode: keyCode,
        key: String.fromCharCode(keyCode),
        ctrlKey: ctrlKey || false,
        shiftKey: shiftKey || false
      },
      keyDownEvent = Ember.$.Event("keydown", eventData),
      keyUpEvent = Ember.$.Event("keyup", eventData);

      Ember.run(function () {
        var focused, character = String.fromCharCode(keyCode);
        $el.trigger(keyDownEvent);
        focused = $(document.activeElement);

        // Update input value if needed
        if (focused.is('input[type=text]') && character.match(/[a-zA-Z0-9 \.#\-_]/)) {
          focused.val(Ember.String.fmt('%@%@%@',
            focused.val().slice(0, focused.get(0).selectionStart),
            String.fromCharCode(keyCode),
            focused.val().slice(focused.get(0).selectionEnd)));
        }

        focused.trigger(keyUpEvent);
      });
    },
});
