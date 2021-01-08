const canvasTable = document.querySelector('.canvas-table')
let numberOfRows = '';
const tableRowStr = `<tr class="canvas-row">
</tr>`;

for (let i = 0; i < 25; i++) {
  numberOfRows+=tableRowStr;
};

canvasTable.innerHTML = numberOfRows;
const canvasRows = document.querySelectorAll('.canvas-row');

let numberOfCells = '';
const tableCellStr = `<td class='canvas-cell'></td>
`;

for (let i = 0; i < 25; i++) {
  numberOfCells+=tableCellStr;
}

for (let row of canvasRows) {
  row.innerHTML = numberOfCells;
}
