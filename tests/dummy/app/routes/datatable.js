import DatatableFactory from "ember-easy-datatable/utils/datatable-factory";
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var result = DatatableFactory.makeDatatable({
      headers: [
        {isEditable: false, isProtected: true, value: '', showAddFirstColumn: true}, 
        {value: 'col 1', showActions: true}, 
        {value: 'col 2', showActions: true}, 
        {value: 'col 3', showActions: true}, 
        {value: 'col 4', showActions: true}, 
        {value: 'col 5', showActions: true}, 
        {isEditable: false, value: '', showAddLastColumn: true, canInsertColumnAfter: false}
      ],
      body: [
        [{isHeader: true, isIndex: true, isEditable: false}, 1, 2, 3, 4, 5, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false, isMovable: false}, 11, 12, 13, 14, 15, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 21, 22, 23, 24, 25, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 31, 32, 33, 34, 35, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 41, 42, 43, 44, 45, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 51, 52, 53, 54, 55, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 1, 2, 3, 4, 5, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 11, 12, 13, 14, 15, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 21, 22, 23, 24, 25, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 31, 32, 33, 34, 35, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 41, 42, 43, 44, 45, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 51, 52, 53, 54, 55, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 1, 2, 3, 4, 5, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 11, 12, 13, 14, 15, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 21, 22, 23, 24, 25, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 31, 32, 33, 34, 35, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 41, 42, 43, 44, 45, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 51, 52, 53, 54, 55, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 1, 2, 3, 4, 5, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 11, 12, 13, 14, 15, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 21, 22, 23, 24, 25, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 31, 32, 33, 34, 35, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 41, 42, 43, 44, 45, {isHeader: true, showActions: true, isEditable: false}],
        [{isHeader: true, isIndex: true, isEditable: false}, 51, 52, 53, 54, 55, {isHeader: true, showActions: true, isEditable: false}],
      ]
    });
    return result;
  }
});
