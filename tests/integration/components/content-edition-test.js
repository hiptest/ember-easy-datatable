import Ember from 'ember';
import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import { test, moduleForComponent } from 'ember-qunit';

var App;

moduleForComponent('easy-datatable', 'Integration | Component | content edition', {
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
    Ember.run(App, 'destroy');
  }
});

test('Click and edit', function(assert) {
  assert.expect(5);

  this.render(hbs`{{easy-datatable table=table}}`);

  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 1);
  assertEditorShown(assert);
  assertEditorContent(assert, "Row 0");
  typeInDatatable('This is my row');
  pressEnterInDatatable();
  clickOnDatatableCell(0, 0);
  assertEditorShown(assert);
  assertDatatableContent(assert, [
    ['This is my row', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
});

test('Cell validation is called only once when pressing Enter key', function (assert) {
  var count = 0;
  assert.expect(3);
  
  this.get('table').reopen({
    validateCell: function () {
      count += 1;
      return true;
    }
  });

  this.render(hbs`{{easy-datatable table=table}}`);

  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 1);
  typeInDatatable('This is my row');
  pressEnterInDatatable();
  assertDatatableContent(assert, [
    ['This is my row', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'After changing a cell value, the datatable is updated');
  andThen(function () {
    assert.strictEqual(count, 1, 'and validation is called only once');
  });
});

test('Cell validation is not called at all when pressing Escape key', function (assert) {
  var count = 0;
  assert.expect(3);

  this.get('table').reopen({
   countValidateCell: function () {
      count += 1;
      return true;
    }
  });

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 1);
  typeInDatatable('This is my row');
  pressEscInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'After canceling a cell edition, the datatable is back to its original values');
  andThen(function () {
    assert.strictEqual(count, 0, 'and validation is not called at all');
  });
});

test('cell validation is not called at all if not modified', function (assert) {
  var count = 0;
  assert.expect(4);

  this.get('table').reopen({
   countValidateCell: function () {
      count += 1;
      return true;
    }
  });

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 1);
  pressEnterInDatatable();
  assertEditorNotShown(assert);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'without editing, the datatable is the same!');
  andThen(function () {
    assert.strictEqual(count, 0, 'and validation is not called at all');
  });
});

test('Clicking moves the editor', function (assert) {
  assert.expect(2);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnDatatableCell(1, 1);
  assertEditorShown(assert);
  clickOnDatatableCell(3, 3);
  assertEditorShown(assert);
});

test('Navigate, press enter and edit', function (assert) {
  assert.expect(4);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 1);
  pressEscInDatatable();
  pressRightKeyInDatatable();
  pressDownKeyInDatatable();
  pressEnterInDatatable();
  assertEditorShown(assert);
  typeInDatatable('My new value');
  pressEnterInDatatable();
  assertEditorNotShown(assert);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', 'My new value', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
});

test('Navigate, start typing to replace the cell content', function (assert) {
  assert.expect(4);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert,[
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 1);
  pressEscInDatatable();
  typeInDatatable('I type something without having an input');
  assertEditorShown(assert);
  pressEnterInDatatable();
  assertEditorNotShown(assert);
  assertDatatableContent(assert,[
    ['I type something without having an input', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
});

test('Cells with "isEditable" set to false can not be edited', function (assert) {
  assert.expect(6);
  var self = this;
  andThen(function () {
    self.get('table').set('headers.cells.firstObject.isEditable', false);
    self.get('table').get('body').forEach(function (row, index) {
      row.get('cells')[index % 2 === 0 ? 1 : 0].set('isEditable', false);
    });
  });

  this.render(hbs`{{easy-datatable table=table}}`);

  clickOnDatatableCell(0, 0);
  assertEditorNotShown(assert,
    'When clicking on the protected cell, the editor does not show up');
  clickOnDatatableCell(0, 1);
  assertEditorShown(assert,
    '(but it still work on an editable cell)');
  pressEscInDatatable();
  pressDownKeyInDatatable();
  pressEnterInDatatable();
  assertEditorNotShown(assert,
    'When pressing enter in a protected cell, we do not get the editor');
  pressDownKeyInDatatable();
  pressEnterInDatatable();
  assertEditorShown(assert,
    '(but it still works in editable cells)');
  pressEscInDatatable();
  pressLeftKeyInDatatable();
  typeInDatatable('Hey');
  assertEditorNotShown(assert,
    'Same principle when typing in a protected cell');
  pressDownKeyInDatatable();
  typeInDatatable('Ho');
  assertEditorShown(assert,
    '(but it still works in editablecells)');
  pressEscInDatatable();
});

test('Navigation based on enter', function (assert) {
  assert.expect(9);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(2, 2);
  typeInDatatable('x');
  pressEnterInDatatable();
  assertDatatableContent(assert,[
    ['Row 0', '0', '10', '20'],
    ['Row 1', 'x', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'After entering "x", the datatable content is correct');
  assertSelectedDatatableCell(assert, 3, 2,
    'If the cell value is validated using enter, then cell below is selected');
  typeInDatatable('y');
  pressTabKeyInDatatable();
  assertDatatableContent(assert,[
    ['Row 0', '0', '10', '20'],
    ['Row 1', 'x', '11', '21'],
    ['Row 2', 'y', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  assertSelectedDatatableCell(assert, 3, 3,
    'If the cell value is validated using tab, then cell on the right is selected');
  typeInDatatable('z');
  pressShiftTabKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', 'x', '11', '21'],
    ['Row 2', 'y', 'z', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  assertSelectedDatatableCell(assert, 3, 2,
    'If the cell value is validated using shift+tab, then cell on the left is selected');
  pressDownKeyInDatatable();
  assertSelectedDatatableCell(assert, 4, 2,
    'If the down key is used, then the down cell is selected');
  typeInDatatable('a');
  pressEnterInDatatable();
  assertSelectedDatatableCell(assert, 4, 2,
    'If the cell value is validated using enter but there is no new line, selection do not change');
});
