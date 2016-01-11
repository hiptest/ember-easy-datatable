import Ember from 'ember';
import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import { test, moduleForComponent } from 'ember-qunit';

var App;

moduleForComponent('easy-datatable', 'Integration | Component | deletion', {
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

test('Removing a row', function(assert) {
  assert.expect(7);
  
  this.render(hbs`{{easy-datatable table=table}}`);
  
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 1);
  pressEscInDatatable();
  pressCtrlDelKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'Nothing happens if it is not done in a row header');
  pressLeftKeyInDatatable();
  pressCtrlDelKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'Otherwise, the current row is removed');
  assertSelectedDatatableCell(assert, 1, 0,
    'The row below is selected after deletion');
  pressDownKeyInDatatable();
  pressDownKeyInDatatable();
  pressCtrlDelKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22']
  ]);
  assertSelectedDatatableCell(assert, 2, 0,
    'If the last row is selected, the selection moves the the row above');
  pressCtrlDelKeyInDatatable();
  pressCtrlDelKeyInDatatable();
  assertSelectedDatatableCell(assert, 0, 0,
    'If the body is empty after deletion, selection moves to the header');
});

test('Row can me marked as non-removable', function (assert) {
  var self = this;
  assert.expect(2);

  this.render(hbs`{{easy-datatable table=table}}`);
  andThen(function () {
    self.set('table.body.firstObject.cells.firstObject.isRemovable', false);
  });
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 0);
  pressEscInDatatable();
  pressCtrlDelKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'Nothing happens as the row is marked as non-removable');
});

test('Removing a column', function (assert) {
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
  pressCtrlDelKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'Nothing happens if it is not done in a column header');
  pressUpKeyInDatatable();
  pressCtrlDelKeyInDatatable();
  assertDatatableContent(assert, [
    ['0', '10', '20'],
    ['1', '11', '21'],
    ['2', '12', '22'],
    ['3', '13', '23']
  ], 'Otherwise, the current column is removed');
  assertDatatableHeader(assert, [ "", 'Value 1', 'Value 2', 'Value 3'],
    'The header is also removed');
});

test('Columns can be marked as non-removable', function (assert) {
  var self = this;
  assert.expect(3);

  this.render(hbs`{{easy-datatable table=table}}`);
  andThen(function () {
    self.get('table').get('headers.cells')[1].set('isRemovable', false);
  });
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(0, 1);
  pressEscInDatatable();
  pressCtrlDelKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'Nothing happens as the column is marker as non removable');
  assertDatatableHeader(assert, ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
    'The header is still there');
});
