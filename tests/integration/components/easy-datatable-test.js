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
    this.set('table', DatatableFactory.makeDatatable({
    headers: ['Col 1', 'Col 2'],
    body: [
      ['Row 11', 'Row 12'],
      ['Row 21', 'Row 22'],
      ['Row 31', 'Row 32'],
      ['Row 41', 'Row 42']
    ]
  }));
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('Basic test', function(assert) {
  assert.expect(1);

  this.render(hbs`{{easy-datatable table=table}}`);

  assertDatatableContent(assert, [
    ['Row 11', 'Row 12'],
    ['Row 21', 'Row 22'],
    ['Row 31', 'Row 32'],
    ['Row 41', 'Row 42']
  ]);
});

test('Can add class to table tag', function(assert) {
  assert.expect(2);
  this.render(hbs`{{easy-datatable tableClasses='datatable table-bordered' table=table}}`);

  // by the user can add new ones
  assert.ok(find('.datatable').length !== 0, 'the user can ...');
  assert.ok(find('.table-bordered').length !== 0, '... add new classes for the table tage');
});
