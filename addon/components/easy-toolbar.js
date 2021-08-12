import Component from '@ember/component'
import { computed } from '@ember/object'

export default Component.extend({
  tagName: 'ul',
  classNames: ['toolbar'],
  screenSwitchProps: computed('isFullScreen', function () {
    return this.isFullScreen ? {
      label: "Back to normal mode",
      icon: "icon-size-actual"
    } : {label: "Switch to full screen", icon: "icon-size-fullscreen"};
  }),

  actions: {
    toggleFullScreen: function () {
      this.set('isFullScreen', !this.isFullScreen);
    }
  }
});
