import DatatableFactory from 'ember-easy-datatable/utils/datatable-factory'
import hbs from 'htmlbars-inline-precompile'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import customHelpers from '../../helpers/_custom-helpers'

module('Integration | Component | Table ordering', function (hooks) {
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
      })
    )
  })

  test('Column order can be changed using ctrl + left/right arrow', async function (assert) {
    assert.expect(8)

    await render(hbs`{{easy-datatable table=table}}`)

    assert.deepEqual(
      customHelpers.getDatatableHeaders(),
      ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
      'Headers are correct'
    )

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])

    await customHelpers.clickOnDatatableValueCell(1, 1)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlRightKeyInDatatable()

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'If a cell is selected (not a <th> in the header), nothing happens when doing ctrl + right'
    )

    await customHelpers.pressUpKeyInDatatable()
    await customHelpers.pressCtrlRightKeyInDatatable()

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['0', 'Row 0', '10', '20'],
        ['1', 'Row 1', '11', '21'],
        ['2', 'Row 2', '12', '22'],
        ['3', 'Row 3', '13', '23'],
      ],
      'Otherwise, the selected is moved to the right'
    )

    assert.deepEqual(
      customHelpers.getDatatableHeaders(),
      ['', 'Value 1', 'Name', 'Value 2', 'Value 3'],
      'And so is the header'
    )

    assert.deepEqual(
      customHelpers.getHighlightedCellsText(),
      ['Name', 'Row 0', 'Row 1', 'Row 2', 'Row 3'],
      'The moved column is stilln highlighted'
    )

    await customHelpers.pressCtrlLeftKeyInDatatable()

    assert.deepEqual(
      customHelpers.getDatatableHeaders(),
      ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
      'Ctrl+left moves the row back'
    )

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'And the header too, of course'
    )
  })

  test('Column headers can be marked as non-movable', async function (assert) {
    assert.expect(10)

    await render(hbs`{{easy-datatable table=table}}`)
    this.table.get('headers.cells')[2].set('isMovable', false)

    assert.deepEqual(customHelpers.getDatatableHeaders(), ['', 'Name', 'Value 1', 'Value 2', 'Value 3'])

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])

    await customHelpers.clickOnDatatableColumnCell(3)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlRightKeyInDatatable()

    assert.deepEqual(customHelpers.getDatatableHeaders(), ['', 'Name', 'Value 1', 'Value 2', 'Value 3'])

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'The header is maker as non-movable, so it can not be moved right ...'
    )

    await customHelpers.pressCtrlLeftKeyInDatatable()
    assert.deepEqual(customHelpers.getDatatableHeaders(), ['', 'Name', 'Value 1', 'Value 2', 'Value 3'])

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      '... nor left'
    )

    customHelpers.pressLeftKeyInDatatable()
    customHelpers.pressCtrlRightKeyInDatatable()

    assert.deepEqual(customHelpers.getDatatableHeaders(), ['', 'Name', 'Value 1', 'Value 2', 'Value 3'])
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'Of course, trying  to switch the column on the left will not have any effect ...'
    )

    await customHelpers.pressRightKeyInDatatable()
    await customHelpers.pressRightKeyInDatatable()
    await customHelpers.pressCtrlLeftKeyInDatatable()

    assert.deepEqual(customHelpers.getDatatableHeaders(), ['', 'Name', 'Value 1', 'Value 2', 'Value 3'])
    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      '... same thing with the column on the right'
    )
  })

  test('Rows order can be changed using ctrl + up/down arrow', async function (assert) {
    assert.expect(4)

    await render(hbs`{{easy-datatable table=table}}`)
    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])

    await customHelpers.clickOnDatatableValueCell(1, 1)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlUpKeyInDatatable()

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'As for column ordering, the crlt+arrow combination only works on row headers'
    )

    await customHelpers.pressLeftKeyInDatatable()
    await customHelpers.pressCtrlDownKeyInDatatable()

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 1', '1', '11', '21'],
        ['Row 0', '0', '10', '20'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'Ctrl+down moves the row down ...'
    )

    await customHelpers.pressCtrlUpKeyInDatatable()

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      '... and ctrl+up moves the row back up'
    )
  })

  test('Rows can be marker as non-movable', async function (assert) {
    assert.expect(5)

    await render(hbs`{{easy-datatable table=table}}`)
    this.table.get('body')[1].set('cells.firstObject.isMovable', false)

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
    ])

    await customHelpers.clickOnDatatableRowCell(2, 0)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlUpKeyInDatatable()

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'The header is maker as non-movable, so it can not be moved up ...'
    )

    await customHelpers.pressCtrlDownKeyInDatatable()

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      '... nor down'
    )

    await customHelpers.pressUpKeyInDatatable()
    await customHelpers.pressCtrlDownKeyInDatatable()

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      'Of course, trying  to switch the row on top will not have any effect ...'
    )

    await customHelpers.pressDownKeyInDatatable()
    await customHelpers.pressDownKeyInDatatable()
    await customHelpers.pressCtrlUpKeyInDatatable()

    assert.deepEqual(
      customHelpers.getDatatableContent(),
      [
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23'],
      ],
      '... same thing with the row below'
    )
  })
})
