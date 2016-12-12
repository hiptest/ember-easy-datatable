import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'ul',
	classNames: ['toolbar'],
	screenSwitchProps: Ember.computed('isFullScreen', function () {
		return this.get('isFullScreen') ? {label: "Back to normal mode", icon:"icon-size-actual"} : {label: "Switch to full screen", icon:"icon-size-fullscreen"};
	}),

	actions: {
		toggleFullScreen: function () {
      this.set('isFullScreen', !this.get('isFullScreen'));
    }
	}
});
