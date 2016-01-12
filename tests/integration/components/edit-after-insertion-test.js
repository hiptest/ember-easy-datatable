import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('easy-datatable', 'Integration | Component | Edit after insertion', {
  integration: true,
  setup: function() {
    App = startApp();
    this.set('table', DatatableFactory.makeDatatable({
      headers: [{value:'H1', showAddFirstColumn: true, isEditable: false}, 
      'H2', 
      'H3', 
      {value:'H4', showAddLastColumn: true, isEditable: false}],
      body: [
        [
          {isEditable: false, value: '11', isHeader: true},
          {isEditable: false, value: '12'},
          {isEditable: false, value: '13'},
          {isEditable: false, value: '14'}
        ],
        [
          {isEditable: false, value: '21', isHeader: true},
          {isEditable: false, value: '22'},
          {isEditable: false, value: '23'},
          {isEditable: false, value: '24'}
        ],
        [
          {isEditable: false, value: '31', isHeader: true},
          {isEditable: false, value: '32'},
          {isEditable: false, value: '33'},
          {isEditable: false, value: '34'}
        ],
        [
          {isEditable: false, value: '41', isHeader: true},
          {isEditable: false, value: '42'},
          {isEditable: false, value: '43'},
          {isEditable: false, value: '44'}
        ]
      ],

      makeDefaultRow: function () {
        return this.get('headers.cells').map(function (item, index) {
          return {
            value: index,
            isEditable: index > 2
          };
        });
      },

      makeDefaultColumn: function () {
        var column = [{
          isHeader: true,
          isEditable: false,
          value: 'H+'
        }];

        this.get('body').forEach(function (item, index) {
          column.push({
            value: index,
            isEditable: index > 2
          });
        });
        return column;
      }
    }));
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});


test('If option "editAfterInsertion" is set to true, the editor is shown after inserting a new row', function (assert) {
  assert.expect(6);
  this.render(hbs`{{easy-datatable table=table editAfterInsertion=true showAddFirstRow=true showAddLastRow=true addNewRowLabel='Add new row'}}`);

  clickOnDatatableCell(2, 0);
  pressCtrlInserKeyInDatatable();
  assertSelectedDatatableCell(assert, 3, 3,
    'The first editable cell is selected (not the header) ...');
  assertEditorShown(assert, '... and the editor is shown');
  click('a.add-last-row');
  assertSelectedDatatableCell(assert, 7, 3,
    'It also works when inserting last row ...');
  assertEditorShown(assert);
  click('a.add-first-row');
  assertSelectedDatatableCell(assert, 2, 3,
    '... or the first row');
  assertEditorShown(assert);
});

test('If option "editAfterInsertion" is set to true, the editor is shown after inserting a new column', function (assert) {
  assert.expect(6);

  this.render(hbs`{{easy-datatable table=table editAfterInsertion=true}}`);
  clickOnDatatableCell(0, 2);
  pressEscInDatatable();
  pressCtrlInserKeyInDatatable();
  assertSelectedDatatableCell(assert, 4, 3,
    'The same principle applies when inserting columns');
  assertEditorShown(assert, '... and the editor is also shown');
  click('a.add-first-column');
  assertSelectedDatatableCell(assert, 4, 0,
    'It also works when inserting the first column ...');
  assertEditorShown(assert);
  click('a.add-last-column');
  assertSelectedDatatableCell(assert, 4, 6,
    '... or the last one');
  assertEditorShown(assert);
});