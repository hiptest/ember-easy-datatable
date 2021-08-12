import DatatableFactory from 'ember-easy-datatable/utils/datatable-factory'
import hbs from 'htmlbars-inline-precompile'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import { isPresent } from '@ember/utils'
import customHelpers from '../../helpers/_custom-helpers'

module('Integration | Component | content edition direct validation', function (hooks) {
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

        validateCell: function (cell, position, value) {
          value = value.toString()
          if (position.row === -1) {
            // Should be "Value <numeric value>"
            return isPresent(value.match(/^Value [0-9]+$/))
          }

          if (cell.isHeader) {
            // Should be #<numeric value>
            return isPresent(value.match(/^#[0-9]+$/))
          }

          // Only numeric values are allowed in the cells
          return isPresent(value.match(/^[0-9]+$/))
        },
      })
    )
  })

  test('Row header', async function (assert) {
    assert.expect(7)

    await render(hbs`{{easy-datatable table=table}}`)

    await customHelpers.clickOnDatatableRowCell(3)

    let highlightedCells = customHelpers.getHightlightedCellsText()
    assert.deepEqual(highlightedCells, ['#2', 'Row 2', '2', '12', '22'], 'the correct cells are highlighted')

    assert.dom('input').exists({count: 1}, 'The cell editor is shown')

    await customHelpers.typeInDatatable('I forgot it should be #something')
    await customHelpers.pressEnterInDatatable()

    assert.dom('input').exists({count: 1}, 'The editor is still there as validation failed')
    assert.dom(customHelpers.getSelectedCell()).hasClass('error', 'Current cell is in error')

    await customHelpers.pressEscInDatatable()
    await customHelpers.typeInDatatable('#123')
    await customHelpers.pressEnterInDatatable()

    assert.dom('input').doesNotExist('The validation worked so the editor is hidden now')
    assert.dom(customHelpers.getSelectedCell()).doesNotHaveClass('error', 'Current cell is not in error')

    await customHelpers.pressUpKeyInDatatable()

    highlightedCells = customHelpers.getHightlightedCellsText()
    assert.deepEqual(highlightedCells, ['#123', 'Row 2', '2', '12', '22'], 'the correct cells are highlighted')
  })

  test('Column header', async function (assert) {
    assert.expect(7)

    await render(hbs`{{easy-datatable table=table}}`)
    await customHelpers.clickOnDatatableColumnCell(4)

    let highlightedCells = customHelpers.getHightlightedCellsText()
    assert.deepEqual(highlightedCells, ['Value 2', '10', '11', '12', '13'], 'the correct cells are highlighted')

    assert.dom('input').exists({count: 1}, 'The cell editor is shown')

    await customHelpers.typeInDatatable('I forgot it should be #something')
    await customHelpers.pressEnterInDatatable()

    assert.dom('input').exists({count: 1}, 'The editor is still there as validation failed')
    assert.dom(customHelpers.getSelectedCell()).hasClass('error', 'Current cell is in error')

    await customHelpers.pressEscInDatatable()
    await customHelpers.typeInDatatable('Value 951')

    await customHelpers.pressEnterInDatatable()
    await customHelpers.pressUpKeyInDatatable()

    assert.dom('input').doesNotExist('The validation worked so the editor is hidden now')
    assert.dom(customHelpers.getSelectedCell()).doesNotHaveClass('error', 'Current cell is not in error')

    highlightedCells = customHelpers.getHightlightedCellsText()
    assert.deepEqual(highlightedCells, ['Value 951', '10', '11', '12', '13'], 'the correct cells are highlighted')
  })
})
