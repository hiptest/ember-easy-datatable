import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('easy-datatable', 'Integration | Component | Action buttons', {
  integration: true,
  setup: function() {
    App = startApp();
    this.set('table', DatatableFactory.makeDatatable({
      headers: [
        {isEditable: false, value: '', showAddFirstColumn: true},
        'Name',
        {value: 'Value 1', showActions: true},
        {value: 'Value 2', showActions: true},
        {value: 'Value 3', showActions: true},
        {isEditable: false, value: '', showAddLastColumn: true, canInsertColumnAfter: false}],
      body: [
        [{isHeader: true, value: '#0'}, 'Row 0', 0, 10, 20, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, value: '#1'}, 'Row 1', 1, 11, 21, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, value: '#2'}, 'Row 2', 2, 12, 22, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, value: '#3'}, 'Row 3', 3, 13, 23, {isHeader: true, showActions: true, isEditable: false}]
      ],

      makeDefaultRow: function () {
        var row = DatatableFactory.makeListOf(this.get('headers.cells.length'));
        row[0] = {
          isHeader: true,
          isEditable: false
        };
        row[5] = {
          isHeader: true,
          isEditable: false
        };
        return row;
      }
    }));
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('Click on remove to remove a row', function(assert) {
  assert.expect(1);

  this.render(hbs`{{easy-datatable table=table}}`);
  return clickOnRemoveRow(2).then(() => {
    return assertDatatableContent(assert, [
      ['Row 0', '0', '10', '20'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'The row is removed');
  });
});

test('Click to move up a row', function(assert) {
  assert.expect(1);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnMoveUpRow(2);

  assertDatatableContent(assert, [
    ['Row 1', '1', '11', '21'],
    ['Row 0', '0', '10', '20'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'The row has moved up');
});

test('Click to move down a row', function(assert) {
  assert.expect(1);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnMoveDownRow(2);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 2', '2', '12', '22'],
    ['Row 1', '1', '11', '21'],
    ['Row 3', '3', '13', '23']
  ], 'The row has moved down');
});

test('Click to remove a column', function(assert) {
  assert.expect(1);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnRemoveColumn(2);
  assertDatatableContent(assert, [
    ['Row 0', '10', '20'],
    ['Row 1', '11', '21'],
    ['Row 2', '12', '22'],
    ['Row 3', '13', '23']
  ], 'The column is deleted');
});

/*
test('Click to edit a cell', function(assert) {
  assert.expect(1);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnPencil(1,2);
  assertEditorShown(assert);
});
*/

test('Click to move right a column', function(assert) {
  assert.expect(1);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnMoveRightColumn(2);
  assertDatatableContent(assert, [
    ['Row 0', '10', '0', '20'],
    ['Row 1', '11', '1', '21'],
    ['Row 2', '12', '2', '22'],
    ['Row 3', '13', '3', '23']
  ], 'The column is deleted');
});

test('Click to move left a column', function(assert) {
  assert.expect(1);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnMoveLeftColumn(4);
  assertDatatableContent(assert, [
    ['Row 0', '0', '20', '10'],
    ['Row 1', '1', '21', '11'],
    ['Row 2', '2', '22', '12'],
    ['Row 3', '3', '23', '13']
  ], 'The column is deleted');
});

test('Click to add a new last column', function(assert) {
  var table = this.get('table');
  assert.expect(3);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnPlus(0,5);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20', ''],
    ['Row 1', '1', '11', '21', ''],
    ['Row 2', '2', '12', '22', ''],
    ['Row 3', '3', '13', '23', '']
  ], 'A new column is added at the end of the datatable');
  assertSelectedDatatableCell(assert, 0, 5,
      'The header cell of the newly added row is selected');
  andThen(function () {
    table.get('headers.cells').forEach(function (cell, index) {
      cell.set('canInsertColumnAfter', index < 3);
    });
  });
  clickOnPlus(0,6);
  assertDatatableContent(assert, [
    ['Row 0', '0', '', '10', '20', ''],
    ['Row 1', '1', '', '11', '21', ''],
    ['Row 2', '2', '', '12', '22', ''],
    ['Row 3', '3', '', '13', '23', ''],
  ], 'It will search for the last place where a column is insertable if needed');
});

test('Click to add first column', function (assert) {
  assert.expect(2);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnPlus(0,0);
  assertDatatableContent(assert, [
    ['', 'Row 0', '0', '10', '20'],
    ['', 'Row 1', '1', '11', '21'],
    ['', 'Row 2', '2', '12', '22'],
    ['', 'Row 3', '3', '13', '23']
  ], 'A new column is added at the beginning of the datatable');
  assertSelectedDatatableCell(assert, 0, 0,
    'The header cell of the newly added column is selected');
});

test('Validate to true a cell asynchronously and remove the row before validation ends', function (assert) {
  assert.expect(2);

  this.get('table').reopen({
    validateCell: function(cell, position, value) {
      return new Ember.RSVP.Promise(function (resolve) {
        Ember.run.later(function () {
          resolve(value);
        }, 0);
      });
    }
  });

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 3);
  typeInDatatable('12345');

  clickOnRemoveRow(1); // will focusOut, trigger the validation, but cell deleted
  assertDatatableContent(assert, [
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'The row has been deleted and the validation has not produced any "calling set on destroyed object" error');
});

test('Validate to false a cell asynchronously and remove the row before validation ends', function (assert) {
  assert.expect(2);

  this.get('table').reopen({
    validateCell: function() {
      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.run.later(function () {
          reject("this value is invalid");
        }, 0);
      });
    }
  });

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 3);
  typeInDatatable('12345');
  clickOnRemoveRow(1); // will focusOut, trigger the validation, but cell deleted
  assertDatatableContent(assert, [
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'The row has been deleted and the validation has not produced any "calling set on destroyed object" error');
});

test('Add last row', function (assert) {
  var table = this.get('table');
  assert.expect(3);

  this.render(hbs`{{easy-datatable table=table showAddLastRow=true addNewRowLabel='Add new row'}}`);
  click('.t-add-new-row');
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23'],
    ['', '', '', '']
  ], 'A new row is added at the end of the datatable');
  assertSelectedDatatableCell(assert, 5, 0,
    'The first cell of the newly added row is selected');
  andThen(function () {
    table.get('body').forEach(function (row, index) {
      row.set('cells.firstObject.canInsertRowAfter', index <= 1);
    });
  });
  click('.t-add-new-row');
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['', '', '', ''],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23'],
    ['', '', '', '']
  ], 'It will search for the last place where a row is insertable if needed');
});

test('Add first row', function (assert) {
  assert.expect(2);

  this.render(hbs`{{easy-datatable table=table showAddFirstRow=true addNewRowLabel='Add new row'}}`);

  click('a:contains("Add new row")');
  assertDatatableContent(assert, [
    ['', '', '', ''],
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'A new row is added at the beginning of the datatable');
  assertSelectedDatatableCell(assert, 2, 0,
    'The first cell of the newly added row is selected');
});
