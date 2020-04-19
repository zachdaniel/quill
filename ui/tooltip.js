class Tooltip {
  constructor(quill, boundsContainer, attachToBody) {
    this.quill = quill;
    this.boundsContainer = boundsContainer || document.body;
    this.attachToBody = attachToBody;
    if (this.attachToBody) {
      const parentDiv = document.createElement('div');
      parentDiv.classList.add('ql-bubble');
      document.body.appendChild(parentDiv);
      this.root = quill.addContainer('ql-tooltip', null, parentDiv);
    } else {
      this.root = quill.addContainer('ql-tooltip');
    }
    this.root.innerHTML = this.constructor.TEMPLATE;
    if (this.quill.root === this.quill.scrollingContainer) {
      this.quill.root.addEventListener('scroll', () => {
        this.root.style.marginTop = `${-1 * this.quill.root.scrollTop}px`;
      });
    }
    this.hide();
  }

  hide() {
    this.root.classList.add('ql-hidden');
  }

  position(reference) {
    let left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
    // root.scrollTop should be 0 if scrollContainer !== root
    let top = reference.bottom + this.quill.root.scrollTop;
    if (this.attachToBody) {
      const quillRootBounds = this.quill.root.getBoundingClientRect();
      left += quillRootBounds.left;
      top += window.scrollY + quillRootBounds.top;
    }
    this.root.style.left = `${left}px`;
    this.root.style.top = `${top}px`;
    this.root.classList.remove('ql-flip');
    const containerBounds = this.boundsContainer.getBoundingClientRect();
    const rootBounds = this.root.getBoundingClientRect();
    let shift = 0;
    if (rootBounds.right > containerBounds.right) {
      shift = containerBounds.right - rootBounds.right;
      this.root.style.left = `${left + shift}px`;
    }
    if (rootBounds.left < containerBounds.left) {
      shift = containerBounds.left - rootBounds.left;
      this.root.style.left = `${left + shift}px`;
    }
    if (rootBounds.bottom > containerBounds.bottom) {
      const height = rootBounds.bottom - rootBounds.top;
      const verticalShift = reference.bottom - reference.top + height;
      this.root.style.top = `${top - verticalShift}px`;
      this.root.classList.add('ql-flip');
    }
    return shift;
  }

  show() {
    this.root.classList.remove('ql-editing');
    this.root.classList.remove('ql-hidden');
  }
}

export default Tooltip;
