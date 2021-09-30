///////////////////////////////////////////////////////////////////////////////
function setupItems(){
 // add the items to the webpage
 var catalogueDiv = document.getElementById("catalogue");
 for (var i=0;i<items.length;i++){
  // set an index for each item (to allow easy identification of the associated DOM entity)
  items[i].index = i+1;
  // make a div for this item
  var newitem = document.createElement('div');
  newitem.className = 'item';
  newitem.id = `item${i+1}`;
  newitem.innerHTML = `\n <p class="itemnumber">Item ${i+1}</p>
 <p class="itemnumber hidden" lang="jp" >アイテム ${i+1}</p>
 <p class="itemname">${items[i].name}</p>\n`;
  // add icons if there are tags on this item
  if (items[i].hasOwnProperty('tags')){
   newitem.innerHTML += ` <div class="iconholder">`+showIcons(items[i].tags)+`</div>\n`;
  }
  // set the on-click behaviour to show the item details
  newitem.onclick = function(){showItemDetails(this.id)};
  // append it to the catalogue on the page
  catalogueDiv.appendChild(newitem);
 }

 // typeset the catalogue content
 if (typeof(MathJax)) MathJax.typesetPromise([catalogueDiv]);
}

///////////////////////////////////////////////////////////////////////////////
function showItemDetails(id){
 var n = parseInt(id.replace("item",""));
 if (n<=items.length){
  console.log("Clicked item: "+items[n-1].name);
  showDetails(n-1);
 } else {
  // no details for this item
  console.log("Clicked item "+n+" (no details available)");
  clearDetails();
 }
}

///////////////////////////////////////////////////////////////////////////////
function showDetails(n){
 var detailsDiv = document.getElementById("details");
 var detailsText = `<h2>${items[n].name}</h2>
`+makeLinks('creator',items[n].creator)+`
`+makeLinks('webpage',items[n].link)+`
`+makeLinks('paper',items[n].reference)+`
`+makeLinks('image',items[n].image)+`
`+makeLinks('video',items[n].video)+`
`+makeLinks('source',items[n].source)+`
 <p>${items[n].description}</p>`;
 detailsDiv.innerHTML = detailsText;

 // typeset the detail content
 if (typeof(MathJax)) MathJax.typesetPromise([detailsDiv]);

}

///////////////////////////////////////////////////////////////////////////////
function toggleLang(lang){
 if (['jp'].indexOf(lang)>-1){
  var L = document.querySelectorAll(':lang("'+lang+'")');
  document.getElementById('search').placeholder = 'search'; // reset placeholder
  for (var i=0;i<L.length;i++){
   if (L[i].classList.contains('hidden')){
    L[i].classList.remove('hidden');
    // if any 'jp' item is not hidden, update the search placeholder text
    document.getElementById('search').placeholder = 'search 捜索';
   } else {
    L[i].classList.add('hidden');
   }
  }
 }
}

///////////////////////////////////////////////////////////////////////////////
function toggleTag(tag=''){
 var allowedTags = ['image','paper','source','tool','video','webpage'];
 // only operate if a legal tag was given:
 if (allowedTags.indexOf(tag)>-1 || tag==''){
  for (var i=0;i<allowedTags.length;i++){
   // hide them all, or show all if tag=='':
   var T = document.getElementsByClassName('tag:'+allowedTags[i]);
   for (var t=0;t<T.length;t++){
    if (tag==''){
     T[t].parentElement.parentElement.classList.remove('shrink');
    } else {
     T[t].parentElement.parentElement.classList.add('shrink');
    }
   }
  }

  // and then show the requested tag:
  var T = document.getElementsByClassName('tag:'+tag);
  for (var t=0;t<T.length;t++){
   T[t].parentElement.parentElement.classList.remove('shrink');
  }
 }

}

///////////////////////////////////////////////////////////////////////////////
function clearDetails(){
 var detailsDiv = document.getElementById("details");
 detailsDiv.innerHTML = '';
}

