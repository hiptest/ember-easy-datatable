import DatatableFactory from 'ember-easy-datatable/utils/datatable-factory'
import hbs from 'htmlbars-inline-precompile'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import customHelpers from '../../helpers/_custom-helpers'

module('Integration | Component | index cell', function (hooks) {
  setupRenderingTest(hooks)

  hooks.beforeEach(function () {
    this.set(
      'table',
      DatatableFactory.makeDatatable({
        headers: ['', 'Index', 'Original name'],
        body: [
          [{ isHeader: true, isEditable: false }, { isIndex: true }, 'Row 1'],
          [{ isHeader: true, isEditable: false }, { isIndex: true }, 'Row 2'],
          [{ isHeader: true, isEditable: false }, { isIndex: true }, 'Row 3'],
          [{ isHeader: true, isEditable: false }, { isIndex: true }, 'Row 4'],
        ],
        makeDefaultRow: function () {
          var row = DatatableFactory.makeListOf(this.headers.cells.length)
          row[0] = {
            isHeader: true,
            isEditable: false,
          }
          row[1] = {
            isIndex: true,
          }
          return row
        },
      })
    )
  })

  test('When isIndex is set to true, the cell displays the row + 1', async function (assert) {
    assert.expect(1)

    await render(hbs`{{easy-datatable table=table}}`)

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['1', 'Row 1'],
      ['2', 'Row 2'],
      ['3', 'Row 3'],
      ['4', 'Row 4'],
    ])
  })

  test('Is keeps showing the correct value after insertion, removing or reordering', async function (assert) {
    assert.expect(4)

    await render(hbs`{{easy-datatable table=table}}`)
    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['1', 'Row 1'],
      ['2', 'Row 2'],
      ['3', 'Row 3'],
      ['4', 'Row 4'],
    ])

    await customHelpers.clickOnDatatableRowCell(1)
    await customHelpers.pressCtrlInserKeyInDatatable()

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['1', 'Row 1'],
      ['2', ''],
      ['3', 'Row 2'],
      ['4', 'Row 3'],
      ['5', 'Row 4'],
    ])

    await customHelpers.pressCtrlDelKeyInDatatable()
    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['1', 'Row 1'],
      ['2', 'Row 2'],
      ['3', 'Row 3'],
      ['4', 'Row 4'],
    ])
    await customHelpers.pressCtrlDownKeyInDatatable()
    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['1', 'Row 1'],
      ['2', 'Row 3'],
      ['3', 'Row 2'],
      ['4', 'Row 4'],
    ])
  })
})
