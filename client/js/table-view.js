const { getLetterRange } = require('./array-util');
const { removeChildren, createTR, createTH, createTD } = require('./dom-util');

class TableView {
  constructor(model) {
    this.model = model;
  }

  init() {
    this.initDomReferences();
    this.initCurrentCell();
    this.renderTable();
    this.attachEventHandlers();
  }

  initDomReferences() {
    this.headerRowEl = document.querySelector('THEAD TR');
    this.sheetBodyEl = document.querySelector('TBODY');
    this.formulaBarEl = document.querySelector('#formula-bar');
    this.footerRowEl = document.querySelector('TFOOT');
  }

  initCurrentCell() {
    this.currentCellLocation = { col: 0, row: 0 };
    this.renderFormulaBar();
  }

  normalizeValueForRendering(value) {
    return value || '';
  }

  renderFormulaBar() {
    const currentCellValue = this.model.getValue(this.currentCellLocation);
    this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
    this.formulaBarEl.focus();
  }

  renderTable() {
    this.renderTableHeader();
    this.renderTableBody();
    this.renderTableFooter();
    this.updateFooterSum();
  }

  renderTableHeader() {
    removeChildren(this.headerRowEl);
    getLetterRange('A', this.model.numCols)
      .map(colLable => createTH(colLable))
      .forEach(th => this.headerRowEl.appendChild(th));
  }

  isCurrentCell(col, row) {
    return this.currentCellLocation.col === col &&
           this.currentCellLocation.row === row;
  }

  renderTableBody() {
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < this.model.numRows; row++) {
      const tr = createTR();
      for (let col = 0; col < this.model.numCols; col++) {
        const position = { col: col, row: row };
        const value = this.model.getValue(position);
        const td = createTD(value);

        if (this.isCurrentCell(col, row)) {
          td.className = 'current-cell';
        }

        tr.appendChild(td);
      }

      fragment.appendChild(tr);
    }

    removeChildren(this.sheetBodyEl);
    this.sheetBodyEl.appendChild(fragment);
  }

  updateFooterSum(col) {
    const columnSums = [];
    for (let row = 0; row < this.model.numCols; row++) {
      columnSums.push(null);
    }

    for (let row = 0; row < this.model.numRows; row++) {
      for (let col = 0; col < this.model.numCols; col++) {
        const pos = { col: col, row: row };
        const val = this.model.getValue(pos);
        const num = parseInt(val);
        if (!isNaN(val)) {
          columnSums[col] += num;
        }
      }
    }

    return columnSums;
  }

  renderTableFooter() {
    const tr = createTR();
    for (let col = 0; col < this.model.numCols; col++) {
      const td = createTD();
      tr.appendChild(td);
    }

    removeChildren(this.footerRowEl);
    this.footerRowEl.appendChild(tr);

    let footTD = this.footerRowEl.querySelectorAll('TD');

    let sum = this.updateFooterSum();
    for (let i = 0; i < this.model.numCols; i++) {
      footTD[i].textContent = sum[i];
    }

    tr.className = 'sum-row';
  }

  attachEventHandlers() {
    this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
    this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
    this.formulaBarEl.addEventListener('keyup', this.renderTableFooter.bind(this));
  }

  handleFormulaBarChange(evt) {
    const value = this.formulaBarEl.value;
    this.model.setValue(this.currentCellLocation, value);
    this.renderTableBody();
  }

  handleSheetClick(evt) {
    const col = evt.target.cellIndex;
    const row = evt.target.parentElement.rowIndex - 1;

    this.currentCellLocation = { col: col, row: row };
    this.renderTableBody();
    this.renderFormulaBar();
  }

}

module.exports = TableView;
