import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import '@ember/test-helpers';
import customHelpers from '../../helpers/_custom-helpers'



module('Integration | Component | deletion', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
       this.set('table', DatatableFactory.makeDatatable({
        headers: ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
        body: [
          [{isHeader: true, value: '#0'}, 'Row 0', 0, 10, 20],
          [{isHeader: true, value: '#1'}, 'Row 1', 1, 11, 21],
          [{isHeader: true, value: '#2'}, 'Row 2', 2, 12, 22],
          [{isHeader: true, value: '#3'}, 'Row 3', 3, 13, 23]
        ]
      }));
  });

  test('Removing a row', async function(assert) {
    assert.expect(7);

    await this.render(hbs`{{easy-datatable table=table}}`);
    assert.deepEqual(customHelpers.getDatatableContent(),[['Row 0', '0', '10', '20'],
                                              ['Row 1', '1', '11', '21'],
                                              ['Row 2', '2', '12', '22'],
                                              ['Row 3', '3', '13', '23']]
                                               ,'The datatable content is correct');
    await customHelpers.clickOnDatatableCell(1, 1);
    await customHelpers.pressEscInDatatable();
    await customHelpers.pressCtrlDelKeyInDatatable();
    assert.deepEqual(customHelpers.getDatatableContent(),[['Row 0', '0', '10', '20'],
                                                ['Row 1', '1', '11', '21'],
                                                ['Row 2', '2', '12', '22'],
                                                ['Row 3', '3', '13', '23']]
                                              ,'Nothing happens if it is not done in a row header');
    await customHelpers.pressLeftKeyInDatatable();
    await customHelpers.pressCtrlDelKeyInDatatable();
    assert.deepEqual(customHelpers.getDatatableContent(),[['Row 1', '1', '11', '21'],
                                                        ['Row 2', '2', '12', '22'],
                                                        ['Row 3', '3', '13', '23']]
                                               ,'Otherwise, the current row is removed');
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 0}, 'The row below is selected after deletion');
    await customHelpers.pressDownKeyInDatatable();
    await customHelpers.pressDownKeyInDatatable();
    await customHelpers.pressCtrlDelKeyInDatatable();
    assert.deepEqual(customHelpers.getDatatableContent(),[['Row 1', '1', '11', '21'],
                                                        ['Row 2', '2', '12', '22']]);

    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 2, column: 0}
        ,'If the last row is selected, the selection moves the the row above');
    await customHelpers.pressCtrlDelKeyInDatatable();
    await customHelpers.pressCtrlDelKeyInDatatable();
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 0, column: 0}, 'If the body is empty after deletion, selection moves to the header');
  });

  test('Row can me marked as non-removable', async function (assert) {
    var self = this;
    assert.expect(2);

    await this.render(hbs`{{easy-datatable table=table}}`);
    self.set('table.body.firstObject.cells.firstObject.isRemovable', false);
    assert.deepEqual(customHelpers.getDatatableContent(),[['Row 0', '0', '10', '20'],
                                                        ['Row 1', '1', '11', '21'],
                                                        ['Row 2', '2', '12', '22'],
                                                        ['Row 3', '3', '13', '23']]);

    await customHelpers.clickOnDatatableCell(1, 0);
    await customHelpers.pressEscInDatatable();
    await customHelpers.pressCtrlDelKeyInDatatable();
    assert.deepEqual(customHelpers.getDatatableContent(), [['Row 0', '0', '10', '20'],
                                                          ['Row 1', '1', '11', '21'],
                                                          ['Row 2', '2', '12', '22'],
                                                          ['Row 3', '3', '13', '23']]
                                                          ,'Nothing happens as the row is marked as non-removable');
  });

  test('Removing a column', async function (assert) {
    assert.expect(4);

    await this.render(hbs`{{easy-datatable table=table}}`);
    assert.deepEqual(customHelpers.getDatatableContent(), [['Row 0', '0', '10', '20'],
                                                        ['Row 1', '1', '11', '21'],
                                                        ['Row 2', '2', '12', '22'],
                                                        ['Row 3', '3', '13', '23']]);
    await customHelpers.clickOnDatatableCell(1, 1);
    await customHelpers.pressEscInDatatable();
    await customHelpers.pressCtrlDelKeyInDatatable();
    assert.deepEqual(customHelpers.getDatatableContent(), [ ['Row 0', '0', '10', '20'],
                                                        ['Row 1', '1', '11', '21'],
                                                        ['Row 2', '2', '12', '22'],
                                                        ['Row 3', '3', '13', '23']]
                                                        ,'Nothing happens if it is not done in a column header');
    await customHelpers.pressUpKeyInDatatable();
    await customHelpers.pressCtrlDelKeyInDatatable();
    assert.deepEqual(customHelpers.getDatatableContent(), [ ['0', '10', '20'],
                                                        ['1', '11', '21'],
                                                        ['2', '12', '22'],
                                                        ['3', '13', '23']]
                                                        ,'Otherwise, the current column is removed');
    assert.deepEqual(customHelpers.getDatatableHeaders(), [ "", 'Value 1', 'Value 2', 'Value 3'],'The header is also removed');
  });

  test('Columns can be marked as non-removable', async function (assert) {
    var self = this;
    assert.expect(3);

    await this.render(hbs`{{easy-datatable table=table}}`);

    self.get('table').get('headers.cells')[1].set('isRemovable', false);

    assert.deepEqual(customHelpers.getDatatableContent(), [['Row 0', '0', '10', '20'],
                                                      ['Row 1', '1', '11', '21'],
                                                      ['Row 2', '2', '12', '22'],
                                                      ['Row 3', '3', '13', '23']]);
    await customHelpers.clickOnDatatableCell(0, 1);
    await customHelpers.pressEscInDatatable();
    await customHelpers.pressCtrlDelKeyInDatatable();
    assert.deepEqual(customHelpers.getDatatableContent(), [['Row 0', '0', '10', '20'],
                                                        ['Row 1', '1', '11', '21'],
                                                        ['Row 2', '2', '12', '22'],
                                                        ['Row 3', '3', '13', '23']]
                                                        ,'Nothing happens as the column is marker as non removable');
    assert.deepEqual(customHelpers.getDatatableHeaders(), ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],'The header is still there');
  });
});
