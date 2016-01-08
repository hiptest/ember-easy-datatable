import Ember from 'ember';
import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import { makeListOf } from "ember-easy-datatable/utils/utils";
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import { moduleForComponent, test } from 'ember-qunit';

var App;

moduleForComponent('easy-datatable', 'Integration | Component | Insertion', {
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

    makeDefaultRow: function () {
      var row = makeListOf(this.get('headers.cells.length'));
      row[0] = {
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

test('Inserting a new row', function(assert) {
  assert.expect(5);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 1);
  pressEscInDatatable();
  pressCtrlInserKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'Nothing happens if it is not done in a row header');
  pressLeftKeyInDatatable();
  pressCtrlInserKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['', '', '', ''],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'Otherwise, a new empty row is added after the selected row');
  assertSelectedDatatableCell(assert, 2, 0,
    'The header of the new row is selected');
  clickOnDatatableCell(5, 0);
  pressEscInDatatable();
  pressCtrlInserKeyInDatatable();
  assertSelectedDatatableCell(assert, 6, 0,
    'Inserting the last row with a keyboard shortcut brings to the correct cell');
});

test('Inserting a new row can be prevented by setting "canInsertRows" at the table level', function (assert) {
  var self = this;
  assert.expect(2);

  this.render(hbs`{{easy-datatable table=table}}`);
  andThen(function () {
    self.get('table').set('canInsertRows', false);
  });
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 0);
  pressEscInDatatable();
  pressCtrlInserKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'There is no row added');
});

test('It is also possible to avoid new rows at given indices', function (assert) {
  var self = this;
  assert.expect(3);

  this.render(hbs`{{easy-datatable table=table}}`);
  andThen(function () {
    self.get('table.body')[2].set('cells.firstObject.canInsertRowAfter', false);
  });
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(3, 0);
  pressEscInDatatable();
  pressCtrlInserKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'There is no row added');
  pressUpKeyInDatatable();
  pressCtrlInserKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['', '', '', ''],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'But rows can still be inserted at other places');
  });

//TODO Add first row

//TODO Add last row

test('Inserting a new column', function (assert) {
  assert.expect(6);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 1);
  pressEscInDatatable();
  pressCtrlInserKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'Nothing happens if it is not done in a column header');
  pressUpKeyInDatatable();
  pressCtrlInserKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '', '0', '10', '20'],
    ['Row 1', '', '1', '11', '21'],
    ['Row 2', '', '2', '12', '22'],
    ['Row 3', '', '3', '13', '23']
  ], 'Otherwise, a new empty column is added after the selected column');
  assertDatatableHeader(assert, [ "", 'Name', '', 'Value 1', 'Value 2', 'Value 3'],
    'An empty header is also added');
  assertSelectedDatatableCell(assert, 0, 2,
    'The correct header cell is selected after insertion');
  clickOnDatatableCell(0, 5);
  pressEscInDatatable();
  pressCtrlInserKeyInDatatable();
  assertSelectedDatatableCell(assert, 0, 6,
    'After inserting the last column, the correct cell is selected)');
});

test('Inserting a new column can be prevented by setting "canInsertColumns" to false at table level', function (assert) {
  var self = this;
  assert.expect(3);

  this.render(hbs`{{easy-datatable table=table}}`);
  andThen(function () {
    self.get('table').set('canInsertColumns', false);
  });
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(0, 1);
  pressEscInDatatable();
  pressCtrlInserKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'No column as been added');
  assertDatatableHeader(assert, [ '', 'Name', 'Value 1', 'Value 2', 'Value 3'],
    'Headers have not changed');
});

test('It can also be prevented for specific columns', function (assert) {
  var self = this;
  assert.expect(4);

  this.render(hbs`{{easy-datatable table=table}}`);
  andThen(function () {
    self.get('table').get('headers.cells')[2].set('canInsertColumnAfter', false);
  });
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(0, 2);
  pressEscInDatatable();
  pressCtrlInserKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'No column as been added');
  assertDatatableHeader(assert, [ '', 'Name', 'Value 1', 'Value 2', 'Value 3'],
    'headers have not changed');
  pressRightKeyInDatatable();
  pressCtrlInserKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '', '20'],
    ['Row 1', '1', '11', '', '21'],
    ['Row 2', '2', '12', '', '22'],
    ['Row 3', '3', '13', '', '23']
  ], 'Columns can still be added in after other columns');
});