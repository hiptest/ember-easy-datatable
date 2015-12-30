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

test('Highliting on header selection', function (assert) {
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
  helper.clickOnDatatableCell(this.$(), 1, 1);
  helper.pressEscInDatatable(this.$());
  helper.assertHightlightedCellsText(assert, this.$(), [],
    'When a <td> cell is focused, it does not highlight anything');
  helper.pressUpKeyInDatatable(this.$());
  helper.assertHightlightedCellsText(assert, this.$(), ['Name', 'Row 0', 'Row 1', 'Row 2', 'Row 3'],
    'If a cell in the <thead> is selected, then all cells in the column are highlited');
  helper.pressLeftKeyInDatatable(this.$());
  helper.assertHightlightedCellsText(assert, this.$(), ['', '#0', '#1', '#2', '#3'],
    'It follows keyboard navigation');
  helper.pressDownKeyInDatatable(this.$());
  helper.assertHightlightedCellsText(assert, this.$(), ['#0', 'Row 0', '0', '10', '20'],
    'If the focused cell is a <th> in the body, then the row is highlited');
  helper.pressDownKeyInDatatable(this.$());
  helper.assertHightlightedCellsText(assert, this.$(), ['#1', 'Row 1', '1', '11', '21'],
    'It still follows keyboard navigation');
  helper.clickOnDatatableCell(this.$(), 0, 3);
  helper.assertHightlightedCellsText(assert, this.$(), ['Value 2', '10', '11', '12', '13'],
    'Clicking to another <th> updates highliting');
  helper.clickOnDatatableCell(this.$(), 3, 0);
  helper.assertHightlightedCellsText(assert, this.$(), ['#2', 'Row 2', '2', '12', '22'],
    'Same thing it a <th> in the body');
  helper.clickOnDatatableCell(this.$(), 2, 3);
  helper.assertHightlightedCellsText(assert, this.$(), []);
});

test('Switching to other rows/columns when needed', function (assert) {
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
  helper.clickOnDatatableCell(this.$(), 2, 0);
  helper.pressEscInDatatable(this.$());
  helper.pressLeftKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 1, 4,
    'Navigating left in the first column brings to the end of the previous row');
  helper.pressRightKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 2, 0,
    'Navigating right at the end of a column brings to the beginning on the next row');
  helper.pressDownKeyInDatatable(this.$());
  helper.pressDownKeyInDatatable(this.$());
  helper.pressDownKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 0, 1,
    'Navigating down at the bottom of the table brings to the start of the next column');
  helper.pressUpKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), 4, 0,
    'Navigating up at the beginning of a column bring at the bottom of the previous one');
  helper.clickOnDatatableCell(this.$(), 4, 4);
  helper.pressEscInDatatable(this.$());
  helper.pressRightKeyInDatatable(this.$());
  helper.assertSelectedDatatableCell(assert, this.$(), -1, -1,
    'Navigating right at the bottom-right of the table empties the selection');
});