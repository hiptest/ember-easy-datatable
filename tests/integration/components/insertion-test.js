import DatatableFactory from 'ember-easy-datatable/utils/datatable-factory'
import hbs from 'htmlbars-inline-precompile'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import customHelpers from '../../helpers/_custom-helpers'

module('Integration | Component | Insertion', function (hooks) {
  setupRenderingTest(hooks)

  hooks.beforeEach(function () {
    this.set(
      'table',
      DatatableFactory.makeDatatable({
        headers: ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
        body: [
          [{ isHeader: true, value: '#0' }, 'Row 0', 0, 10, 20],
          [{ isHeader: true, value: '#1' }, 'Row 1', 1, 11, 21],
          [{ isHeader: true, value: '#2' }, 'Row 2', 2, 12, 22],
          [{ isHeader: true, value: '#3' }, 'Row 3', 3, 13, 23],
        ],

        makeDefaultRow: function () {
          var row = DatatableFactory.makeListOf(this.headers.cells.length)
          row[0] = {
            isHeader: true,
            isEditable: false,
          }
          return row
        },
      })
    )
  })

  test('Inserting a new row', async function (assert) {
    assert.expect(5)

    await render(hbs`{{easy-datatable table=table}}`)

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])
    await customHelpers.clickOnDatatableCell(1, 1)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'Nothing happens if it is not done in a row header'
    )
    await customHelpers.pressLeftKeyInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['', '', '', ''],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'Otherwise, a new empty row is added after the selected row'
    )
    assert.deepEqual(
      customHelpers.getSelectedPosition(),
      { row: 2, column: 0 },
      'The header of the new row is selected'
    )
    await customHelpers.clickOnDatatableCell(5, 0)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getSelectedPosition(),
      { row: 6, column: 0 },
      'Inserting the last row with a keyboard shortcut brings to the correct cell'
    )
  })

  test('Inserting a new row can be prevented by setting "canInsertRows" at the table level', async function (assert) {
    var self = this
    assert.expect(2)

    await render(hbs`{{easy-datatable table=table}}`)
    self.get('table').set('canInsertRows', false)

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])
    await customHelpers.clickOnDatatableCell(1, 0)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'There is no row added'
    )
  })

  test('It is also possible to avoid new rows at given indices', async function (assert) {
    var self = this
    assert.expect(3)

    await render(hbs`{{easy-datatable table=table}}`)
    self.get('table.body')[2].set('cells.firstObject.canInsertRowAfter', false)

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])
    await customHelpers.clickOnDatatableCell(3, 0)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'There is no row added'
    )
    await customHelpers.pressUpKeyInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['', '', '', ''],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'But rows can still be inserted at other places'
    )
  })

  test('Inserting a new column', async function (assert) {
    assert.expect(6)

    await render(hbs`{{easy-datatable table=table}}`)
    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])
    await customHelpers.clickOnDatatableCell(1, 1)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'Nothing happens if it is not done in a column header'
    )
    await customHelpers.pressUpKeyInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '', '0', '10', '20'],
        ['Row 1', '', '1', '11', '21'],
        ['Row 2', '', '2', '12', '22'],
        ['Row 3', '', '3', '13', '23'],
      ],
      'Otherwise, a new empty column is added after the selected column'
    )
    assert.deepEqual(
      customHelpers.getDatatableHeaders(),
      ['', 'Name', '', 'Value 1', 'Value 2', 'Value 3'],
      'An empty header is also added'
    )
    assert.deepEqual(
      customHelpers.getSelectedPosition(),
      { row: 0, column: 2 },
      'The correct header cell is selected after insertion'
    )
    await customHelpers.clickOnDatatableCell(0, 5)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getSelectedPosition(),
      { row: 0, column: 6 },
      'After inserting the last column, the correct cell is selected)'
    )
  })

  test('Inserting a new column can be prevented by setting "canInsertColumns" to false at table level', async function (assert) {
    var self = this
    assert.expect(3)

    await render(hbs`{{easy-datatable table=table}}`)

    self.get('table').set('canInsertColumns', false)

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])
    await customHelpers.clickOnDatatableCell(0, 1)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'No column as been added'
    )
    assert.deepEqual(
      customHelpers.getDatatableHeaders(),
      ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
      'headers have not changed'
    )
  })

  test('It can also be prevented for specific columns', async function (assert) {
    var self = this
    assert.expect(4)

    await render(hbs`{{easy-datatable table=table}}`)

    self.get('table').get('headers.cells')[2].set('canInsertColumnAfter', false)

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])
    await customHelpers.clickOnDatatableCell(0, 2)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'No column as been added'
    )
    assert.deepEqual(
      customHelpers.getDatatableHeaders(),
      ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
      'headers have not changed'
    )
    await customHelpers.pressRightKeyInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '', '20'],
        ['Row 1', '1', '11', '', '21'],
        ['Row 2', '2', '12', '', '22'],
        ['Row 3', '3', '13', '', '23'],
      ],
      'Columns can still be added in after other columns'
    )
  })

  //TODO test('If option "editAfterInsertion" is set to true, the editor is shown after inserting a new row', function () {
  //TODO test('If option "editAfterInsertion" is set to true, the editor is shown after inserting a new column', function () {
})
