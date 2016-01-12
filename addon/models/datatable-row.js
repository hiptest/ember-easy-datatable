import Ember from "ember";
import DatatableFactory from "../utils/datatable-factory";

export default Ember.Object.extend({
  cells: null,

  moveCell: function (from, to) {
    DatatableFactory.moveObject(this.get('cells'), from, to);
  }
});