class TableModel {
  constructor(numCols=10, numRows=20) {
    this.numCols = numCols;
    this.numRows = numRows;
    this.data = {};
    this.sums = new Array(numCols);
  }

  _getCellId(location) {
    return `${location.col}:${location.row}`;
  }

  getValue(location) {
    return this.data[this._getCellId(location)];
  }

  setValue(location, value) {
    this.data[this._getCellId(location)] = value;
  }

  updateSum(col) {
    let array = [];
    let sum = 0;

    // compute sum filtering undefined values and strings, etc.
    for (let i = 0; i < this.numRows; i++) {
      const location = { col: col, row: i };
      let cellData = this.getValue(location);
      array.push(cellData);
    }

    console.log(array);

    this.sums[col] = sum;
    return sum;
  }
}

module.exports = TableModel;
