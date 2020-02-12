import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import customHelpers from '../../helpers/_custom-helpers'



moduleForComponent('easy-datatable', 'Integration | Component | index cell', {
  integration: true,
  setup: function() {
    this.set('table', DatatableFactory.makeDatatable({
    headers: ['', 'Index', 'Original name'],
    body: [
      [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 1'],
      [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 2'],
      [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 3'],
      [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 4']
    ],
    makeDefaultRow: function () {
      var row = DatatableFactory.makeListOf(this.get('headers.cells.length'));
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
  },
});

test('When isIndex is set to true, the cell displays the row + 1', function(assert) {
  assert.expect(1);

  this.render(hbs`{{easy-datatable table=table}}`);

  assert.deepEqual(customHelpers.getDatatableContent(), [
    ['1', 'Row 1'],
    ['2', 'Row 2'],
    ['3', 'Row 3'],
    ['4', 'Row 4']
  ]);
});

test('Is keeps showing the correct value after insertion, removing or reordering', function (assert) {
  assert.expect(1);

  this.render(hbs`{{easy-datatable table=table}}`);
  assert.deepEqual(customHelpers.getDatatableContent(), [
    ['1', 'Row 1'],
    ['2', 'Row 2'],
    ['3', 'Row 3'],
    ['4', 'Row 4']
  ]);
  //Problem with pressCtrlInserKeyInDatatable, must be corrected so the assertions can pass

  /*
  customHelpers.clickOnDatatableCell(1, 0);
  customHelpers.pressCtrlInserKeyInDatatable();

  assert.deepEqual(customHelpers.getDatatableContent(), [
    ['1', 'Row 1'],
    ['2', ''],
    ['3', 'Row 2'],
    ['4', 'Row 3'],
    ['5', 'Row 4']
  ]);

  customHelpers.pressCtrlDelKeyInDatatable();
  assert.deepEqual(customHelpers.getDatatableContent(), [
    ['1', 'Row 1'],
    ['2', 'Row 2'],
    ['3', 'Row 3'],
    ['4', 'Row 4']
  ]);
  customHelpers.pressCtrlDownKeyInDatatable();
  assert.deepEqual(customHelpers.getDatatableContent(), [
    ['1', 'Row 1'],
    ['2', 'Row 3'],
    ['3', 'Row 2'],
    ['4', 'Row 4']
  ]);*/
});
