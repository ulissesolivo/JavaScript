/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/* Exemplo de aplicação
 var grid2 = new TableGrid();
 grid2.setTitulo('Sorteios da mega sena');
 grid2.setColumnsType(['i', 'd', 'i', 'i', 'i', 'i', 'i', 'i', 's']);
 grid2.setColumnsFilter([0, 1, 2, 3, 4, 5, 6, 7]);
 grid2.setColumnsNoWrap([1, 8]);
 grid2.setColumnsWidth([40, 100, 20, 20, 20, 20, 20, 20, 100]);
 grid2.setColumnsTitle(['Sorteio', 'Data do sorteio', 'Dez1', 'Dez2', 'Dez3', 'Dez4', 'Dez5', 'Dez6', 'Nome']);
 grid2.setColumnsClass(['right', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'left']);
 grid2.setTable(document.getElementById('grid2'));
 grid2.init();
 */

function TableGrid() {

  /**
   * Table<br/>
   * Tag html tablegrid<br/><br/>
   * Setando a tabela ex:<br/>
   * setTable('tableId');
   */
  var table = 'undefined';

  var tableFilter = 'undefined';

  var titulo = '&nbsp;';
  /**
   * Cabeçalho da tabela<br/><br/>
   * Pode conter mais que uma TAG "thead", sendo que a última TAG
   * será usada para a ordenação das colunas.<br/><br/>
   * Exemplo de uso do cabeçalho:<br/>
   * <table border="1">
   *  <thead>
   *   <tr>
   *    <td colspan="3" align="center">Produto</td><td colspan="2">Qtd/Preço</td>
   *   </tr>
   *  </thead>
   *  <thead>
   *   <tr>
   *    <td>Código</td><td>Produto</td><td>Data</td><td>Qtd</td><td>Preço</td>
   *   </tr>
   *  </thead>
   *  <tbody>
   *   <td>001</td><td>Arroz</td><td>12/05/2010</td><td>2</td><td>1.56</td>
   *  </tbody>
   * </table>
   */
  var head = 'undefined';

  /**
   * Título das colunas<br/><br/>
   * Definindo os títulos ex:<br/>
   * setColumnsType(['Código','Produto','Data','Qtd','Valor'])
   */
  var columnsTitle = [];

  /**
   * Array contendo os tipos dos dados das colunas<br/>
   * Tipos:<br/>
   * s = String<br/>
   * i = Integer<br/>
   * f = Decimal</br/>
   * h = Hora</br>
   * d = Data<br/><br/>
   * Definindo os tipos de dados ex:<br/>
   * setColumnsType(['i','s','d','h','i','f']);
   */
  var columnsType = [];

  /**
   * Array com as classes de cada coluna
   */
  var columnsClass = [];

  /**
   * Array contendo o indice das das colunas que farão parte do filtro
   */
  var columnsFilter = [];

  /**
   * Array contendo a largura das colunas em pixels
   */
  var columnsWidth = [];

  /**
   * Array contendo as colunas que não devem conter quebra de linha
   */
  var columnsNoWrap = [];

  /*
   * Rodapé<br/><br/>
   * Texto ou HTML<br/><br/>
   * setFoot('Lista de produtos');
   */
  var foot = 'undefined';



  /*
   * Conteúdo de dados da tabela, linhas da TableGrid
   * <tbody>
   *  <tr>
   *   <td>Linha 1 Valor 1</td><td>Linha 1 Valor 2</td>
   *  </tr>
   *  <tr>
   *   <td>Linha 2 Valor 1</td><td>Linha 2 Valor 2</td>
   *  </tr>
   * </tbody>
   */
  var body = 'undefined';

  /*
   * Mensagem de erro
   */
  var errorinfo = '';

  var getHead = function() {
    return head;
  }

  var getCellsHead = function() {
    if (!head) {
      return 'undefined';
    } else {
      if (head.getElementsByTagName('tr').length > 0) {
        return head.getElementsByTagName('tr')[head.getElementsByTagName('tr').length - 1].getElementsByTagName('th');
      } else {
        return 'undefined';
      }
    }
  }

  var getBody = function() {
    return body;
  }

  var getRows = function() {
    if (!body) {
      return 'undefined';
    } else {
      if (body.getElementsByTagName('tr').length > 0) {
        return body.getElementsByTagName('tr');
      } else {
        return 'undefined';
      }
    }
  }

  var getFoot = function() {
    return foot;
  }

  var prepareHead = function() {
    if (table) {
      if (!head) {
        head = document.createElement('thead');
        table.appendChild(head);
      }
      cols = getCellsHead();
      if (cols == 'undefined') {
        tr = document.createElement('tr');
        for (i = 0; i < columnsTitle.length; i++) {
          th = document.createElement('th');
          tr.appendChild(th);
        }
        head.appendChild(tr);
      }
      cols = getCellsHead();
      if (columnsTitle.length > 0) {
        for (i = 0; i < columnsTitle.length; i++) {
          cols[i].innerHTML = columnsTitle[i];
        }
      } else {
        for (i = 0; i < cols.length; i++) {
          columnsTitle[i] = cols[i].innerHTML;
        }
      }
      for (i = 0; i < cols.length; i++) {
        cols[i].innerHTML = cols[i].innerHTML
                + "<span class=\"icon\" id=\"" + table.id + "icon" + i + "\"></span>";
        cols[i].onmouseup = new Function(table.id + '.columnSort(' + i + ')');
      }
      if ((titulo != '&nbsp;') || (columnsFilter.length > 0)) {
        td = document.createElement('td');
        td.colSpan = cols.length;
        if (titulo != '&nbsp;') {
          td.innerHTML = titulo;
        }
        if (columnsFilter.length > 0) {
          td.innerHTML = td.innerHTML +
                  '&nbsp;&nbsp;<span class="spFiltro" onclick="setVisibleObject(\'' +
                  table.id + 'filter\', \'visible\');">Filtro</span><br/>';
          td.appendChild(prepareFilter());
        }
        td.className = 'tableGridTitulo';
        tr = document.createElement('tr');
        tr.appendChild(td);
        head.insertBefore(tr, head.getElementsByTagName('tr')[0]);
      }
      setColumnsSize();
    }
  }

  var prepareFilter = function() {
    tableFilter = document.createElement('table');
    tableFilter.className = 'tbFilter';
    tableFilter.id = table.id + 'filter';
    trf0 = document.createElement('tr');
    tdf0 = document.createElement('td');
    tdf0.className = 'left';
    tdf0.innerHTML = 'Informe os parâmetros de filtro';
    tdf0.colSpan = 3;
    trf0.appendChild(tdf0);
    tdf1 = document.createElement('th');
    tdf1.className = 'right';
    tdf1.innerHTML = '<div class="spFiltro" onclick="setVisibleObject(\'' +
            tableFilter.id + '\', \'hidden\');">Fechar</div>';
    trf0.appendChild(tdf1);
    he = document.createElement('thead');
    he.appendChild(trf0);
    tableFilter.appendChild(he);
    bod = document.createElement('tbody');
    for (i = 0; i < columnsFilter.length; i++) {
      trf = document.createElement('tr');
      // coluna 1
      tdf1 = document.createElement('td');
      if (columnsTitle[columnsFilter[i]]) {
        tdf1.innerHTML = columnsTitle[columnsFilter[i]];
      } else {
        tdf1.innerHTML = 'Coluna ' + i;
      }
      tdf1.className = 'right';
      tdf1.nowrap = 'nowrap';
      trf.appendChild(tdf1);
      // coluna 2
      tdf2 = document.createElement('td');
      input = document.createElement('input');
      input.className = 'filterInput';
      input.id = table.id + '_par1_col' + columnsFilter[i];
      if (columnsType[columnsFilter[i]] == 's') {
        tdf2.colSpan = 3;
        input.style.width = '98%';
      }
      tdf2.appendChild(input);
      trf.appendChild(tdf2);
      if (columnsType[columnsFilter[i]] != 's') {
        // coluna 3
        tdf3 = document.createElement('td');
        tdf3.innerHTML = 'até';
        tdf3.className = 'center';
        trf.appendChild(tdf3);
        // coluna 4
        tdf4 = document.createElement('td');
        input = document.createElement('input');
        input.className = 'filterInput';
        input.id = table.id + '_par2_col' + columnsFilter[i];
        tdf4.appendChild(input);
        trf.appendChild(tdf4);
      }
      bod.appendChild(trf)
      tableFilter.appendChild(bod);
    }
    fot = document.createElement('tfoot');
    ftr = document.createElement('tr');
    ftd = document.createElement('td');
    ftd.colSpan = 3;
    ftd.innerHTML = '&nbsp;';
    ftr.appendChild(ftd);
    fth = document.createElement('th');
    fth.className = 'right';
    fth.innerHTML = '<div class="spFiltro" onclick="' + table.id + '.rowsFilter();">Filtrar</div>';
    ftr.appendChild(fth);
    fot.appendChild(ftr);
    tableFilter.appendChild(fot);
    spt = document.createElement('span');
    spt.appendChild(tableFilter);
    return spt;
  }

  var setColumnsSize = function() {
    if (head) {
      cols = getCellsHead();
      if (cols != 'undefined') {
        for (i = 0; i < cols.length; i++) {
          if (columnsWidth.length <= i) {
            break;
          }
          if (columnsWidth[i] > 0) {
            cols[i].width = columnsWidth[i];
          }
        }
      }
    }
  }

  var prepareBody = function() {
    if (body) {
      var rows = body.getElementsByTagName('tr');
      if (rows != 'undefined') {
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var cols = row.getElementsByTagName('td');
          for (var j = 0; j < cols.length; j++) {
            cols[j].className = columnsClass[j];
          }
          for (var l = 0; l < columnsNoWrap.length; l++) {
            cols[columnsNoWrap[l]].noWrap = true;
          }
          row.onmouseup = new Function(table.id + '.rowSelect(this)');
        }
        rowsSetColor();
        setTextToFoot('Exibindo ' + rows.length + ' de ' + rows.length + ' registros');
      }
    }
  }

  var setTextToFoot = function(text) {
    if (table) {
      if (!foot) {
        foot = document.createElement('tfoot');
        table.appendChild(foot);
      }
      td = 'undefined';
      rows = foot.getElementsByTagName('tr');
      if (rows.length > 0) {
        for (i = 0; i < rows.length; i++) {
          cols = rows[i].getElementsByTagName('td');
          if (cols[0].colSpan == getCellsHead().length) {
            td = cols[0];
          }
        }
      }
      if (td == 'undefined') {
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.colSpan = getCellsHead().length;
        tr.appendChild(td);
        foot.appendChild(tr);
      }
      td.innerHTML = text;
    }
  }

  var rowsSetColor = function() {
    if (body) {
      rows = getRows();
      if (rows != 'undefined') {
        line = 0;
        for (i = 0; i < rows.length; i++) {
          row = rows[i];
          if (row.style.display != 'none') {
            line++;
            if (row.className != styleClass[3]) {
              if (line % 2 == 0) {
                row.className = styleClass[1];
              } else {
                row.className = styleClass[2];
              }
            }
          }
        }
      }
    }
  }

  this.rowsFilter = function() {
    rows = body.getElementsByTagName('tr');
    if ((rows != 'undefined') && (rows.length > 0)) {
      filtered = 0;
      for (i = 0; i < rows.length; i++) {
        display = '';
        cols = rows[i].getElementsByTagName('td');
        for (j = 0; j < columnsFilter.length; j++) {
          value = cols[columnsFilter[j]].innerHTML;
          param1 = document.getElementById(table.id + '_par1_col' + columnsFilter[j]).value;
          param2 = '';
          if (columnsType[columnsFilter[j]] != 's') {
            param2 = document.getElementById(table.id + '_par2_col' + columnsFilter[j]).value;
          }
          if (columnsType[columnsFilter[j]] == 's') {
            if (value.toLowerCase().indexOf(param1.toLowerCase()) < 0) {
              display = 'none';
            }
          } else {
            if ((param1 != '') && (param2 != '')) {
              if (!(!(isMaior(param1, value, columnsFilter[j])) &&
                      !(isMaior(value, param2, columnsFilter[j])))) {
                display = 'none';
              }
            } else if (param1 != '') {
              if (isMaior(param1, value, columnsFilter[j])) {
                display = 'none';
              }
            } else if (param2 != '') {
              if (isMaior(value, param2, columnsFilter[j])) {
                display = 'none';
              }
            }
          }
          rows[i].style.display = display;
        }
        if (display == '') {
          filtered++;
        }
      }
      setTextToFoot('Encontrado ' + filtered + ' em ' + rows.length + ' registros');
      rowsSetColor();
    }
  }

  /**
   * Array com os estyles class das linhas do grid<br/><br/>
   * styleClass = ['classTable', 'classRow1', 'classRow2', 'classRowSelected', 'classRowOver'];<br/>
   */
  var styleClass = ['tableGrid', 'tableGridRow1', 'tableGridRow2', 'tableGridRowSelected', 'tableGridRowOver'];
  var rowSelected = null;
  var rowSelectedOldClass = null;
  this.rowSelect = function(row) {
    if (rowSelected != null) {
      rowSelected.className = rowSelectedOldClass;
    }
    if (rowSelected == row) {
      rowSelectedOldClass = null;
      rowSelected = null;
    } else {
      rowSelectedOldClass = row.className;
      row.className = styleClass[3];
      rowSelected = row;
    }
  }

  this.init = function() {
    // if (tableElement){
    //   this.setTable(tableElement);
    // }
    head = table.getElementsByTagName('thead')[0];
    if (!head) {
      table.appendChild(document.createElement('thead'));
      head = table.getElementsByTagName('thead')[0];
    }
    head.id = table.id + 'head';
    body = table.getElementsByTagName('tbody')[0];
    if (!body) {
      table.appendChild(document.createElement('tbody'));
      body = table.getElementsByTagName('tbody')[0];
    }
    body.id = table.id + 'body';
    foot = table.getElementsByTagName('tfoot')[0];
    if (!foot) {
      table.appendChild(document.createElement('tfoot'));
      foot = table.getElementsByTagName('tfoot')[0];
    }
    foot.id = table.id + 'foot';
    prepareHead();
    prepareBody();

  }

  this.setTable = function(tableElement) {
    table = tableElement;
    table.cellPadding = 0;
    table.cellSpacing = 0;
    table.className = styleClass[0];

  }

  this.setColumnsTitle = function(arrayTitles) {
    columnsTitle = arrayTitles;
  }

  /**
   * Array contendo os tipos dos dados das colunas<br/>
   * Tipos:<br/>
   * s = String<br/>
   * i = Integer<br/>
   * f = Decimal</br/>
   * h = Hora</br>
   * d = Data<br/><br/>
   * Definindo os tipos de dados ex:<br/>
   * setColumnsType(['i','s','d','h','i','f']);
   */
  this.setColumnsType = function(arrayTypes) {
    columnsType = arrayTypes;
  }

  this.setColumnsFilter = function(arrayColumnsIndex) {
    columnsFilter = arrayColumnsIndex;
  }

  this.setColumnsWidth = function(arrayWidth) {
    columnsWidth = arrayWidth;
  }

  this.setColumnsClass = function(arrayClass) {
    columnsClass = arrayClass;
  }

  this.setTitulo = function(string) {
    titulo = string;
  }

  this.setColumnsNoWrap = function(arrayColumnsIndex) {
    columnsNoWrap = arrayColumnsIndex;
  }

  var columnsLength = function() {
    cols = getCellsHead();
    if (cols != 'undefined') {
      return cols.length;
    } else {
      return 0;
    }
  }

  this.rowsLength = function() {
    rows = getRows();
    if (rows != 'undefined') {
      return rows.length;
    } else {
      return 0;
    }
  }

  this.rowIndex = function() {
    index = -1;
    rows = getRows();
    if ((rows != 'undefined') && (rows.length > 0)) {
      for (i = 0; i < rows.length; i++) {
        if (rows[i].className == styleClass[3]) {
          index = i;
        }
      }
    }
    return index;
  }

  var columnOrdened = -1;
  this.columnSort = function(column) {
    rows = getRows();
    if ((rows != 'undefined') && (rows.length > 0)) {
      if (columnOrdened == column) {
        for (i = 0; i < rows.length; i++) {
          body.insertBefore(rows[i], rows[0]);
        }
      } else {
        for (i = 0; i < rows.length; i++) {
          if (i > 0) {
            compareValue(rows, rows[i], i - 1, column);
          }
        }
      }
      rowsSetColor();
      setDiretionImgOrder(column);
    }
  }

  function compareValue(rows, row, i, column) {
    if ((rows[i].getElementsByTagName('td')[column]) && (row.getElementsByTagName('td')[column])) {
      if (isMaior(rows[i].getElementsByTagName('td')[column].innerHTML,
              row.getElementsByTagName('td')[column].innerHTML, column)) {
        if (i > 0) {
          compareValue(rows, row, i - 1, column);
        } else {
          body.insertBefore(row, rows[i]);
        }
      } else {
        body.insertBefore(row, rows[i + 1]);
      }
    }
  }

  function isMaior(value1, value2, column) {
    maior = false;
    if (columnsType[column] == 'i') { // inteiro
      maior = (parseInt(value1.replace('.', '', 'g'), 10) >
              parseInt(value2.replace('.', '', 'g'), 10));
    } else if (columnsType[column] == 'f') { // decimal
      maior = (parseFloat(value1.replace('.', '', 'g').replace(',', '.', 'g')) >
              parseFloat(value2.replace('.', '', 'g').replace(',', '.', 'g')));
    } else if (columnsType[column] == 's') { // texto
      maior = (value1.toLowerCase() > value2.toLowerCase());
    } else if (columnsType[column] == 'h') { // hora
      da = value1.split(':', 3);
      di = value2.split(':', 3);
      if (da.length == 1)
        da = [da[0], 0, 0];
      else if (da.length == 2)
        da = [da[0], da[1], 0];
      if (di.length == 1)
        di = [di[0], 0, 0];
      else if (di.length == 2)
        di = [di[0], di[1], 0];
      maior = (Date.UTC(0, 0, 0, da[0], da[1], da[2], 0) >
              Date.UTC(0, 0, 0, di[0], di[1], di[2], 0));
    } else if (columnsType[column] == 'd') { // data ou data e hora
      da = (value1.replace(/[^0-9]/g, ' ')).split(' ');
      di = (value2.replace(/[^0-9]/g, ' ')).split(' ');
      if ((da.length == 1) || (di.length == 1)) {
        maior = (value1 > value2);
      } else {
        if (di.length == 2) {
          if (di[0].length < 3) // formato mm/yyyy
            di = [di[1], di[0], 1, 0, 0, 0, 0];
          else
            di = [di[0], di[1], 1, 0, 0, 0, 0];
        } else if (di.length == 3) {
          di = [di[2], di[1], di[0], 0, 0, 0, 0];
        } else if (di.length == 4) {
          di = [di[2], di[1], di[0], di[3], 0, 0, 0];
        } else if (di.length == 5) {
          di = [di[2], di[1], di[0], di[3], di[4], 0, 0];
        } else if (di.length == 6) {
          di = [di[2], di[1], di[0], di[3], di[4], di[5], 0];
        } else if (di.length == 7) {
          di = [di[2], di[1], di[0], di[3], di[4], di[5], di[6]];
        } else {
          di = value1;
        }
        if (da.length == 2) {
          if (da[0].length < 3) // formato mm/yyyy
            da = [da[1], da[0], 1, 0, 0, 0, 0];
          else
            da = [da[0], da[1], 1, 0, 0, 0, 0];
        } else if (da.length == 3) {
          da = [da[2], da[1], da[0], 0, 0, 0, 0];
        } else if (da.length == 4) {
          da = [da[2], da[1], da[0], da[3], 0, 0, 0];
        } else if (da.length == 5) {
          da = [da[2], da[1], da[0], da[3], da[4], 0, 0];
        } else if (da.length == 6) {
          da = [da[2], da[1], da[0], da[3], da[4], da[5], 0];
        } else if (da.length == 7) {
          da = [da[2], da[1], da[0], da[3], da[4], da[5], da[6]];
        } else {
          da = value2;
        }
        if (da[0].length < 3) // formato dd/mm/yyyy
          maior = (Date.UTC(da[2], da[1], da[0], da[3], da[4], da[5], da[6]) >
                  Date.UTC(di[2], di[1], di[0], di[3], di[4], di[5], di[6]));
        else
          maior = (Date.UTC(da[0], da[1], da[2], da[3], da[4], da[5], da[6]) >
                  Date.UTC(di[0], di[1], di[2], di[3], di[4], di[5], di[6]));
      }
    }
    return maior;
  }

  //var icons = new Array ("\u2193", "\u2191");
  function setDiretionImgOrder(col) {
    if (columnOrdened > -1) {
      ico = document.getElementById(table.id + 'icon' + columnOrdened);
      if (columnOrdened == col) {
        (ico.innerHTML == "\u2193") ? ico.innerHTML = "\u2191" : ico.innerHTML = "\u2193";
        //(ico.innerHTML == "v") ? ico.innerHTML = "^" : ico.innerHTML = "v";
      } else {
        ico.innerHTML = "";
        ico = document.getElementById(table.id + 'icon' + col);
        ico.innerHTML = "\u2193";
        //ico.innerHTML = "v";
      }
    } else {
      ico = document.getElementById(table.id + 'icon' + col);
      ico.innerHTML = "\u2193";
      //ico.innerHTML = "v";
    }
    columnOrdened = col;
  }

}

function fecha(i, v) {
  setVisibleObject(i, v);
}

function setVisibleObject(objectId, visible) {
  o = document.getElementById(objectId);
  if (visible) {
    o.style.visibility = visible;
  } else {
    if (o.style.visibility == 'visible') {
      o.style.visibility = 'hidden';
    } else {
      o.style.visibility = 'visible';
    }
  }
}

function eventAdd(obj, type, fn) {
  if (obj.attachEvent) {
    obj['e' + type + fn] = fn;
    obj[type + fn] = function() {
      obj['e' + type + fn](window.event);
    }
    obj.attachEvent('on' + type, obj[type + fn]);
  } else
    obj.addEventListener(type, fn, false);
}
function eventRemove(obj, type, fn) {
  if (obj.detachEvent) {
    obj.detachEvent('on' + type, obj[type + fn]);
    obj[type + fn] = null;
  } else
    obj.removeEventListener(type, fn, false);
}
