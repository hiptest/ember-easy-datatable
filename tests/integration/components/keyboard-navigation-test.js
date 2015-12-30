import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import helper from '../../helpers/helper';
import hbs from 'htmlbars-inline-precompile';
import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('easy-datatable', 'Integration | Component | keyboard navigation', {
  integration: true
});

test('Keyboard navigation', function(assert) {
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

  helper.assertNoSelectedDatatableCell(assert, this.$(), 'No cell is selected by default');
  helper.clickOnDatatableCell(this.$(), 1, 1);
  helper.assertSelectedDatatableCell(assert, this.$(), 1, 1);
  helper.pressRightKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 1, 1,
      'If the input is present, keyboard navigation does not have any effect');
  helper.pressUpKeyInDatatable(this.$());
  helper.pressDownKeyInDatatable(this.$());
  helper.pressLeftKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 1, 1);
  helper.pressEscInDatatable(this.$());
  helper.pressRightKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 1, 2,
   'Pressing ESC removes the input, so we can navigate with the keyboard');
  helper.pressDownKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 2, 2);
  helper.pressLeftKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 2, 1);
  helper.pressUpKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 1, 1);
  helper.pressUpKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 0, 1,
      'It is also possible to navigate to the header');
  helper.pressRightKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 0, 2);
  helper.pressLeftKeyInDatatable(this.$());
  helper.pressLeftKeyInDatatable(this.$());
  helper.pressDownKeyInDatatable(this.$());
  helper.pressDownKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 2, 0,
      'Navigation can also be done to the body <th> cells');
});