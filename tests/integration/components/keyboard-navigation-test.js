import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import { test, moduleForComponent } from 'ember-qunit';
import customHelpers from '../../helpers/_custom-helpers'



moduleForComponent('easy-datatable', 'Integration | Component | keyboard navigation', {
  integration: true,
  setup: function() {

    this.set('table', DatatableFactory.makeDatatable({
    headers: ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
    body: [
      [{isHeader: true, value: '#0'}, 'Row 0', 0, 10, 20],
      [{isHeader: true, value: '#1'}, 'Row 1', 1, 11, 21],
      [{isHeader: true, value: '#2'}, 'Row 2', 2, 12, 22],
      [{isHeader: true, value: '#3'}, 'Row 3', 3, 13, 23]
    ]
  }));
  },
});

test('Keyboard navigation', function(assert) {
  this.render(hbs`{{easy-datatable table=table}}`);

  assert.equal(customHelpers.getSelectedCell().length, 0,'No cell is currently selected');
  customHelpers.clickOnDatatableCell(1, 1);
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 1});
  customHelpers.pressRightKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 1},
  'If the input is present, keyboard navigation does not have any effect');
  customHelpers.pressUpKeyInDatatable();
  customHelpers.pressDownKeyInDatatable();
  customHelpers.pressLeftKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 1});
  customHelpers.pressEscInDatatable();
  customHelpers.pressRightKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 2},
    'Pressing ESC removes the input, so we can navigate with the keyboard');
  customHelpers.pressDownKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 2, column: 2});
  customHelpers.pressLeftKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 2, column: 1});
  customHelpers.pressUpKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 1});
  customHelpers.pressUpKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 0, column: 1},
  'It is also possible to navigate to the header');
  customHelpers.pressRightKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 0, column: 2});
  customHelpers.pressLeftKeyInDatatable();
  customHelpers.pressLeftKeyInDatatable();
  customHelpers.pressDownKeyInDatatable();
  customHelpers.pressDownKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 2, column: 0},
  'Navigation can also be done to the body <th> cells');
});

test('Highliting on header selection', function (assert) {
  this.render(hbs`{{easy-datatable table=table}}`);

  customHelpers.clickOnDatatableCell(1, 1);
  customHelpers.pressEscInDatatable();
  assert.deepEqual(customHelpers.getHighlightedCellsText(), [],
  'When a <td> cell is focused, it does not highlight anything');
  customHelpers.pressUpKeyInDatatable();
  assert.deepEqual(customHelpers.getHighlightedCellsText(), ['Name', 'Row 0', 'Row 1', 'Row 2', 'Row 3'],
  'If a cell in the <thead> is selected, then all cells in the column are highlited');
  customHelpers.pressLeftKeyInDatatable();
  assert.deepEqual(customHelpers.getHighlightedCellsText(), ['', '#0', '#1', '#2', '#3'],
  'It follows keyboard navigation');
  customHelpers.pressDownKeyInDatatable();
  assert.deepEqual(customHelpers.getHighlightedCellsText(), ['#0', 'Row 0', '0', '10', '20'],
  'If the focused cell is a <th> in the body, then the row is highlited');
  customHelpers.pressDownKeyInDatatable();
  assert.deepEqual(customHelpers.getHighlightedCellsText(), ['#1', 'Row 1', '1', '11', '21'],
  'It still follows keyboard navigation');
  customHelpers.clickOnDatatableCell(0, 3);
  assert.deepEqual(customHelpers.getHighlightedCellsText(), ['Value 2', '10', '11', '12', '13'],
  'Clicking to another <th> updates highliting');
  customHelpers.clickOnDatatableCell(3, 0);
  assert.deepEqual(customHelpers.getHighlightedCellsText(), ['#2', 'Row 2', '2', '12', '22'],
  'Same thing it a <th> in the body');
  customHelpers.clickOnDatatableCell(2, 3);
  assert.deepEqual(customHelpers.getHighlightedCellsText(), []);
});

test('Switching to other rows/columns when needed', function (assert) {
  this.render(hbs`{{easy-datatable table=table}}`);

  customHelpers.clickOnDatatableCell(2, 0);
  customHelpers.pressEscInDatatable();
  customHelpers.pressLeftKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 4},
  'Navigating left in the first column brings to the end of the previous row');
  customHelpers.pressRightKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 2, column: 0},
  'Navigating right at the end of a column brings to the beginning on the next row');
  customHelpers.pressDownKeyInDatatable();
  customHelpers.pressDownKeyInDatatable();
  customHelpers.pressDownKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 4, column: 0},
  'Navigating down at the bottom of the table do not move the selection');
  customHelpers.pressRightKeyInDatatable();
  customHelpers.pressUpKeyInDatatable();
  customHelpers.pressUpKeyInDatatable();
  customHelpers.pressUpKeyInDatatable();
  customHelpers.pressUpKeyInDatatable();
  customHelpers.pressUpKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 0, column: 1},
  'Navigating up at the beginning of a column do not move the selection');
  customHelpers.clickOnDatatableCell(4, 4);
  customHelpers.pressEscInDatatable();
  customHelpers.pressRightKeyInDatatable();
  assert.deepEqual(customHelpers.getSelectedPosition(), {row: -1, column: -1},
  'Navigating right at the bottom-right of the table empties the selection');
});
