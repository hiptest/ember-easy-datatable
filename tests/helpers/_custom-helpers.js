import { hoverTrigger } from './ember-basic-dropdown-helpers'
import $ from 'jquery'
import { A } from '@ember/array'
import { run } from '@ember/runloop'
import { click, fillIn, triggerKeyEvent, typeIn } from '@ember/test-helpers'

const customHelpers = {
  async clickOnDatatableValueCell(row, column) {
    await click(`tbody tr:nth-of-type(${row}) td:nth-of-type(${column})`)
  },

  async clickOnDatatableColumnCell(column) {
    await click(`thead tr:nth-of-type(1) th:nth-of-type(${column})`)
  },

  async clickOnDatatableRowCell(row) {
    await click(`tbody tr:nth-of-type(${row}) th:nth-of-type(1)`)
  },

  getHightlightedCellsText() {
    return Array.from(document.querySelectorAll('td.highlighted, th.highlighted')).map((elt) => {
      return elt.textContent.trim()
    })
  },

  async clickOnMoveDownRow(row) {
    let context = `tr:nth-child(${row}) td:last-child, tr:nth-child(${row}) th:last-child`
    hoverTrigger(context, { i: 0 })

    await click('.t-row-action-move-down')
  },

  async clickOnMoveLeftColumn(columnIndex) {
    let context = `thead tr:first-child td:nth-child(${columnIndex + 1}), thead tr:first-child th:nth-child(${
      columnIndex + 1
    })`
    hoverTrigger(context, { span: 0 })

    await click('.t-column-action-move-left')
  },

  async clickOnMoveRightColumn(columnIndex) {
    let context = `thead tr:first-child td:nth-child(${columnIndex + 1}), thead tr:first-child th:nth-child(${
      columnIndex + 1
    })`

    hoverTrigger(context, { span: 0 })

    await click('.t-column-action-move-right')
  },

  async clickOnMoveUpRow(row) {
    let context = `tr:nth-child(${row}) td:last-child, tr:nth-child(${row}) th:last-child`
    hoverTrigger(context, { i: 0 })

    await click('.t-row-action-move-up')
  },

  async clickOnPlus(row, column) {
    await focus(`tr:nth-of-type(${row + 1}) th:nth-of-type(${column + 1})`)
    await click(`tr:nth-of-type(${row + 1}) th:nth-of-type(${column + 1}) .icon-plus`)
  },

  async clickOnRemoveColumn(columnIndex) {
    let context = `thead tr:first-child td:nth-child(${columnIndex + 1}), thead tr:first-child th:nth-child(${
      columnIndex + 1
    })`

    hoverTrigger(context, { span: 0 })

    await click('.t-column-action-remove')
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
    return document.querySelector('th.selected, td.selected')
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
