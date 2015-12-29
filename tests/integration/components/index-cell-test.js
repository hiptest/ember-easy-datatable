import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import makeListOf from "ember-easy-datatable/utils/utils";
import assertDatatableContent from '../../helpers/helper';
import hbs from 'htmlbars-inline-precompile';
import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('easy-datatable', 'Integration | Component | index cell', {
  integration: true
});

test('When isIndex is set to true, the cell displays the row + 1', function(assert) {
  assert.expect(1);

  this.set('table', DatatableFactory.makeDatatable({
    headers: ['', 'Index', 'Original name'],
    body: [
      [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 1'],
      [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 2'],
      [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 3'],
      [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 4']
    ],
    makeDefaultRow: function () {
      var row = makeListOf(this.get('headers.cells.length'));
      row[0] = {
        isHeader: true,
        isEditable: false
      };
      row[1] = {
        isIndex: true
      };
      return row;
    }    
  }));

  this.render(hbs`{{easy-datatable table=table}}`);

  assertDatatableContent(assert, this.$(), [
    ['1', 'Row 1'],
    ['2', 'Row 2'],
    ['3', 'Row 3'],
    ['4', 'Row 4']
  ]);
});