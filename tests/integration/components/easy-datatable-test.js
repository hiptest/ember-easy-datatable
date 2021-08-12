import DatatableFactory from 'ember-easy-datatable/utils/datatable-factory'
import hbs from 'htmlbars-inline-precompile'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import customHelpers from '../../helpers/_custom-helpers'

module('Integration | Component | easy datatable', function (hooks) {
  setupRenderingTest(hooks)

  hooks.beforeEach(function () {
    this.set(
      'table',
      DatatableFactory.makeDatatable({
        headers: ['Col 1', 'Col 2'],
        body: [
          ['Row 11', 'Row 12'],
          ['Row 21', 'Row 22'],
          ['Row 31', 'Row 32'],
          ['Row 41', 'Row 42'],
        ],
      })
    )
  })

  test('Basic test', async function (assert) {
    assert.expect(1)

    await render(hbs`{{easy-datatable table=table}}`)

    assert.deepEqual(customHelpers.getDatatableContent(), [
      ['Row 11', 'Row 12'],
      ['Row 21', 'Row 22'],
      ['Row 31', 'Row 32'],
      ['Row 41', 'Row 42'],
    ])
  })

  test('Can add class to table tag', async function (assert) {
    assert.expect(2)

    await render(hbs`{{easy-datatable tableClasses='datatable table-bordered' table=table}}`)

    // by the user can add new ones
    assert.dom('.datatable').exists('the user can ...')
    assert.dom('.table-bordered').exists('... add new classes for the table tage')
  })
})
