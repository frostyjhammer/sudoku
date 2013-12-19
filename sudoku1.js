var focusedCell;
var badNumberHint = true;
$(document).ready(function(){
  $('.cell').on('click',       doClick);
  $('.cell').on('contextmenu', doRightClick);
  $('.cell').on('keydown',     doKeyDown);
  doTextSize('lrg');
  focusedCell = 0;
  doFocusCell(focusedCell);
});
function doKeyDown(event) {
  var cell = document.getElementById(focusedCell);
  var row = rowNo(cell);
  var col = colNo(cell);
  switch (event.keyCode) {
    case 8:  event.preventDefault(); doClearCell(); break;               // backspace
    case 46: event.preventDefault(); doClearCell(); break;               // delete
    case 37: col -= 1; if (col < 0) col = 8; doFocusRC(row,col); break;  // left-arrow
    case 38: row -= 1; if (row < 0) row = 8; doFocusRC(row,col); break;  // up-arrow
    case 39: col += 1; if (col > 8) col = 0; doFocusRC(row,col); break;  // right-arrow
    case 40: row += 1; if (row > 8) row = 0; doFocusRC(row,col); break;  // down-arrow
    case 67: doSolveCell();                                      break;  // 'C'ell (solve one cell)
    case 76: doLockCell();                                       break;  // 'L'ock (lock one cell)
    case 85: doUnLockCell();                                     break;  // 'U'nlock (lock one cell)
    default: 
      if (event.keyCode >= 48 && event.keyCode <= 57) {
        doNumber(event.keyCode - 48);
      } else if (event.keyCode >= 96 && event.keyCode <= 105) {
        doNumber(event.keyCode - 96);
      } else {
//      alert('doKeyDown('+event.keyCode+')'); 
        return true;
      }
  }
}
function doLockCell() {
  $('#'+focusedCell).addClass('locked');
  alert('locked '+focusedCell);
}
function doUnLockCell() {
  $('#'+focusedCell).removeClass('locked');
}
function doClearCell() {
  $('#'+focusedCell).text('');
  $('#'+focusedCell).removeClass('locked');
}
function doNumber(n) {
  if ($('#'+focusedCell).hasClass('locked')) return false;
  if (badNumberHint) { tryNumber(n) } else { putGoodNumber(n) }
}
function tryNumber(n) {
  if (testNumber(n)) { putGoodNumber(n) } else { putBadNumber(n) }
}
function putGoodNumber(n){
  $('#'+focusedCell).removeClass('warning');
  if (n == 0) {
    $('#'+focusedCell).text('');
  } else {
    $('#'+focusedCell).text(n);
    if (puzzleSolved()) alert('Congratulations!\n\nYou have solved\nthis sudoku puzzle.');
  }
}
function putBadNumber(n){
  $('#'+focusedCell).addClass('warning');
  $('#'+focusedCell).text(n);
}
function puzzleSolved() {
  for (i=0; i<=8; i++) { if (!goodNine('box',i)) return false; }
  for (i=0; i<=8; i++) { if (!goodNine('row',i)) return false; }
  for (i=0; i<=8; i++) { if (!goodNine('col',i)) return false; }
  return true;
}
function goodNine(typ, n) {
  var arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
  var x;
  $.each($('.'+typ+n), function(i, cell){
    x = $.inArray(parseInt(cell.innerText), arr);
    if (x > -1) {
      arr.splice(x,1);
    } else {
      return false;
    }
  });
  if (arr.length > 0) return false;
  return true;
}
function doFocusRC(row,col) {
  var cell = $('.row'+row+'.col'+col);
  cell.focus();
  focusedCell = cell.attr('id');
}
function doFocusCell(n) {
  $('#'+n).focus();
}
function doClick(event) {
  event.preventDefault();
//alert('doClick('+this.id+')');
  focusedCell = this.id;
  doFocusCell(focusedCell);
}
function doRightClick(event) {
  event.preventDefault();
  alert('doRightClick('+this.id+')');
}
function doTest1() {
  var cells = $('.cell');
  $.each(cells, function(i, cell){
    cell.innerHTML = cell.id+'<br><div style="font-weight: normal; font-size: xx-small;">b'+boxNo(cell)+' r'+rowNo(cell)+' c'+colNo(cell)+'</div>';
  });
  cells.removeClass('warning');
}
function doTest2() {
//initPuzzle('863471295217569483594382176379216548651948327428735961732654819145897632986123754');
  initPuzzle('803070295010560003590302006000000040601000307020000000700604019100097030986020704');
}
function initPuzzle(str) {
  $('.cell').removeClass('warning');
  var n;
  for (i=0; i<=80; i++) {
    n = str.substr(i,1);
    if (n >= 1 && n <= 9) { $('#'+i).text(n) } else { $('#'+i).text('') }
  }
  focusedCell = 0;
  doFocusCell(focusedCell);
}
function boxNo(cell) {
  return parseInt(cell.className.split(' ')[1].substr(3,2));
}
function rowNo(cell) {
  return parseInt(cell.className.split(' ')[2].substr(3,2));
}
function colNo(cell) {
  return parseInt(cell.className.split(' ')[3].substr(3,2));
}
function doTextSize(size) {
  var cells = $('.cell');
  switch (size) {
    case 'sml': cells.height(20); cells.width(20); cells.css('font-size', 14); break;
    case 'med': cells.height(30); cells.width(30); cells.css('font-size', 20); break;
    case 'lrg': cells.height(40); cells.width(40); cells.css('font-size', 30); break;
    default: return false;
  }
  return true;
}
function doReset() {
  var cells = $('.cell');
  cells.removeClass('warning');
  cells.removeClass('locked');
  cells.text('');
  doFocusCell(focusedCell);
}
function doPrint() {
  window.print();
}
function doSolveCell() {
  var cell = document.getElementById(focusedCell);
  if ($('#'+cell.id).hasClass('locked')) {return false}
  var n;
  var arr = new Array;
  for (i=1; i<=9; i++) { if (testNumber(i)) arr.push(i) }
  if (arr.length == 1) { return putGoodNumber(arr[0]) } else { return false }
}
function testNumber(n) {
  var cell = document.getElementById(focusedCell);
  var box = boxNo(cell);
  var row = rowNo(cell);
  var col = colNo(cell);
  var goodNumber = true;
  $.each($('.box'+box), function(i, cell){
    if (parseInt(cell.innerText) == n) { goodNumber = false; return false }
  });
  $.each($('.row'+row), function(i, cell){
    if (parseInt(cell.innerText) == n) { goodNumber = false; return false }
  });
  $.each($('.col'+col), function(i, cell){
    if (parseInt(cell.innerText) == n) { goodNumber = false; return false }
  });
  return goodNumber;
}
function doLock() {
  var cell;
  for (i=0; i<=80; i++) {
    cell = document.getElementById(i);
    if (parseInt(cell.innerText) >= 1) { $('#'+i).addClass('locked') }
  }
  doFocusCell(focusedCell);
}