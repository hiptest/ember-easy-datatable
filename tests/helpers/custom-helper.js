import { hoverTrigger } from "./ember-basic-dropdown-helpers";
import { registerAsyncHelper } from '@ember/test'
import $ from 'jquery'
import { fmt } from '@ember/string'
import { A } from '@ember/array'
import { run } from '@ember/runloop'

const customHelpers = function() {
  registerAsyncHelper('assertCurrentCellHasError', function (app, assert, message) {
    assert.ok(getSelectedCell().hasClass('error'), message || 'Current cell is in error');
  });

  registerAsyncHelper('assertCurrentCellHasNotError', function (app, assert, message) {
    assert.ok(!getSelectedCell().hasClass('error'), message || 'Current cell is not in error');
  });

	registerAsyncHelper('assertDatatableContent', function (app, assert, content, message) {
		assert.deepEqual(getDatatableContent(), content, message || 'The datatable content is correct');
  });

  registerAsyncHelper('assertDatatableHeader', function (app, assert, content, message) {
    assert.deepEqual(getDatatableHeaders(), content, message || 'Headers are correct');
  });

  registerAsyncHelper('assertEditorNotShown', function (app, assert, message) {
		assert.ok(getInputField().length === 0, message || 'Editor is not displayed');
  });

	registerAsyncHelper('assertEditorShown', function (app, assert, message) {
		assert.ok(getInputField().length === 1, message || 'Editor is displayed');
  });

  registerAsyncHelper('assertEditorContent', function (app, assert, content, message) {
    assert.equal(getInputField().get(0).value, content, message || 'Editor has the correct content');
  });

  registerAsyncHelper('assertNoSelectedDatatableCell', function (app, assert, message) {
    assert.equal(getSelectedCell().length, 0, message || 'No cell is currently selected');
  });

  registerAsyncHelper('assertSelectedDatatableCell', function (app, assert, row, column, message) {
    assert.deepEqual(getSelectedPosition(), {row: row, column: column}, message || 'The correct cell is selected');
  });

  registerAsyncHelper('assertHightlightedCellsText', function (app, assert, content, message) {
    assert.deepEqual(getHighlightedCellsText(), content, message || 'the correct cells are highlighted');
  });

  registerAsyncHelper('clearValueInDatatable', function () {
    fillIn($(document.activeElement), "");
  });

  registerAsyncHelper('clickOnDatatableCell', function(app, row, column) {

    var element = find(fmt('tr:nth(%@)', row)).find('td, th').eq(column);
    element.focus();
    click(element);
  });


  registerAsyncHelper('clickOnMoveDownRow', function(app, row) {
    let context = fmt('tr:nth-child(%@)', row) + ' td:last-child,' + fmt('tr:nth-child(%@)', row) + ' th:last-child';
    hoverTrigger(context, {i: 0});

    let action = find('.t-row-action-move-down');

    return click(action);
  });

  registerAsyncHelper('clickOnMoveLeftColumn', function(app, columnIndex) {
    let context = fmt('thead tr:first-child td:nth-child(%@)', columnIndex + 1) + ', ' + fmt('thead tr:first-child th:nth-child(%@)', columnIndex + 1);

    hoverTrigger(context, {span: 0});

    let action = find('.t-column-action-move-left');

    return click(action);
  });


  registerAsyncHelper('clickOnMoveRightColumn', function(app, columnIndex) {
    let context = fmt('thead tr:first-child td:nth-child(%@)', columnIndex + 1) + ', ' + fmt('thead tr:first-child th:nth-child(%@)', columnIndex + 1);

    hoverTrigger(context, {span: 0});

    let action = find('.t-column-action-move-right');

    return click(action);
  });

  registerAsyncHelper('clickOnMoveUpRow', function(app, row) {
    let context = fmt('tr:nth-child(%@)', row) + ' td:last-child,' + fmt('tr:nth-child(%@)', row) + ' th:last-child';
    hoverTrigger(context, {i: 0});

    let action = find('.t-row-action-move-up');

    return click(action);
  });

  registerAsyncHelper('clickOnPlus', function(app, row, column) {
    var element = find(fmt('tr:nth(%@)', row)).find('td, th').eq(column);
    element.focus();
    click(element.find('.icon-plus'));
  });

  registerAsyncHelper('clickOnPencil', function(app, row, column) {
    let context = fmt('thead tr:nth-child(%@) td:nth-child(%@)', row, column + 1) + ', ' + fmt('thead tr:nth-child(%@) th:nth-child(%@)', row, column + 1);

    hoverTrigger(context, {span: 0});

    let action = find('.t-cell-action-edit');
    return click(action);
  });

  registerAsyncHelper('clickOnRemoveColumn', function(app, columnIndex) {
    let context = fmt('thead tr:first-child td:nth-child(%@)', columnIndex + 1) + ', ' + fmt('thead tr:first-child th:nth-child(%@)', columnIndex + 1);

    hoverTrigger(context, {span: 0});

    let action = find('.t-column-action-remove');

    return click(action);
  });

  registerAsyncHelper('clickOnRemoveRow', function(app, row) {
    let context = fmt('tr:nth-child(%@)', row) + ' td:last-child,' + fmt('tr:nth-child(%@)', row) + ' th:last-child';
    hoverTrigger(context, {i: 0});

    let removeAction = find('.t-row-action-remove');

    return click(removeAction);
  });

  registerAsyncHelper('debug', function () {

  });

  registerAsyncHelper('pressEnterInDatatable', function () {
   pressKey(13);
  });

  registerAsyncHelper('pressEscInDatatable', function () {
   pressKey(27);
  });

  registerAsyncHelper('pressUpKeyInDatatable', function () {
   pressKey(38);
  });

  registerAsyncHelper('pressDownKeyInDatatable', function () {
   pressKey(40);
  });

  registerAsyncHelper('pressRightKeyInDatatable', function () {
   pressKey(39);
  });

  registerAsyncHelper('pressLeftKeyInDatatable', function () {
   pressKey(37);
  });

  registerAsyncHelper('pressCtrlUpKeyInDatatable', function () {
   pressKey(38, true);
  });

  registerAsyncHelper('pressCtrlDownKeyInDatatable', function () {
   pressKey(40, true);
  });

  registerAsyncHelper('pressCtrlRightKeyInDatatable', function () {
   pressKey(39, true);
  });

  registerAsyncHelper('pressCtrlLeftKeyInDatatable', function () {
   pressKey(37, true);
  });

  registerAsyncHelper('pressCtrlDelKeyInDatatable', function () {
   pressKey(46, true);
  });

  registerAsyncHelper('pressCtrlInserKeyInDatatable', function () {
   pressKey(45, true);
  });

  registerAsyncHelper('pressTabKeyInDatatable', function () {
   pressKey(9);
  });

  registerAsyncHelper('pressShiftTabKeyInDatatable', function () {
   pressKey(9, false, true);
  });

  registerAsyncHelper('pressKey', function (app, keyCode, ctrlKey, shiftKey) {
    // Does not ask for an element, send event to the currently focused element.
    var $el = $(document.activeElement),
      eventData = {
        which: keyCode,
        keyCode: keyCode,
        key: String.fromCharCode(keyCode),
        ctrlKey: ctrlKey || false,
        shiftKey: shiftKey || false
      },
      keyDownEvent = $.Event("keydown", eventData),
      keyUpEvent = $.Event("keyup", eventData);

    run(function () {
      $el.trigger(keyDownEvent);
    });

    run(function () {
      var character = String.fromCharCode(keyCode),
        focused = $(document.activeElement);

      // Update input value if needed
      if (focused.is('input[type=text]') && character.match(/[a-zA-Z0-9 .#\-_]/)) {
        focused.val(fmt('%@%@%@',
          focused.val().slice(0, focused.get(0).selectionStart),
          String.fromCharCode(keyCode),
          focused.val().slice(focused.get(0).selectionEnd)));
      }

      focused.trigger(keyUpEvent);
    });
  });

  registerAsyncHelper('typeInDatatable', function (app, value) {
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

  registerAsyncHelper('getSelectedCell', function () {
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
		var datatableContent = A();
		find('tbody tr').each(function () {
      var row = A();
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
