let dataObj;
let selectedKeyword = '';

function getData() {
  var request = new XMLHttpRequest();
  request.open('GET', 'experience.json', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      sortData(data);
    } else {
      console.log('there was an error');

    }
  };

  request.onerror = function() {
    console.log('there was an error');
  };

  request.send();
}

function sortData(data) {
  let sorted = data.sort(function(a,b){
    a = a.completed.split('/');
    b = b.completed.split('/');
    return new Date(b[1], b[0], 1) - new Date(a[1], a[0], 1);
  });

  dataObj = sorted;
  createTableData();
}

function createTableData() {
  for(let i = 0; i < dataObj.length; i++) {
    let tableBody = document.querySelector('.table-body');
    if(matchKeyword(dataObj[i].tags) || selectedKeyword === '') {
        let tableRow = document.createElement('tr');
        let rowTitle = document.createElement('td');
        let rowType = document.createElement('td');
        let rowCompleted = document.createElement('td');
        let titleLink = document.createElement('a');
        
        tableBody.append(tableRow);
        tableRow.append(rowTitle);
        tableRow.append(rowType);
        tableRow.append(rowCompleted);
        rowTitle.append(titleLink);
        
        tableRow.setAttribute('class', 'table-row');
        rowTitle.setAttribute('class', 'row-title');
        titleLink.setAttribute('class', 'title-link');
        titleLink.setAttribute('href', dataObj[i].url);
        titleLink.setAttribute('target', '_blank');
        rowType.setAttribute('class', 'row-type');
        rowCompleted.setAttribute('class', 'row-completed');

        titleLink.textContent = dataObj[i].title;
        rowType.textContent = dataObj[i].type;
        rowCompleted.textContent = dataObj[i].completed;
      }
    }
}

function removeTableData() {
  const tableBody = document.querySelector('.table-body');

  while(tableBody.firstChild){
    tableBody.removeChild(tableBody.firstChild);
  }
}
  
function matchKeyword(tags) {
	let filteredTags = tags.filter(function(entry){
   return entry === selectedKeyword;
  });
  
  return filteredTags.length > 0 ? true : false;
}


// note - is there a more terse way to write this?
function handleClick(evt) {
  const selectedElem = evt.target;
  const gridAreaArr = Array.from(document.querySelector('.grids').children);

  if (selectedElem.classList.contains('selection')) {
    // if already selected change selected to all items
    if(selectedElem.classList.contains('selected')){
      selectedKeyword = '';
    } else {
        // remove current selected class
      for(let i = 0; i < gridAreaArr.length; i++) {
        for(let j = 0; j < gridAreaArr[i].children.length; j++) {
          if (gridAreaArr[i].children[j].classList.contains('selected')) {
            gridAreaArr[i].children[j].classList.toggle('selected');
          }
        }
      }
      selectedKeyword = selectedElem.textContent;
    }
    selectedElem.classList.toggle('selected');
  }

  removeTableData();
  createTableData();
}

const gridArea = document.querySelector('.grids');
gridArea.addEventListener('click', handleClick);

// kick off xhr
getData();