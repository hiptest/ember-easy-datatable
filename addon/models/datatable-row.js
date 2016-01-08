import Ember from "ember";
import { moveObject } from "../utils/utils";

export default Ember.Object.extend({
  cells: null,

  moveCell: function (from, to) {
    moveObject(this.get('cells'), from, to);
  }
});