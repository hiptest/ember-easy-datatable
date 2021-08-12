import DatatableFactory from 'ember-easy-datatable/utils/datatable-factory'
import hbs from 'htmlbars-inline-precompile'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import '@ember/test-helpers'
import { run } from '@ember/runloop'
import { Promise } from 'rsvp'
import customHelpers from '../../helpers/_custom-helpers'
import { render, click } from '@ember/test-helpers'

module('Integration | Component | Action buttons', function (hooks) {
  setupRenderingTest(hooks)

  hooks.beforeEach(function () {
    this.set(
      'table',
      DatatableFactory.makeDatatable({
        headers: [
          { isEditable: false, value: '', showAddFirstColumn: true },
          'Name',
          { value: 'Value 1', showActions: true },
          { value: 'Value 2', showActions: true },
          { value: 'Value 3', showActions: true },
          { isEditable: false, value: '', showAddLastColumn: true, canInsertColumnAfter: false },
        ],
        body: [
          [
            { isHeader: true, value: '#0' },
            'Row 0',
            0,
            10,
            20,
            { isHeader: true, showActions: true, isEditable: false },
          ],
          [
            { isHeader: true, value: '#1' },
            'Row 1',
            1,
            11,
            21,
            { isHeader: true, showActions: true, isEditable: false },
          ],
          [
            { isHeader: true, value: '#2' },
            'Row 2',
            2,
            12,
            22,
            { isHeader: true, showActions: true, isEditable: false },
          ],
          [
            { isHeader: true, value: '#3' },
            'Row 3',
            3,
            13,
            23,
            { isHeader: true, showActions: true, isEditable: false },
          ],
        ],

        makeDefaultRow: function () {
          var row = DatatableFactory.makeListOf(this.headers.cells.length)
          row[0] = {
            isHeader: true,
            isEditable: false,
          }
          row[5] = {
            isHeader: true,
            isEditable: false,
          }
          return row
        },
      })
    )
  })

  test('Click on remove to remove a row', async function (assert) {
    assert.expect(1)

    await render(hbs`{{easy-datatable table=table}}`)

    await customHelpers.clickOnRemoveRow(2)

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'The row is removed'
    )
  })

  test('Click to move up a row', async function (assert) {
    assert.expect(1)

    await render(hbs`{{easy-datatable table=table}}`)
    await customHelpers.clickOnMoveUpRow(2)

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 1', '1', '11', '21'],
        ['Row 0', '0', '10', '20'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'The row has moved up'
    )
  })

  test('Click to move down a row', async function (assert) {
    assert.expect(1)

    await render(hbs`{{easy-datatable table=table}}`)

    await customHelpers.clickOnMoveDownRow(2)

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 2', '2', '12', '22'],
        ['Row 1', '1', '11', '21'],
        ['Row 3', '3', '13', '23'],
      ],
      'The row has moved down'
    )
  })

  test('Click to remove a column', async function (assert) {
    assert.expect(1)

    await render(hbs`{{easy-datatable table=table}}`)
    await customHelpers.clickOnRemoveColumn(2)

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '10', '20'],
        ['Row 1', '11', '21'],
        ['Row 2', '12', '22'],
        ['Row 3', '13', '23'],
      ],
      'The row has moved down'
    )
  })

  test('Click to move right a column', async function (assert) {
    assert.expect(1)

    await render(hbs`{{easy-datatable table=table}}`)
    await customHelpers.clickOnMoveRightColumn(2)

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '10', '0', '20'],
        ['Row 1', '11', '1', '21'],
        ['Row 2', '12', '2', '22'],
        ['Row 3', '13', '3', '23'],
      ],
      'The column has moved right'
    )
  })

  test('Click to move left a column', async function (assert) {
    assert.expect(1)

    await render(hbs`{{easy-datatable table=table}}`)
    await customHelpers.clickOnMoveLeftColumn(4)

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '20', '10'],
        ['Row 1', '1', '21', '11'],
        ['Row 2', '2', '22', '12'],
        ['Row 3', '3', '23', '13'],
      ],
      'The column has moved left'
    )
  })

  test('Click to add a new last column', async function (assert) {
    const table = this.table
    assert.expect(3)

    await render(hbs`{{easy-datatable table=table}}`)
    await customHelpers.clickOnPlus(0, 5)
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20', ''],
        ['Row 1', '1', '11', '21', ''],
        ['Row 2', '2', '12', '22', ''],
        ['Row 3', '3', '13', '23', ''],
      ],
      'A new column is added at the end of the datatable'
    )

    assert.deepEqual(customHelpers.getSelectedPosition(), { row: 0, column: 5 }, 'The correct cell is selected')

    table.get('headers.cells').forEach(function (cell, index) {
      cell.set('canInsertColumnAfter', index < 3)
    })

    await customHelpers.clickOnPlus(0, 6)

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '', '10', '20', ''],
        ['Row 1', '1', '', '11', '21', ''],
        ['Row 2', '2', '', '12', '22', ''],
        ['Row 3', '3', '', '13', '23', ''],
      ],
      'It will search for the last place where a column is insertable if needed'
    )
  })

  test('Click to add first column', async function (assert) {
    assert.expect(2)

    await render(hbs`{{easy-datatable table=table}}`)
    await customHelpers.clickOnPlus(0, 0)

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['', 'Row 0', '0', '10', '20'],
        ['', 'Row 1', '1', '11', '21'],
        ['', 'Row 2', '2', '12', '22'],
        ['', 'Row 3', '3', '13', '23'],
      ],
      'A new column is added at the beginning of the datatable'
    )

    assert.deepEqual(
      customHelpers.getSelectedPosition(),
      { row: 0, column: 0 },
      'The header cell of the newly added column is selected'
    )
  })

  test('Validate to true a cell asynchronously and remove the row before validation ends', async function (assert) {
    assert.expect(2)

    this.table.reopen({
      validateCell: function (cell, position, value) {
        return new Promise(function (resolve) {
          run.later(function () {
            resolve(value)
          }, 0)
        })
      },
    })

    await render(hbs`{{easy-datatable table=table}}`)

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])

    await customHelpers.clickOnDatatableValueCell(1, 3)
    await customHelpers.typeInDatatable('12345')

    await customHelpers.clickOnRemoveRow(1) // will focusOut, trigger the validation, but cell deleted

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'The row has been deleted and the validation has not produced any "calling set on destroyed object" error'
    )
  })

  test('Validate to false a cell asynchronously and remove the row before validation ends', async function (assert) {
    assert.expect(2)

    this.table.reopen({
      validateCell: function () {
        return new Promise(function (resolve, reject) {
          run.later(function () {
            reject('this value is invalid')
          }, 0)
        })
      },
    })

    await render(hbs`{{easy-datatable table=table}}`)

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])

    await customHelpers.clickOnDatatableValueCell(1, 3)
    await customHelpers.typeInDatatable('12345')

    await customHelpers.clickOnRemoveRow(1)

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'The row has been deleted and the validation has not produced any "calling set on destroyed object" error'
    )
  })

  test('Add last row', async function (assert) {
    let table = this.table
    assert.expect(3)

    await render(hbs`{{easy-datatable table=table showAddLastRow=true addNewRowLabel='Add new row'}}`)
    await click('.t-add-new-row')

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
        ['', '', '', ''],
      ],
      'A new row is added at the end of the datatable'
    )

    assert.deepEqual(
      customHelpers.getSelectedPosition(),
      { row: 5, column: 0 },
      'The first cell of the newly added row is selected'
    )

    table.get('body').forEach(function (row, index) {
      row.set('cells.firstObject.canInsertRowAfter', index <= 1)
    })

    await click('.t-add-new-row')

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['', '', '', ''],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
        ['', '', '', ''],
      ],
      'It will search for the last place where a row is insertable if needed'
    )
  })

  test('Add first row', async function (assert) {
    assert.expect(2)

    await render(hbs`{{easy-datatable table=table showAddFirstRow=true addNewRowLabel='Add new row'}}`)

    await click('.add-first-row')

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['', '', '', ''],
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'A new row is added at the beginning of the datatable'
    )

    assert.deepEqual(
      customHelpers.getSelectedPosition(),
      { row: 2, column: 0 },
      'The first cell of the newly added row is selected'
    )
  })
})
