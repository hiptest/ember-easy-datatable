import Ember from 'ember';
import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import { test, moduleForComponent } from 'ember-qunit';

var App;

moduleForComponent('easy-datatable', 'Integration | Component | Table ordering', {
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

test('Column order can be changed using ctrl + left/right arrow', function(assert) {
  assert.expect(8);

  this.render(hbs`{{easy-datatable table=table}}`);
  assertDatatableHeader(assert, ["", "Name", "Value 1", "Value 2", "Value 3"]);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ]);
  clickOnDatatableCell(1, 1);
  pressEscInDatatable();
  pressCtrlRightKeyInDatatable();
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'If a cell is selected (not a <th> in the header), nothing happens when doing ctrl + right');
  pressUpKeyInDatatable();
  pressCtrlRightKeyInDatatable();
  assertDatatableContent(assert, [
    ['0', 'Row 0', '10', '20'],
    ['1', 'Row 1', '11', '21'],
    ['2', 'Row 2', '12', '22'],
    ['3', 'Row 3', '13', '23']
  ], 'Otherwise, the selected is moved to the right');
  assertDatatableHeader(assert, ["", "Value 1", "Name", "Value 2", "Value 3"],
    'And so is the header');
  assertHightlightedCellsText(assert, ['Name', 'Row 0', 'Row 1', 'Row 2', 'Row 3'],
    'The moved column is stilln highlighted');
  pressCtrlLeftKeyInDatatable();
  assertDatatableHeader(assert, ["", "Name", "Value 1", "Value 2", "Value 3"],
    'Ctrl+left moves the row back');
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 1', '1', '11', '21'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'And the header too, of course');
});
