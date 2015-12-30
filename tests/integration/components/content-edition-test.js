import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import helper from '../../helpers/helper';
import hbs from 'htmlbars-inline-precompile';
import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('easy-datatable', 'Integration | Component | content edition', {
  integration: true
});

test('click and edit', function(assert) {
  assert.expect(4);

  this.set('table', DatatableFactory.makeDatatable({
    headers: ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
    body: [
      [{isHeader: true, value: '#0'}, 'Row 0', 0, 10, 20],
      [{isHeader: true, value: '#1'}, 'Row 1', 1, 11, 21],
      [{isHeader: true, value: '#2'}, 'Row 2', 2, 12, 22],
      [{isHeader: true, value: '#3'}, 'Row 3', 3, 13, 23]
    ]    
  }));

  this.render(hbs`{{easy-datatable table=table}}`);

  helper.assertDatatableContent(assert, this.$(), [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  helper.clickOnDatatableCell(this.$(), 1, 1);
  helper.assertEditorShown(assert, this.$());
  helper.typeInDatatable(this.$(), 'This is my row');
  helper.pressEnterInDatatable();
  helper.clickOnDatatableCell(this.$(), 0, 0);
  helper.assertEditorShown(assert, this.$());
  helper.assertDatatableContent(assert, this.$(), [
    ['This is my row', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);

});