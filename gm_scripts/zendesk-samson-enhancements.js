// ==UserScript==
// @name     Zendesk Samson enhancements
// @version  1
// @grant    none
// @include  https://samson.zende.sk/*
// ==/UserScript==

(() => {
  
  const isAnnotatedAttribute = 'data-is-annotated';
  const lastFilterAttribute = 'data-last-filter';
  
  const textMatchesTerms = (text, terms) => {
    return terms.every(term => text.indexOf(term) >= 0);
  };
  
  const applyTableFilter = (table, searchText) => {
    try {
      const normalisedQuery = searchText.trim().replace(/\s+/g, ' ');    
      if (table.getAttribute(lastFilterAttribute) === normalisedQuery) return;

      const terms = normalisedQuery.split(' ');
      const rows = document.evaluate('.//tr[./td]', table, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
      
      for (var i=0; i<rows.snapshotLength; ++i) {
        const row = rows.snapshotItem(i);
        const matches = textMatchesTerms(row.innerText, terms);
        row.style.display = (matches ? 'table-row' : 'none');      
      }

      table.setAttribute(lastFilterAttribute, normalisedQuery);   
    } catch (e) {
      console.log (e);
    }
  };
  
  const annotateTable = (table) => {
    if (table.getAttribute(isAnnotatedAttribute)) return;
    
    const p = document.createElement('p');
    const label = document.createTextNode("Search table: ");
    const textInput = document.createElement('input', {type: 'text'});
    p.appendChild(label);
    p.appendChild(textInput);
    table.parentNode.insertBefore(p, table);
    
    textInput.addEventListener('keyup', () => {
      applyTableFilter(table, textInput.value);
    });
    
    table.setAttribute(isAnnotatedAttribute, 'true');
  };
  
  const addTableFilters = () => {
    const tables = document.evaluate('//table', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
    for (var i=0; i<tables.snapshotLength; ++i) {
      annotateTable(tables.snapshotItem(i));
    }
  };
  
  window.setInterval(addTableFilters, 1000);

})();
