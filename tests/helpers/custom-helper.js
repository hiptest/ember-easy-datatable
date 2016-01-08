import Ember from 'ember';

var customHelpers = function() {
  Ember.Test.registerAsyncHelper('assertCurrentCellHasError', function (app, assert, message) {
    assert.ok(getSelectedCell().hasClass('error'), message || 'Current cell is in error');
  });

  Ember.Test.registerAsyncHelper('assertCurrentCellHasNotError', function (app, assert, message) {
    assert.ok(!getSelectedCell().hasClass('error'), message || 'Current cell is not in error');
  });

	Ember.Test.registerAsyncHelper('assertDatatableContent', function (app, assert, content, message) {
		assert.deepEqual(getDatatableContent(), content, message || 'The datatable content is correct');
  });

  Ember.Test.registerAsyncHelper('assertDatatableHeader', function (app, assert, content, message) {
    assert.deepEqual(getDatatableHeaders(), content, message || 'Headers are correct');
  });

  Ember.Test.registerAsyncHelper('assertEditorNotShown', function (app, assert, message) {
		assert.ok(getInputField().length === 0, message || 'Editor is not displayed');
  });

	Ember.Test.registerAsyncHelper('assertEditorShown', function (app, assert, message) {
		assert.ok(getInputField().length === 1, message || 'Editor is displayed');
  });

  Ember.Test.registerAsyncHelper('assertNoSelectedDatatableCell', function (app, assert, message) {
    assert.equal(getSelectedCell().length, 0, message || 'No cell is currently selected');
  });

  Ember.Test.registerAsyncHelper('assertSelectedDatatableCell', function (app, assert, row, column, message) {
    assert.deepEqual(getSelectedPosition(), {row: row, column: column}, message || 'The correct cell is selected');
  });

  Ember.Test.registerAsyncHelper('assertHightlightedCellsText', function (app, assert, content, message) {
    assert.deepEqual(getHighlightedCellsText(), content, message || 'the correct cells are highlighted');
  });

  Ember.Test.registerAsyncHelper('clearValueInDatatable', function () {
    fillIn($(document.activeElement), "");
  });

  Ember.Test.registerAsyncHelper('clickOnDatatableCell', function(app, row, column) {
    var element = find(Ember.String.fmt('tr:nth(%@)', row)).find('td, th').eq(column);
    element.focus();
    click(element);
  });

  
  Ember.Test.registerAsyncHelper('clickOnMoveDownRow', function(app, row) {
    var cell = find(Ember.String.fmt('tr:nth(%@)', row)).find('td, th').last(),
      element = cell.find('.glyphicon-arrow-down');
    cell.focus();
    click(element);
  });

  Ember.Test.registerAsyncHelper('clickOnMoveLeftColumn', function(app, columnIndex) {
    var cell = find(Ember.String.fmt('tr:nth(0)')).find('td, th').eq(columnIndex),
      element = cell.find('.glyphicon-arrow-left');
    cell.focus();
    click(element);
  });


  Ember.Test.registerAsyncHelper('clickOnMoveRightColumn', function(app, columnIndex) {
    var cell = find(Ember.String.fmt('tr:nth(0)')).find('td, th').eq(columnIndex),
      element = cell.find('.glyphicon-arrow-right');
    cell.focus();
    click(element);
  });

  Ember.Test.registerAsyncHelper('clickOnMoveUpRow', function(app, row) {
    var cell = find(Ember.String.fmt('tr:nth(%@)', row)).find('td, th').last(),
      element = cell.find('.glyphicon-arrow-up');
    cell.focus();
    click(element);
  });

  Ember.Test.registerAsyncHelper('clickOnPencil', function(app, row, column) {
    var element = find(Ember.String.fmt('tr:nth(%@)', row)).find('td, th').eq(column);
    element.focus();
    click(element.find('.glyphicon-pencil'));
  });

  Ember.Test.registerAsyncHelper('clickOnRemoveColumn', function(app, columnIndex) {
    var cell = find(Ember.String.fmt('tr:first-child')).find('td, th').eq(columnIndex),
      element = cell.find('.glyphicon-remove');
    cell.focus();
    click(element);
  });

  Ember.Test.registerAsyncHelper('clickOnRemoveRow', function(app, row) {
    var cell = find(Ember.String.fmt('tr:nth(%@)', row)).find('td, th').last(),
      element = cell.find('.glyphicon-remove');
    cell.focus();
    click(element);
  });

  Ember.Test.registerAsyncHelper('debug', function () {
  	debugger;
  });

  Ember.Test.registerAsyncHelper('pressEnterInDatatable', function () {
   pressKey(13);
  });

  Ember.Test.registerAsyncHelper('pressEscInDatatable', function () {
   pressKey(27);
  });

  Ember.Test.registerAsyncHelper('pressUpKeyInDatatable', function () {
   pressKey(38);
  });

  Ember.Test.registerAsyncHelper('pressDownKeyInDatatable', function () {
   pressKey(40);
  });

  Ember.Test.registerAsyncHelper('pressRightKeyInDatatable', function () {
   pressKey(39);
  });

  Ember.Test.registerAsyncHelper('pressLeftKeyInDatatable', function () {
   pressKey(37);
  });

  Ember.Test.registerAsyncHelper('pressCtrlUpKeyInDatatable', function () {
   pressKey(38, true);
  });

  Ember.Test.registerAsyncHelper('pressCtrlDownKeyInDatatable', function () {
   pressKey(40, true);
  });

  Ember.Test.registerAsyncHelper('pressCtrlRightKeyInDatatable', function () {
   pressKey(39, true);
  });

  Ember.Test.registerAsyncHelper('pressCtrlLeftKeyInDatatable', function () {
   pressKey(37, true);
  });

  Ember.Test.registerAsyncHelper('pressCtrlDelKeyInDatatable', function () {
   pressKey(46, true);
  });
  
  Ember.Test.registerAsyncHelper('pressCtrlInserKeyInDatatable', function () {
   pressKey(45, true);
  });
  
  Ember.Test.registerAsyncHelper('pressTabKeyInDatatable', function () {
   pressKey(9);
  });
  
  Ember.Test.registerAsyncHelper('pressShiftTabKeyInDatatable', function () {
   pressKey(9, false, true);
  });

  Ember.Test.registerAsyncHelper('pressKey', function (app, keyCode, ctrlKey, shiftKey) {
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
      $el.trigger(keyDownEvent);
    });

    Ember.run(function () {
      var character = String.fromCharCode(keyCode),
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
  });

  Ember.Test.registerAsyncHelper('typeInDatatable', function (app, value) {
    if (value !== '') {
      pressKey(value.charCodeAt(0));
      typeInDatatable(value.slice(1));
    }
  });

  function getSelectedPosition() {
    var selected = find('th.selected, td.selected').eq(0),
      rowElement = selected.parent(),
      column = rowElement.find('td, th').index(selected),
      row = rowElement.closest('table').find('tr').index(rowElement);

    return {row: row, column: column};
  }

  Ember.Test.registerAsyncHelper('getSelectedCell', function () {
    return find('th.selected, td.selected').eq(0);
  });

  
  function getHighlightedCellsText () {
    return find('td.highlighted, th.highlighted').map(function () {
      return $(this).text().trim();
    }).get();
  }

  function getInputField () {
    return find('input');
  }

  function getDatatableContent() {
		var datatableContent = [];
		find('tbody tr').each(function () {
      var row = [];
      $(this).find('td').each(function () {
        row.push($(this).text().trim());
      });
      datatableContent.push(row);
    });
    return datatableContent;
  }

  function getDatatableHeaders () {
    return find('thead th').map(function () {
      return $(this).text().trim();
    }).get();
  }

  function getSelectedCell () {
    return find('th.selected, td.selected').eq(0);
  }
}();

export default customHelpers;
