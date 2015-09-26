function link(prev, next) {
  if (prev) {
    prev.next = next;
  }

  if (next) {
    next.prev = prev;
  }
}

export default class LinkedListNode {
  insertAfter(node) {
    link(node, this.next);
    link(this, node);
  }

  unlink() {
    link(this.prev, this.next);
    this.prev = undefined;
    this.next = undefined;
  }
}
