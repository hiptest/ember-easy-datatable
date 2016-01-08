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
      headers: ['', 'Name', 'Value 1', 'Value 2', 'Value 3', ''],
      body: [
        [{isHeader: true, value: '#0'}, 'Row 0', 0, 10, 20, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, value: '#1'}, 'Row 1', 1, 11, 21, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, value: '#2'}, 'Row 2', 2, 12, 22, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, value: '#3'}, 'Row 3', 3, 13, 23, {isHeader: true, showActions: true, isEditable: false}]
      ]
    }));
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('Click on remove to remove a row', function(assert) {
  assert.expect(1);

  this.render(hbs`{{easy-datatable table=table}}`);
  clickOnRemoveRow(2);
  assertDatatableContent(assert, [
    ['Row 0', '0', '10', '20'],
    ['Row 2', '2', '12', '22'],
    ['Row 3', '3', '13', '23']
  ], 'The row is removed');
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