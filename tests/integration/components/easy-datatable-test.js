import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import customHelpers from '../../helpers/_custom-helpers'
import $ from 'jquery'

moduleForComponent('easy-datatable', 'Integration | Component | easy datatable', {
  integration: true,
  setup() {
    this.set('table', DatatableFactory.makeDatatable({
    headers: ['Col 1', 'Col 2'],
    body: [
      ['Row 11', 'Row 12'],
      ['Row 21', 'Row 22'],
      ['Row 31', 'Row 32'],
      ['Row 41', 'Row 42']
    ]
  }));
  },
})

test('Basic test', async function(assert) {
  assert.expect(1);

  await this.render(hbs`{{easy-datatable table=table}}`);

  assert.deepEqual(customHelpers.getDatatableContent(),[
    ['Row 11', 'Row 12'],
    ['Row 21', 'Row 22'],
    ['Row 31', 'Row 32'],
    ['Row 41', 'Row 42']
  ])
})

test('Can add class to table tag', async function(assert) {
  assert.expect(2);

  await this.render(hbs`{{easy-datatable tableClasses='datatable table-bordered' table=table}}`)

  // by the user can add new ones
  assert.ok($('.datatable').length !== 0, 'the user can ...');
  assert.ok($('.table-bordered').length !== 0, '... add new classes for the table tage');
});
