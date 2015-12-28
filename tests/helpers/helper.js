function getDatatableContent(component) {
  var datatable = [];

  component.find('tbody tr').each(function () {
    var row = [];
    $(this).find('td').each(function () {
      row.push($(this).text().trim());
    });
    datatable.push(row);
  });
  return datatable;
}

export default function assertDatatableContent (assert, component, table, message) {
	assert.deepEqual(getDatatableContent(component), table, message || 'The datatable content is correct');
}