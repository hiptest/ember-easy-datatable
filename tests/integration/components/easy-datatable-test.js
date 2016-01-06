import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('easy-datatable', 'Integration | Component | easy datatable', {
  integration: true,
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('Basic test', function(assert) {
  assert.expect(1);

  this.set('table', DatatableFactory.makeDatatable({
    headers: ['Col 1', 'Col 2'],
    body: [
      ['Row 11', 'Row 12'],
      ['Row 21', 'Row 22'],
      ['Row 31', 'Row 32'],
      ['Row 41', 'Row 42']
    ]}));

  this.render(hbs`{{easy-datatable table=table}}`);

  assertDatatableContent(assert, [
    ['Row 11', 'Row 12'],
    ['Row 21', 'Row 22'],
    ['Row 31', 'Row 32'],
    ['Row 41', 'Row 42']
  ]);
});