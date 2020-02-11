import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import { test, moduleForComponent } from 'ember-qunit';
import { run } from '@ember/runloop'

var App;

moduleForComponent('easy-datatable', 'Integration | Component | keyboard navigation', {
  integration: true,
  setup: function() {
    App = startApp();
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
  teardown: function() {
    run(App, 'destroy');
  }
});

test('Keyboard navigation', function(assert) {
  this.render(hbs`{{easy-datatable table=table}}`);

  assertNoSelectedDatatableCell(assert, 'No cell is selected by default');
  clickOnDatatableCell(1, 1);
  assertSelectedDatatableCell(assert, 1, 1);
  pressRightKeyInDatatable();
  assertSelectedDatatableCell(assert, 1, 1,
    'If the input is present, keyboard navigation does not have any effect');
  pressUpKeyInDatatable();
  pressDownKeyInDatatable();
  pressLeftKeyInDatatable();
  assertSelectedDatatableCell(assert, 1, 1);
  pressEscInDatatable();
  pressRightKeyInDatatable();
  assertSelectedDatatableCell(assert, 1, 2,
    'Pressing ESC removes the input, so we can navigate with the keyboard');
  pressDownKeyInDatatable();
  assertSelectedDatatableCell(assert, 2, 2);
  pressLeftKeyInDatatable();
  assertSelectedDatatableCell(assert, 2, 1);
  pressUpKeyInDatatable();
  assertSelectedDatatableCell(assert, 1, 1);
  pressUpKeyInDatatable();
  assertSelectedDatatableCell(assert, 0, 1,
    'It is also possible to navigate to the header');
  pressRightKeyInDatatable();
  assertSelectedDatatableCell(assert, 0, 2);
  pressLeftKeyInDatatable();
  pressLeftKeyInDatatable();
  pressDownKeyInDatatable();
  pressDownKeyInDatatable();
  assertSelectedDatatableCell(assert, 2, 0,
    'Navigation can also be done to the body <th> cells');
});

test('Highliting on header selection', function (assert) {
  this.render(hbs`{{easy-datatable table=table}}`);

  clickOnDatatableCell(1, 1);
  pressEscInDatatable();
  assertHightlightedCellsText(assert, [],
    'When a <td> cell is focused, it does not highlight anything');
  pressUpKeyInDatatable();
  assertHightlightedCellsText(assert, ['Name', 'Row 0', 'Row 1', 'Row 2', 'Row 3'],
    'If a cell in the <thead> is selected, then all cells in the column are highlited');
  pressLeftKeyInDatatable();
  assertHightlightedCellsText(assert, ['', '#0', '#1', '#2', '#3'],
    'It follows keyboard navigation');
  pressDownKeyInDatatable();
  assertHightlightedCellsText(assert, ['#0', 'Row 0', '0', '10', '20'],
    'If the focused cell is a <th> in the body, then the row is highlited');
  pressDownKeyInDatatable();
  assertHightlightedCellsText(assert, ['#1', 'Row 1', '1', '11', '21'],
    'It still follows keyboard navigation');
  clickOnDatatableCell(0, 3);
  assertHightlightedCellsText(assert, ['Value 2', '10', '11', '12', '13'],
    'Clicking to another <th> updates highliting');
  clickOnDatatableCell(3, 0);
  assertHightlightedCellsText(assert, ['#2', 'Row 2', '2', '12', '22'],
    'Same thing it a <th> in the body');
  clickOnDatatableCell(2, 3);
  assertHightlightedCellsText(assert, []);
});

test('Switching to other rows/columns when needed', function (assert) {
  this.render(hbs`{{easy-datatable table=table}}`);

  clickOnDatatableCell(2, 0);
  pressEscInDatatable();
  pressLeftKeyInDatatable();
  assertSelectedDatatableCell(assert, 1, 4,
    'Navigating left in the first column brings to the end of the previous row');
  pressRightKeyInDatatable();
  assertSelectedDatatableCell(assert, 2, 0,
    'Navigating right at the end of a column brings to the beginning on the next row');
  pressDownKeyInDatatable();
  pressDownKeyInDatatable();
  pressDownKeyInDatatable();
  assertSelectedDatatableCell(assert, 4, 0,
    'Navigating down at the bottom of the table do not move the selection');
  pressRightKeyInDatatable();
  pressUpKeyInDatatable();
  pressUpKeyInDatatable();
  pressUpKeyInDatatable();
  pressUpKeyInDatatable();
  pressUpKeyInDatatable();
  assertSelectedDatatableCell(assert, 0, 1,
    'Navigating up at the beginning of a column do not move the selection');
  clickOnDatatableCell(4, 4);
  pressEscInDatatable();
  pressRightKeyInDatatable();
  assertSelectedDatatableCell(assert, -1, -1,
    'Navigating right at the bottom-right of the table empties the selection');
});
