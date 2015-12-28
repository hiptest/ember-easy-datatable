export function makeListOf(size) {
  var list = [], i;
  for (i = 0; i < size; i++) {
    list.push(null);
  }
  return list;
}

export function moveObject(list, from, to) {
  var moved = list[from];

  list.removeAt(from);
  list.insertAt(to, moved);
}