///////////////////////////////////////////////////////////////////////////////
function showIcons(tagstring){
 // take a comma-separated string as input and return a string
 //  containing an icon img for each tag in the string
 var iconpath = 'icons/'; // should end in '/'
 var icons = [];
 var tags = tagstring.trim().split(new RegExp(/ *, */));
 for (var i=0;i<tags.length;i++){
  switch (tags[i]){
   case 'creator': icons.push('user.svg'); break;
   case 'creators': icons.push('users.svg'); break;
   case 'image': icons.push('image.svg'); break;
   case 'paper': icons.push('file-text.svg'); break;
   case 'source': icons.push('code.svg'); break;
   case 'tool': icons.push('tool.svg'); break;
   case 'video': icons.push('video.svg'); break;
   case 'webpage': icons.push('layout.svg'); break;
  }
 }
 // have the icon file names, so set up the HTML IMG code
 var img = '';
 for (var i=0;i<icons.length;i++){
  img += `<img class="tagicon tag:${tags[i]}" src="${iconpath}${icons[i]}" alt="${tags[i]}" title="${tags[i]}" />`;
 }

 return img;
}

///////////////////////////////////////////////////////////////////////////////
function makeLinks(type,datastring){
 // take a comma-separated string as input and return a string
 //  containing an image (according to the given type) and a P tag and
 //  hyperlink for each item in the string
 var output = ``;
 if (datastring.length){
  var data = datastring.trim().split(new RegExp(/ *, */));
  for (var i=0;i<data.length;i++){
   if (type=='creator'){
    output += `<p style="margin:6px 0;">`+showIcons(type)+data[i]+`</p>\n`;
   } else {
    output += `<p><a class="detaillink" href="${data[i]}">`+showIcons(type)+data[i]+`</a></p>\n`;
   }
  }
 }
 return output;
}

///////////////////////////////////////////////////////////////////////////////
function hideItem(itemnumber=-1){
 // only operate if a legal item number was given:
 if (itemnumber<=items.length){
  // hide all items if no argument is provided
  if (itemnumber==-1){
   for (var i=0;i<items.length;i++) hideItem(i+1);
  } else {
   document.getElementById('item'+itemnumber).classList.add('shrink');
  }
 }
}

///////////////////////////////////////////////////////////////////////////////
function showItem(itemnumber=-1){
 // only operate if a legal item number was given:
 if (itemnumber<=items.length){
  // show all items if no argument is provided
  if (itemnumber==-1){
   for (var i=0;i<items.length;i++) showItem(i+1);
  } else {
   document.getElementById('item'+itemnumber).classList.remove('shrink');
  }
 }
}


///////////////////////////////////////////////////////////////////////////////
function runSearch(){
 // get the search term and use it to filter the items;
 // could add OR functionality eg. using commas to separate search terms;
 // the showItems() approach is a little clunky -- could be replaced with a simple .classList.remove(...)
 var searchstring = document.getElementById('search').value.trim();
 var ignorecase = document.getElementById('searchcase').checked;
 var searchdetail = document.getElementById('searchdetail').checked;

 // filter if a non-zero-length string was given:
 if (searchstring.length){
  var search = searchstring.trim().split(new RegExp(/ *, */));
  // initially, hide all items
  hideItem();
  // filter the items by the search terms: (case-insensitive search)
  for (var i=0;i<search.length;i++){
   if (search[i].length){
    var matchingitems = items.filter(x=>x.name.search(new RegExp(search[i],(ignorecase?'i':'')))>-1)
    // should we also search in the details and creator? (what about links, etc.?)
    if (searchdetail){
     var morematchingitems = items.filter(x=>x.description.search(new RegExp(search[i],(ignorecase?'i':'')))>-1)
     matchingitems = matchingitems.concat(morematchingitems);
     var morematchingitems = items.filter(x=>x.creator.search(new RegExp(search[i],(ignorecase?'i':'')))>-1)
     matchingitems = matchingitems.concat(morematchingitems);
    }
    // show matching items
    for (var k=0;k<matchingitems.length;k++) showItem(matchingitems[k].index);
   }
  }
 } else {
  // otherwise, show everything:
  showItem();
 }
}
