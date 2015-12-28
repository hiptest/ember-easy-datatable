import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import assertDatatableContent from '../../helpers/helper';
import hbs from 'htmlbars-inline-precompile';
import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('easy-datatable', 'Integration | Component | easy datatable', {
  integration: true
});

test('Basic test', function(assert) {
  assert.expect(1);

  this.set('table', DatatableFactory.makeDatatable({
    headers: ['Col 1', 'Col 2'],
    body: [
      ['Row 11', 'Row 12'],
      ['Row 21', 'Row 22'],
      ['Row 31', 'Row 32'],
      ['Row 41', 'Row 42']
    ]}));

  this.render(hbs`{{easy-datatable table=table}}`);

  assertDatatableContent(assert,this.$(), [
    ['Row 11', 'Row 12'],
    ['Row 21', 'Row 22'],
    ['Row 31', 'Row 32'],
    ['Row 41', 'Row 42']
  ]);
});