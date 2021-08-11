import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {render} from '@ember/test-helpers';
import customHelpers from '../../helpers/_custom-helpers'


module('Integration | Component | keyboard navigation', function(hooks) {
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

  test('Keyboard navigation', async function(assert) {
    await render(hbs`{{easy-datatable table=table}}`)

    assert.equal(customHelpers.getSelectedCell().length, 0, 'No cell is currently selected')

    await customHelpers.clickOnDatatableCell(1, 1);
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 1}, 'The correct cell is selected')

    await customHelpers.pressRightKeyInDatatable()
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 1}, 'If the input is present, keyboard navigation does not have any effect')


    await customHelpers.pressUpKeyInDatatable()
    await customHelpers.pressDownKeyInDatatable();
    await customHelpers.pressLeftKeyInDatatable();

    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 1}, 'The correct cell is selected')
debugger
    await customHelpers.pressEscInDatatable()
    debugger
    await customHelpers.pressRightKeyInDatatable()
debugger
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 2}, 'Pressing ESC removes the input, so we can navigate with the keyboard')

    await customHelpers.pressDownKeyInDatatable()
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 2, column: 2}, 'The correct cell is selected')

    await customHelpers.pressLeftKeyInDatatable()
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 2, column: 1}, 'The correct cell is selected')

    await customHelpers.pressUpKeyInDatatable()
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 1}, 'The correct cell is selected')

    await customHelpers.pressUpKeyInDatatable()
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 0, column: 1}, 'It is also possible to navigate to the header')

    await customHelpers.pressRightKeyInDatatable()
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 0, column: 2}, 'The correct cell is selected')

    await customHelpers.pressLeftKeyInDatatable()
    await customHelpers.pressLeftKeyInDatatable()
    await customHelpers.pressDownKeyInDatatable()
    await customHelpers.pressDownKeyInDatatable()

    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 2, column: 0}, 'Navigation can also be done to the body <th> cells')
  });

  test('Highliting on header selection', async function (assert) {
    await render(hbs`{{easy-datatable table=table}}`)

    await customHelpers.clickOnDatatableCell(1, 1)
    await customHelpers.pressEscInDatatable()

    assert.deepEqual(customHelpers.getHighlightedCellsText(), [], 'When a <td> cell is focused, it does not highlight anything')

    await customHelpers.pressUpKeyInDatatable()
    assert.deepEqual(customHelpers.getHighlightedCellsText(),
      ['Name', 'Row 0', 'Row 1', 'Row 2', 'Row 3'],
      'If a cell in the <thead> is selected, then all cells in the column are highlited')

    await customHelpers.pressLeftKeyInDatatable()
    assert.deepEqual(customHelpers.getHighlightedCellsText(),
      ['', '#0', '#1', '#2', '#3'],
      'It follows keyboard navigation')

    await customHelpers.pressDownKeyInDatatable()
    assert.deepEqual(customHelpers.getHighlightedCellsText(), ['#0', 'Row 0', '0', '10', '20'],
      'If the focused cell is a <th> in the body, then the row is highlited')

    await customHelpers.pressDownKeyInDatatable()
    assert.deepEqual(customHelpers.getHighlightedCellsText(), ['#1', 'Row 1', '1', '11', '21'],
      'It still follows keyboard navigation')

    await customHelpers.clickOnDatatableCell(0, 3);
    assert.deepEqual(customHelpers.getHighlightedCellsText(), ['Value 2', '10', '11', '12', '13'],
      'Clicking to another <th> updates highliting')

    await customHelpers.clickOnDatatableCell(3, 0);
    assert.deepEqual(customHelpers.getHighlightedCellsText(), ['#2', 'Row 2', '2', '12', '22'],
      'Same thing it a <th> in the body')

    await customHelpers.clickOnDatatableCell(2, 3);
    assert.deepEqual(customHelpers.getHighlightedCellsText(), [])
  });

  test('Switching to other rows/columns when needed', async function (assert) {
    await render(hbs`{{easy-datatable table=table}}`);

    await customHelpers.clickOnDatatableCell(2, 0);
    await customHelpers.pressEscInDatatable();
    await customHelpers.pressLeftKeyInDatatable();
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 1, column: 4},
      'Navigating left in the first column brings to the end of the previous row')

    await customHelpers.pressRightKeyInDatatable();
    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 2, column: 0},
      'Navigating right at the end of a column brings to the beginning on the next row')

    await customHelpers.pressDownKeyInDatatable();
    await customHelpers.pressDownKeyInDatatable();
    await customHelpers.pressDownKeyInDatatable();

    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 4, column: 0},
      'Navigating down at the bottom of the table do not move the selection')

    await customHelpers.pressRightKeyInDatatable();
    await customHelpers.pressUpKeyInDatatable();
    await customHelpers.pressUpKeyInDatatable();
    await customHelpers.pressUpKeyInDatatable();
    await customHelpers.pressUpKeyInDatatable();
    await customHelpers.pressUpKeyInDatatable();

    assert.deepEqual(customHelpers.getSelectedPosition(), {row: 0, column: 1},
      'Navigating up at the beginning of a column do not move the selection')

    await customHelpers.clickOnDatatableCell(4, 4);
    await customHelpers.pressEscInDatatable();
    await customHelpers.pressRightKeyInDatatable();

    assert.deepEqual(customHelpers.getSelectedPosition(), {row: -1, column: -1},
      'Navigating right at the bottom-right of the table empties the selection')
  });
});
