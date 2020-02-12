import { hoverTrigger } from "./ember-basic-dropdown-helpers";
import $ from 'jquery'
import { fmt } from '@ember/string'
import { A } from '@ember/array'
import { run } from '@ember/runloop'

const customHelpers = {

  assertCurrentCellHasError(app, assert, message) {
    assert.ok(this.getSelectedCell().hasClass('error'), message || 'Current cell is in error');
  },

  assertCurrentCellHasNotError(app, assert, message) {
    assert.ok(!this.getSelectedCell().hasClass('error'), message || 'Current cell is not in error');
  },

	assertDatatableContent(app, assert, content, message) {
		assert.deepEqual(this.getDatatableContent(), content, message || 'The datatable content is correct');
  },

  assertDatatableHeader(app, assert, content, message) {
    assert.deepEqual(this.getDatatableHeaders(), content, message || 'Headers are correct');
  },

  assertEditorNotShown(app, assert, message) {
		assert.ok(this.getInputField().length === 0, message || 'Editor is not displayed');
  },

	assertEditorShown(app, assert, message) {
		assert.ok(this.getInputField().length === 1, message || 'Editor is displayed');
  },

  assertEditorContent(app, assert, content, message) {
    assert.equal(this.getInputField().get(0).value, content, message || 'Editor has the correct content');
  },

  assertNoSelectedDatatableCell(app, assert, message) {
    assert.equal(this.getSelectedCell().length, 0, message || 'No cell is currently selected');
  },

  assertSelectedDatatableCell(app, assert, row, column, message) {
    assert.deepEqual(this.getSelectedPosition(), {row: row, column: column}, message || 'The correct cell is selected');
  },

  assertHightlightedCellsText(app, assert, content, message) {
    assert.deepEqual(this.getHighlightedCellsText(), content, message || 'the correct cells are highlighted');
  },

  clickOnDatatableCell(row, column) {
    const element = $(`tr:nth(${row})`).find('td, th').eq(column);

    return run(function() {
      element.click()
    })
  },

  getHightlightedCellsText() {
    return $.find('td.highlighted, th.highlighted').map(elt => {
      return elt.textContent.trim()
    })
  },

  clearValueInDatatable() {
    fillIn($(document.activeElement), "");
  },

  clickOnMoveDownRow(app, row) {
    let context = fmt('tr:nth-child(%@)', row) + ' td:last-child,' + fmt('tr:nth-child(%@)', row) + ' th:last-child';
    hoverTrigger(context, {i: 0});

    let action = find('.t-row-action-move-down');

    return click(action);
  },

  clickOnMoveLeftColumn(app, columnIndex) {
    let context = fmt('thead tr:first-child td:nth-child(%@)', columnIndex + 1) + ', ' + fmt('thead tr:first-child th:nth-child(%@)', columnIndex + 1);

    hoverTrigger(context, {span: 0});

    let action = find('.t-column-action-move-left');

    return click(action);
  },


  clickOnMoveRightColumn(app, columnIndex) {
    let context = fmt('thead tr:first-child td:nth-child(%@)', columnIndex + 1) + ', ' + fmt('thead tr:first-child th:nth-child(%@)', columnIndex + 1);

    hoverTrigger(context, {span: 0});

    let action = find('.t-column-action-move-right');

    return click(action);
  },

  clickOnMoveUpRow(app, row) {
    let context = fmt('tr:nth-child(%@)', row) + ' td:last-child,' + fmt('tr:nth-child(%@)', row) + ' th:last-child';
    hoverTrigger(context, {i: 0});

    let action = find('.t-row-action-move-up');

    return click(action);
  },

  clickOnPlus(app, row, column) {
    var element = find(fmt('tr:nth(%@)', row)).find('td, th').eq(column);
    element.focus();
    click(element.find('.icon-plus'));
  },

  clickOnPencil(app, row, column) {
    let context = fmt('thead tr:nth-child(%@) td:nth-child(%@)', row, column + 1) + ', ' + fmt('thead tr:nth-child(%@) th:nth-child(%@)', row, column + 1);

    hoverTrigger(context, {span: 0});

    let action = find('.t-cell-action-edit');
    return click(action);
  },

  clickOnRemoveColumn(app, columnIndex) {
    let context = fmt('thead tr:first-child td:nth-child(%@)', columnIndex + 1) + ', ' + fmt('thead tr:first-child th:nth-child(%@)', columnIndex + 1);

    hoverTrigger(context, {span: 0});

    let action = find('.t-column-action-remove');

    return click(action);
  },

  clickOnRemoveRow(app, row) {
    let context = fmt('tr:nth-child(%@)', row) + ' td:last-child,' + fmt('tr:nth-child(%@)', row) + ' th:last-child';
    hoverTrigger(context, {i: 0});

    let removeAction = find('.t-row-action-remove');

    return click(removeAction);
  },

  pressEnterInDatatable() {
    pressKey(13);
  },

  pressEscInDatatable() {
    pressKey(27);
 },

  pressUpKeyInDatatable() {
    pressKey(38);
  },

  pressDownKeyInDatatable() {
    pressKey(40);
  },

  pressRightKeyInDatatable() {
    pressKey(39);
  },

  pressLeftKeyInDatatable() {
    pressKey(37);
  },

  pressCtrlUpKeyInDatatable() {
    pressKey(38, true);
  },

  pressCtrlDownKeyInDatatable() {
    pressKey(40, true);
  },

  pressCtrlRightKeyInDatatable() {
    pressKey(39, true);
  },

  pressCtrlLeftKeyInDatatable() {
    pressKey(37, true);
  },

  pressCtrlDelKeyInDatatable() {
    pressKey(46, true);
  },

  pressCtrlInserKeyInDatatable() {
    pressKey(45, true);
  },

  pressTabKeyInDatatable() {
    pressKey(9);
  },

  pressShiftTabKeyInDatatable() {
   pressKey(9, false, true);
  },

  pressKey(app, keyCode, ctrlKey, shiftKey) {
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
  },

  typeInDatatable(app, value) {
    if (value !== '') {
      pressKey(value.charCodeAt(0));
      typeInDatatable(value.slice(1));
    }
  },

  getSelectedPosition() {
    var selected = find('th.selected, td.selected').eq(0),
      rowElement = selected.parent(),
      column = rowElement.find('td, th').index(selected),
      row = rowElement.closest('table').find('tr').index(rowElement);

    return {row: row, column: column};
  },

  getSelectedCell() {
    return find('th.selected, td.selected').eq(0);
  },


  getHighlightedCellsText () {
    return find('td.highlighted, th.highlighted').map(function () {
      return $(this).text().trim();
    }).get();
  },

  getInputField () {
    return find('input');
  },

  getDatatableContent() {
		var datatableContent = A();
		find('tbody tr').each(function () {
      var row = A();
      $(this).find('td').each(function () {
        row.push($(this).text().trim());
      });
      datatableContent.push(row);
    });
    return datatableContent;
  },

  getDatatableHeaders () {
    return find('thead th').map(function () {
      return $(this).text().trim();
    }).get();
  },
};

export default customHelpers;