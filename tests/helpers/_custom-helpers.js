import { hoverTrigger } from './ember-basic-dropdown-helpers'
import $ from 'jquery'
import { A } from '@ember/array'
import { run } from '@ember/runloop'
import { click, fillIn, triggerKeyEvent, typeIn } from '@ember/test-helpers'

const customHelpers = {
  assertCurrentCellHasError(assert, message) {
    assert.ok(this.getSelectedCell().hasClass('error'), message || 'Current cell is in error')
  },

  assertCurrentCellHasNotError(assert, message) {
    assert.ok(!this.getSelectedCell().hasClass('error'), message || 'Current cell is not in error')
  },

  assertDatatableContent(assert, content, message) {
    assert.deepEqual(this.getDatatableContent(), content, message || 'The datatable content is correct')
  },

  assertDatatableHeader(assert, content, message) {
    assert.deepEqual(this.getDatatableHeaders(), content, message || 'Headers are correct')
  },

  assertEditorNotShown(assert, message) {
    assert.ok(this.getInputField().length === 0, message || 'Editor is not displayed')
  },

  assertEditorShown(assert, message) {
    assert.ok(this.getInputField().length === 1, message || 'Editor is displayed')
  },

  assertEditorContent(assert, content, message) {
    assert.equal(this.getInputField().get(0).value, content, message || 'Editor has the correct content')
  },

  assertNoSelectedDatatableCell(assert, message) {
    assert.equal(this.getSelectedCell().length, 0, message || 'No cell is currently selected')
  },

  assertSelectedDatatableCell(assert, row, column, message) {
    assert.deepEqual(
      this.getSelectedPosition(),
      { row: row, column: column },
      message || 'The correct cell is selected'
    )
  },

  assertHightlightedCellsText(assert, content, message) {
    assert.deepEqual(this.getHighlightedCellsText(), content, message || 'the correct cells are highlighted')
  },

  async clickOnDatatableCell(row, column) {
    const element = $(`tr:nth(${row})`).find('td, th').eq(column)

    await click(element[0])
  },

  getHightlightedCellsText() {
    return $.find('td.highlighted, th.highlighted').map((elt) => {
      return elt.textContent.trim()
    })
  },

  clearValueInDatatable() {
    fillIn($(document.activeElement), '')
  },

  clickOnMoveDownRow(row) {
    let context = `tr:nth-child(${row}) td:last-child, tr:nth-child(${row}) th:last-child`
    hoverTrigger(context, { i: 0 })

    let action = $('.t-row-action-move-down')

    return action.click()
  },

  clickOnMoveLeftColumn(columnIndex) {
    let context = `thead tr:first-child td:nth-child(${columnIndex + 1}), thead tr:first-child th:nth-child(${
      columnIndex + 1
    })`
    hoverTrigger(context, { span: 0 })

    let action = $('.t-column-action-move-left')

    return action.click()
  },

  clickOnMoveRightColumn(columnIndex) {
    let context = `thead tr:first-child td:nth-child(${columnIndex + 1}), thead tr:first-child th:nth-child(${
      columnIndex + 1
    })`

    hoverTrigger(context, { span: 0 })

    let action = $('.t-column-action-move-right')

    return action.click()
  },

  clickOnMoveUpRow(row) {
    let context = `tr:nth-child(${row}) td:last-child, tr:nth-child(${row}) th:last-child`
    hoverTrigger(context, { i: 0 })

    let action = $('.t-row-action-move-up')

    return action.click()
  },

  async clickOnPlus(row, column) {
    await focus(`tr:nth-of-type(${row + 1}) th:nth-of-type(${column + 1})`)
    await click(`tr:nth-of-type(${row + 1}) th:nth-of-type(${column + 1}) .icon-plus`)
  },

  clickOnPencil(row, column) {
    let context = `thead tr:nth-child(${row}) td:nth-child(${column + 1}), thead tr:nth-child(${row}) th:nth-child(${
      column + 1
    })`

    hoverTrigger(context, { span: 0 })

    let action = find('.t-cell-action-edit')
    return click(action)
  },

  clickOnRemoveColumn(columnIndex) {
    let context = `thead tr:first-child td:nth-child(${columnIndex + 1}), thead tr:first-child th:nth-child(${
      columnIndex + 1
    })`

    hoverTrigger(context, { span: 0 })

    let action = $('.t-column-action-remove')

    return action.click()
  },

  async clickOnRemoveRow(row) {
    let context = `tr:nth-child(${row}) td:last-child, tr:nth-child(${row}) th:last-child`
    hoverTrigger(context, { i: 0 })

    await click('.t-row-action-remove')
  },

  async pressEnterInDatatable() {
    await this.pressKey(13)
  },

  async pressEscInDatatable() {
    await this.pressKey(27)
  },

  async pressUpKeyInDatatable() {
    await this.pressKey(38)
  },

  async pressDownKeyInDatatable() {
    await this.pressKey(40)
  },

  async pressRightKeyInDatatable() {
    await this.pressKey(39)
  },

  async pressLeftKeyInDatatable() {
    await this.pressKey(37)
  },

  async pressCtrlUpKeyInDatatable() {
    await this.pressKey(38, true)
  },

  async pressCtrlDownKeyInDatatable() {
    await this.pressKey(40, true)
  },

  async pressCtrlRightKeyInDatatable() {
    await this.pressKey(39, true)
  },

  async pressCtrlLeftKeyInDatatable() {
    await this.pressKey(37, true)
  },

  async pressCtrlDelKeyInDatatable() {
    await this.pressKey(46, true)
  },

  async pressCtrlInserKeyInDatatable() {
    await this.pressKey(45, true)
  },

  async pressTabKeyInDatatable() {
    await this.pressKey(9)
  },

  async pressShiftTabKeyInDatatable() {
    await this.pressKey(9, false, true)
  },

  async pressKey(keyCode, ctrlKey, shiftKey) {
    await triggerKeyEvent(document.activeElement, 'keydown', keyCode, {
      ctrlKey: ctrlKey || false,
      shiftKey: shiftKey || false,
    })
    /*
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
        const selStart = focused.val().slice(0, focused.get(0).selectionStart)
        const keyChar = String.fromCharCode(keyCode)
        const selEnd = focused.val().slice(focused.get(0).selectionEnd)

        focused.val(`${selStart}${keyChar}${selEnd}`);
      }

      focused.trigger(keyUpEvent);
    });
     */
  },

  async typeInDatatable(value) {
    if (value !== '') {
      await this.pressKey(value.charCodeAt(0))
      await fillIn('input', '')
      await typeIn('input', value)
    }
  },

  getSelectedPosition() {
    var selected = $('th.selected, td.selected').eq(0),
      rowElement = selected.parent(),
      column = rowElement.find('td, th').index(selected),
      row = rowElement.closest('table').find('tr').index(rowElement)

    return { row: row, column: column }
  },

  getSelectedCell() {
    return $('th.selected, td.selected').eq(0)
  },

  getHighlightedCellsText() {
    return $('td.highlighted, th.highlighted')
      .map(function () {
        return $(this).text().trim()
      })
      .get()
  },

  getInputField() {
    return find('input')
  },

  getDatatableContent() {
    const datatableContent = A()
    $.find('tbody tr').map((tr) => {
      const row = A()
      run(function () {
        $(tr)
          .find('td')
          .each(function () {
            row.push($(this).text().trim())
          })

        datatableContent.push(row)
      })
    })
    return datatableContent
  },

  getDatatableHeaders() {
    return $('thead th')
      .map(function () {
        return $(this).text().trim()
      })
      .get()
  },
}

export default customHelpers
