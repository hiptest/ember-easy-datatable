import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import { test, moduleForComponent } from 'ember-qunit';
import { isNone } from '@ember/utils'
import { run } from '@ember/runloop'

var App;

moduleForComponent('easy-datatable', 'Integration | Component | content edition direct validation', {
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
      ],
      validateCell: function (cell, position, value) {
        value = value.toString();
        if (position.row === -1) {
          // Should be "Value <numeric value>"
          return isNone(value.match(/^Value [0-9]+$/));
        }

        if (cell.isHeader) {
          // Should be #<numeric value>
          return isNone(value.match(/^#[0-9]+$/));
        }

        // Only numeric values are allowed in the cells
        return isNone(value.match(/^[0-9]+$/));
      }
    }));
  },
  teardown: function() {
    run(App, 'destroy');
  }
});

test('Row header', function (assert) {
  assert.expect(7);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnDatatableCell(3, 0);
  assertHightlightedCellsText(assert, ['#2', 'Row 2', '2', '12', '22']);
  assertEditorShown(assert);
  typeInDatatable('I forgot it should be #something');
  pressEnterInDatatable();
  assertEditorShown(assert,
    'The editor is still there as validation failed');
  assertCurrentCellHasError(assert);
  pressEscInDatatable();
  typeInDatatable('#123');
  pressEnterInDatatable();
  assertEditorNotShown(assert,
    'The validation worked so the editor is hidden now');
  assertCurrentCellHasNotError(assert);
  pressUpKeyInDatatable();
  assertHightlightedCellsText(assert, ['#123', 'Row 2', '2', '12', '22']);
});

test('Column header', function (assert) {
  assert.expect(7);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnDatatableCell(0, 3);
  assertHightlightedCellsText(assert, ['Value 2', '10', '11', '12', '13']);
  assertEditorShown(assert);
  typeInDatatable('I forgot it should be #something');
  pressEnterInDatatable();
  assertEditorShown(assert,
    'The editor is still there as validation failed');
  assertCurrentCellHasError(assert);
  pressEscInDatatable();
  typeInDatatable('Value 951');
  pressEnterInDatatable();
  pressUpKeyInDatatable();
  assertEditorNotShown(assert,
    'The validation worked so the editor is hidden now');
  assertCurrentCellHasNotError(assert);
  assertHightlightedCellsText(assert, ['Value 951', '10', '11', '12', '13']);
});
