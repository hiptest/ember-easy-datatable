import Ember from 'ember';
import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import { test, moduleForComponent } from 'ember-qunit';

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
          return !Ember.isNone(value.match(/^Value [0-9]+$/));
        }

        if (cell.isHeader) {
          // Should be #<numeric value>
          return !Ember.isNone(value.match(/^#[0-9]+$/));
        }

        // Only numeric values are allowed in the cells
        return !Ember.isNone(value.match(/^[0-9]+$/));
      }
    }));
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('Cell edition', function(assert) {
  assert.expect(7);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 3);
  typeInDatatable('This is not an numeric value');
  pressEnterInDatatable();
  assertEditorShown(assert,
    'The editor is still there as validation failed');
  assertCurrentCellHasError(assert);
  pressEscInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'After pressing esc, the cell value is back to the original one');
  typeInDatatable('1664');
  pressEnterInDatatable();
  assertEditorNotShown(assert,
    'The validation worked so the editor is hidden now');
  assertCurrentCellHasNotError(assert);
  assertDatatableContent(assert, [
    ['Row 0', '0', '1664', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
});

test('Cell edition, enter invalid text, focus out, should revert to original value', function (assert) {
  assert.expect(4);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 3);
  typeInDatatable('This is not an numeric value');
  pressEnterInDatatable();
  assertEditorShown(assert,
    'After entering text in cell, the editor is still there as validation failed');
  assertCurrentCellHasError(assert);
  clickOnDatatableCell(1, 2);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'After clicking another cell, the cell value is back to the original one');
});

test('Cell edition, enter invalid text, press escape, should revert to original value', function (assert) {
  assert.expect(4);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 3);
  typeInDatatable('This is not an numeric value');
  pressEnterInDatatable();
  assertEditorShown(assert,
    'After entering text in cell, the editor is still there as validation failed');
  assertCurrentCellHasError(assert);
  pressEscInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'After pressing escape, the cell value is back to the original one');
});

test('Cell edition, enter invalid text, press enter again, should still be in error', function (assert) {
  assert.expect(5);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 3);
  typeInDatatable('This is not an numeric value');
  pressEnterInDatatable();
  assertEditorShown(assert,
    'After entering text in cell, the editor is still there as validation failed');
  assertCurrentCellHasError(assert);
  pressEnterInDatatable();
  assertEditorShown(assert,
    'After pressing enter again, the editor is still there');
  assertCurrentCellHasError(assert);
});

test('Cell edition, enter invalid text, re-enter invalid text, press escape, should revert to original value', function (assert) {
  assert.expect(6);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 3);
  typeInDatatable('This is not an numeric value');
  pressEnterInDatatable();
  assertEditorShown(assert,
    'After entering text in cell, the editor is still there as validation failed');
  assertCurrentCellHasError(assert);
  typeInDatatable('nor this one');
  pressEnterInDatatable();
  assertEditorShown(assert,
    'After entering some more text in cell, the editor is still there as validation failed');
  assertCurrentCellHasError(assert);
  pressEscInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'After pressing escape, the cell value is back to the original one');
});

test('Cell edition, enter invalid text, type valid ext, click another cell, should validate new value', function (assert) {
  assert.expect(4);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 3);
  typeInDatatable('bad');
  pressEnterInDatatable();
  assertEditorShown(assert,
    'After entering text in cell, the editor is still there as validation failed');
  assertCurrentCellHasError(assert);
  clearValueInDatatable();
  typeInDatatable('1234');
  clickOnDatatableCell(1, 2);
  assertDatatableContent(assert, [
    ['Row 0', '0', '1234', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'After deleting previous text and typing valid value and clicking another cell, the datable is updated');
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