import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import hbs from 'htmlbars-inline-precompile';
import { test, moduleForComponent } from 'ember-qunit';

import customHelpers from '../../helpers/_custom-helpers'


moduleForComponent('easy-datatable', 'Integration | Component | content edition', {
  integration: true,
  setup() {
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
});

test('Click and edit', async function(assert) {
  assert.expect(5);

  await this.render(hbs`{{easy-datatable table=table}}`);

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );

  await customHelpers.clickOnDatatableCell(1, 1);

  assert.ok(this.$('input').length === 1, 'Editor is displayed');
  assert.equal(this.$('input').get(0).value, "Row 0", 'Editor has the correct content');

  customHelpers.typeInDatatable('This is my row');
  customHelpers.pressEnterInDatatable();
  await customHelpers.clickOnDatatableCell(0, 0);

  assert.ok(this.$('input').length === 1, 'Editor is displayed');

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['This is my row', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );
});

test('Cell validation is called only once when pressing Enter key', async function (assert) {
  var count = 0;
  assert.expect(3);

  this.get('table').reopen({
    validateCell: function () {
      count += 1;
      return true;
    }
  });

  await this.render(hbs`{{easy-datatable table=table}}`);

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );

  await customHelpers.clickOnDatatableCell(1, 1);
  customHelpers.typeInDatatable('This is my row');
  customHelpers.pressEnterInDatatable();

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['This is my row', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'After changing a cell value, the datatable is updated'
  );

  assert.strictEqual(count, 1, 'and validation is called only once');
});

test('Cell validation is not called at all when pressing Escape key', async function (assert) {
  var count = 0;
  assert.expect(3);

  this.get('table').reopen({
   countValidateCell: function () {
      count += 1;
      return true;
    }
  });

  await this.render(hbs`{{easy-datatable table=table}}`);

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );

  await customHelpers.clickOnDatatableCell(1, 1);
  customHelpers.typeInDatatable('This is my row');
  customHelpers.pressEscInDatatable();


  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'After canceling a cell edition, the datatable is back to its original values'
  );


  assert.strictEqual(count, 0, 'and validation is not called at all');
});

test('cell validation is not called at all if not modified', async function (assert) {
  var count = 0;
  assert.expect(4);

  this.get('table').reopen({
   countValidateCell: function () {
      count += 1;
      return true;
    }
  });

  await this.render(hbs`{{easy-datatable table=table}}`);

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );

  await customHelpers.clickOnDatatableCell(1, 1);
  customHelpers.pressEnterInDatatable();

  assert.ok(this.$('input').length === 0, 'Editor is not displayed');

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'without editing, the datatable is the same!'
  );

  assert.strictEqual(count, 0, 'and validation is not called at all');
});

test('Clicking moves the editor', async function (assert) {
  assert.expect(2);

  await this.render(hbs`{{easy-datatable table=table}}`);

  await customHelpers.clickOnDatatableCell(1, 1);
  assert.ok(this.$('input').length === 1, 'Editor is displayed');

  await customHelpers.clickOnDatatableCell(3, 3);
  assert.ok(this.$('input').length === 1, 'Editor is displayed');
});

test('Navigate, press enter and edit', async function (assert) {
  assert.expect(4);

  await this.render(hbs`{{easy-datatable table=table}}`);

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );

  await customHelpers.clickOnDatatableCell(1, 1);

  customHelpers.pressEscInDatatable();
  customHelpers.pressRightKeyInDatatable();
  customHelpers.pressDownKeyInDatatable();
  customHelpers.pressEnterInDatatable();

  assert.ok(this.$('input').length === 1, 'Editor is displayed');

  customHelpers.typeInDatatable('My new value');
  customHelpers.pressEnterInDatatable();

  assert.ok(this.$('input').length === 0, 'Editor is not displayed');
  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', 'My new value', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );
});

test('Navigate, start typing to replace the cell content', async function (assert) {
  assert.expect(4);

  await this.render(hbs`{{easy-datatable table=table}}`);

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );

  await customHelpers.clickOnDatatableCell(1, 1);
  customHelpers.pressEscInDatatable();
  customHelpers.typeInDatatable('I type something without having an input');

  assert.ok(this.$('input').length === 1, 'Editor is displayed');

  customHelpers.pressEnterInDatatable();

  assert.ok(this.$('input').length === 0, 'Editor is not displayed');

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['I type something without having an input', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );
});

test('Cells with "isEditable" set to false can not be edited', async function (assert) {
  assert.expect(6);

  this.get('table').set('headers.cells.firstObject.isEditable', false);
  this.get('table').get('body').forEach(function (row, index) {
    row.get('cells')[index % 2 === 0 ? 1 : 0].set('isEditable', false);
  });

  await this.render(hbs`{{easy-datatable table=table}}`);

  await customHelpers.clickOnDatatableCell(0, 0);

  assert.ok(this.$('input').length === 0, 'When clicking on the protected cell, the editor does not show up');

  await customHelpers.clickOnDatatableCell(0, 1);

  assert.ok(this.$('input').length === 1, 'but it still work on an editable cell');

  customHelpers.pressEscInDatatable();
  customHelpers.pressDownKeyInDatatable();
  customHelpers.pressEnterInDatatable();

  assert.ok(this.$('input').length === 0, 'When pressing enter in a protected cell, we do not get the editor');

  customHelpers.pressDownKeyInDatatable();
  customHelpers.pressEnterInDatatable();

  assert.ok(this.$('input').length === 1, 'but it still works in editable cells');

  customHelpers.pressEscInDatatable();
  customHelpers.pressLeftKeyInDatatable();
  customHelpers.typeInDatatable('Hey');

  assert.ok(this.$('input').length === 0, 'Same principle when typing in a protected cell');

  customHelpers.pressDownKeyInDatatable();
  customHelpers.typeInDatatable('Ho');

  assert.ok(this.$('input').length === 1, 'but it still works in editable cells');

  customHelpers.pressEscInDatatable();
});

test('Navigation based on enter', async function (assert) {
  assert.expect(9);

  await this.render(hbs`{{easy-datatable table=table}}`);

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );

  await customHelpers.clickOnDatatableCell(2, 2);
  customHelpers.typeInDatatable('x');
  customHelpers.pressEnterInDatatable();

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', 'x', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'After entering "x", the datatable content is correct'
  );

  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 3, column: 2}, 'If the cell value is validated using enter, then cell below is selected');

  customHelpers.typeInDatatable('y');
  customHelpers.pressTabKeyInDatatable();

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', 'x', '11', '21'],
      ['Row 2', 'y', '12', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );

  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 3, column: 3}, 'If the cell value is validated using tab, then cell on the right is selected');

  customHelpers.typeInDatatable('z');
  customHelpers.pressShiftTabKeyInDatatable();

  assert.deepEqual(
    customHelpers.getDatatableContent(),
    [
      ['Row 0', '0', '10', '20'],
      ['Row 1', 'x', '11', '21'],
      ['Row 2', 'y', 'z', '22'],
      ['Row 3', '3', '13', '23']
    ],
    'The datatable content is correct'
  );

  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 3, column: 2}, 'If the cell value is validated using shift+tab, then cell on the left is selected');

  customHelpers.pressDownKeyInDatatable();

  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 4, column: 2}, 'If the down key is used, then the down cell is selected');

  customHelpers.typeInDatatable('a');
  customHelpers.pressEnterInDatatable();

  assert.deepEqual(customHelpers.getSelectedPosition(), {row: 4, column: 2}, 'If the cell value is validated using enter but there is no new line, selection do not change');
});
