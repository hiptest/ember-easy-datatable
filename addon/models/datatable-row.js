import EmberObject from "@ember/object";
import DatatableFactory from "../utils/datatable-factory";

export default EmberObject.extend({
  cells: null,

  moveCell: function (from, to) {
    DatatableFactory.moveObject(this.get('cells'), from, to);
  }
});
