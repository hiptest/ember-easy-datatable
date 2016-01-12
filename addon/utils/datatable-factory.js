import DatatableCell from "../models/datatable-cell";
import DatatableRow from "../models/datatable-row";
import Datatable from "../models/datatable";
import Ember from 'ember';

export default Ember.Object.create({
  makeHeaderRow: function(row) {
    var dtRow = this.makeRow(row);
    dtRow.get('cells').forEach(function (item) {
      item.set('isHeader', true);
    });

    return dtRow;
  },

  makeDatatable: function (data) {
    var self = this, datatable = data;
    if (data instanceof Array) {
      datatable = {
        headers: Ember.A(),
        body: Ember.A(data)
      };
    }

    var creationHash = {
      headers: self.makeHeaderRow(datatable.headers),
      body: Ember.A(datatable.body.map(function (row) {
        return self.makeRow(row);
      }))
    },
    copiedMethods = ['makeDefaultRow', 'makeDefaultColumn', 'validateCell'];

    copiedMethods.forEach(function (name) {
      if (Ember.isNone(data[name])) { return; }
      creationHash[name] = datatable[name];
    });

    return Datatable.create(creationHash);
  },

  makeRow: function(row) {
    var self = this;
    return DatatableRow.create({
      cells: Ember.A(row.map(function (item) {
        return self.makeCell(item);
      }))
    });
  },

  makeCell: function(value) {
    if (!(value instanceof Object)) {
      value = {value: value};
    }
    return DatatableCell.create(value);
  },

  makeListOf: function (size) {
    var list = Ember.A(), i;
    for (i = 0; i < size; i++) {
      list.push(null);
    }
    return list;
  },

  moveObject: function (list, from, to) {
    var moved = list[from];

    list.removeAt(from);
    list.insertAt(to, moved);
  }

});
