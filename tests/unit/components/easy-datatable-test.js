import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('easy-datatable', {unit: true});

test('is a div tag', function(assert) {
  this.subject();
  this.$();
  assert.equal('DIV', this.$().prop('tagName'));
  assert.equal('titre', this.$('thead').text().trim());
  assert.equal('body', this.$('tbody').text().trim());
});