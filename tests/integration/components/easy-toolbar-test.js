import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('easy-toolbar', 'Integration | Component | easy toolbar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{easy-toolbar}}`);
  assert.equal(this.$().text().trim(), 'Switch to full screen');
  this.render(hbs`
    {{#easy-toolbar}}
      Switch to full screen
    {{/easy-toolbar}}
  `);
  assert.equal(this.$().text().trim(), 'Switch to full screen');
});
