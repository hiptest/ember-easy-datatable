import DatatableFactory from 'ember-easy-datatable/utils/datatable-factory'
import hbs from 'htmlbars-inline-precompile'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, click } from '@ember/test-helpers'
import customHelpers from '../../helpers/_custom-helpers'

module('Integration | Component | Edit after insertion', function (hooks) {
  setupRenderingTest(hooks)

  hooks.beforeEach(function () {
    this.set(
      'table',
      DatatableFactory.makeDatatable({
        headers: [
          { value: 'H1', showAddFirstColumn: true, isEditable: false },
          'H2',
          'H3',
          { value: 'H4', showAddLastColumn: true, isEditable: false },
        ],
        body: [
          [
            { isEditable: false, value: '11', isHeader: true },
            { isEditable: false, value: '12' },
            { isEditable: false, value: '13' },
            { isEditable: false, value: '14' },
          ],
          [
            { isEditable: false, value: '21', isHeader: true },
            { isEditable: false, value: '22' },
            { isEditable: false, value: '23' },
            { isEditable: false, value: '24' },
          ],
          [
            { isEditable: false, value: '31', isHeader: true },
            { isEditable: false, value: '32' },
            { isEditable: false, value: '33' },
            { isEditable: false, value: '34' },
          ],
          [
            { isEditable: false, value: '41', isHeader: true },
            { isEditable: false, value: '42' },
            { isEditable: false, value: '43' },
            { isEditable: false, value: '44' },
          ],
        ],

        makeDefaultRow: function () {
          return this.headers.cells.map(function (item, index) {
            return {
              value: index,
              isEditable: index > 2,
            }
          })
        },

        makeDefaultColumn: function () {
          var column = [
            {
              isHeader: true,
              isEditable: false,
              value: 'H+',
            },
          ]

          this.body.forEach(function (item, index) {
            column.push({
              value: index,
              isEditable: index > 2,
            })
          })
          return column
        },
      })
    )
  })

  test('If option "editAfterInsertion" is set to true, the editor is shown after inserting a new row', async function (assert) {
    assert.expect(6)
    await render(
      hbs`{{easy-datatable table=table editAfterInsertion=true showAddFirstRow=true showAddLastRow=true addNewRowLabel='Add new row'}}`
    )

    await customHelpers.clickOnDatatableCell(2, 0)
    await customHelpers.pressCtrlInserKeyInDatatable()
    assert.deepEqual(
      customHelpers.getSelectedPosition(),
      { row: 3, column: 3 },
      'The first editable cell is selected (not the header) ...'
    )

    assert.ok(this.$('input').length === 1, '... and the editor is shown')

    await click('.t-add-new-row')
    assert.deepEqual(
      customHelpers.getSelectedPosition(),
      { row: 7, column: 3 },
      'The first editable cell is selected (not the header) ...'
    )
    assert.ok(this.$('input').length === 1)
    await click('.t-add-new-row')
    assert.deepEqual(customHelpers.getSelectedPosition(), { row: 8, column: 3 }, '... or the first row')

    assert.ok(this.$('input').length === 1)
  })

  test('If option "editAfterInsertion" is set to true, the editor is shown after inserting a new column', async function (assert) {
    assert.expect(6)

    await render(hbs`{{easy-datatable table=table editAfterInsertion=true}}`)

    await customHelpers.clickOnDatatableCell(0, 2)
    await customHelpers.pressEscInDatatable()
    await customHelpers.pressCtrlInserKeyInDatatable()

    assert.deepEqual(
      customHelpers.getSelectedPosition(),
      { row: 4, column: 3 },
      'The same principle applies when inserting columns'
    )
    assert.ok(this.$('input').length === 1, '... and the editor is shown')

    await click('.add-first-column')
    assert.deepEqual(
      customHelpers.getSelectedPosition(),
      { row: 4, column: 0 },
      'It also works when inserting the first column ...'
    )

    assert.ok(this.$('input').length === 1)
    await click('.add-last-column')
    assert.deepEqual(customHelpers.getSelectedPosition(), { row: 4, column: 6 }, '... or the last one')

    assert.ok(this.$('input').length === 1)
  })
})
