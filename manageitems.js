///////////////////////////////////////////////////////////////////////////////
function setupItems(){
 // sort them first
 items.sort(function(a,b){
  return a.name.localeCompare(b.name);
 });
 // add a hash code to identify items; use only the name, for now: if this changes, the hash will change
 items.map(x=>x.hash=(x.name).hashCode());

 // add the items to the webpage
 var catalogueDiv = document.getElementById("catalogue");
 for (var i=0;i<items.length;i++){
  // set an index for each item (to allow easy identification of the associated DOM entity)
  items[i].index = i+1;
  // make a div for this item
  var newitem = document.createElement('div');
  newitem.className = 'item';
  newitem.id = `item${i+1}`;
  newitem.draggable = true;
  newitem.setAttribute('data-hash',items[i].hash);
  newitem.ondragstart = function(){dragStart(event)};
  newitem.innerHTML = `\n <p class="itemnumber">Item ${i+1}</p>
 <p class="itemnumber hidden" lang="jp" >アイテム ${i+1}</p>
 <p class="itemname">${items[i].name}</p>\n`;
  // add icons if there are tags on this item
  if (items[i].hasOwnProperty('tags')){
   newitem.innerHTML += ` <div class="iconholder">`+showIcons(items[i].tags)+`</div>\n`;
  }
  // set the on-click behaviour to show the item details
  newitem.onclick = function(){showItemDetails(this.getAttribute('data-hash'))};
  // append it to the catalogue on the page
  catalogueDiv.appendChild(newitem);
  // build a look-up table to relate the hashes with the DOM elements' IDs
  if (typeof(hashtable)=='undefined') hashtable = []; // create the global variable if it does not exist
  hashtable[items[i].hash] = newitem.id;
 }


 // typeset the catalogue content
 if (typeof(MathJax)) MathJax.typesetPromise([catalogueDiv]);

 // test whether there is already a cookie, in which the user's item-viewing history
 // might be stored
 if (getHistory().length){
  showItemDetails(currentItem());
 } else {
  // if not, set it so that the page can remember which items have been displayed;
  // this is particularly useful if the user follows a link on an item and then
  // returns to this page: we can re-display the item that they had been looking at
  setHistory();
 }
}

///////////////////////////////////////////////////////////////////////////////
function showItemDetails(hash){
 if (hashtable[hash]!=undefined){
  var n = parseInt(hashtable[hash].replace("item","")); // the hashtable entry is an id like "item8"
  console.log("Showing details: "+items[n-1].name);
  showDetails(n-1);
  // store the items which the user views, so that we can recall them if requested
  // (or, for example, the user leaves the page and then returns later)
  addToHistory(hash);
  return true;
 } else {
  // no details for this item
  console.log("Showing details: "+n+" (no such item)");
  clearDetails();
  // nothing to add to the history
  return false;
 }
}

///////////////////////////////////////////////////////////////////////////////
function showDetails(n){
 var detailsDiv = document.getElementById("detailscontent");
 var detailsText = `
 <h2>${items[n].name}</h2>
`+makeLinks('creator',items[n].creator)+`
`+makeLinks('webpage',items[n].link)+`
`+makeLinks('paper',items[n].reference)+`
`+makeLinks('image',items[n].image)+`
`+makeLinks('video',items[n].video)+`
`+makeLinks('source',items[n].source)+`
 <p>${items[n].description}</p>
`;
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
 var detailsDiv = document.getElementById("detailscontent");
 detailsDiv.innerHTML = `     <p>Click on an item, or drag it into this box, to see its details.
     <span lang="jp" class="hidden">アイテムをクリックするか、このボックスにドラッグして詳細を表示します。</span></p>
`;
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
    output += ` <p style="margin:6px 0;">`+showIcons(type)+data[i]+`</p>\n`;
   } else {
    output += ` <p><a class="detaillink" href="${data[i]}">`+showIcons(type)+data[i]+`</a></p>\n`;
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

///////////////////////////////////////////////////////////////////////////////
// the usual drag functions
function dragStart(event) {
 event.dataTransfer.setData("Text", event.target.getAttribute("data-hash"));
}
function allowDrop(event) {
 event.preventDefault();
}
function drop(event) {
 event.preventDefault();
 var data = event.dataTransfer.getData("Text");
 showItemDetails(data);
}

///////////////////////////////////////////////////////////////////////////////
// function from https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

///////////////////////////////////////////////////////////////////////////////
function getHistory(){
 var crumb = getCookie('viewedItems');
 // avoid splitting the empty string, since that produces another empty string:
 if (crumb.length){
  var history = crumb.split(',');
 } else {
 // we actually want an empty array:
  history = [];
 }
 return history;
}
///////////////////////////////////////////////////////////////////////////////
function addToHistory(hash){
 if (hash != currentItem()){
  var history = getHistory();
  // insert the new item at the current position (plus one)
  // so first, remove any later history:
  history.splice(getHistoryPosition()+1);
  // and then add the new item to the end
  history.push(String(hash)); // add the item at the end, if it is not already there
  // and keep the history position up to date
  incPosition();
  // also make sure the history does not get too long (100 item limit)
  var maxHistoryLength = 100;
  while (history.length>maxHistoryLength) history.shift() // remove oldest entries
  // put the revised history into the cookie
  setHistory(history);
  return true;
 } else {
  return false;
 }
}
///////////////////////////////////////////////////////////////////////////////
function setHistory(history=''){
 if (history==''){
  // clear the history:
  var historystring = '';
  var historyposition = -1;
 } else {
  // make sure we have an array (in case a string or number is passed)
  if (typeof(history)=='string' || typeof(history)=='number') history = [history];
  // form a comma-separated string:
  var historystring = history.join(',');
  var historyposition = history.length-1; // set the last item in the list to be the current item
 }
 // put the history into the cookie: [update this if we set other cookies than viewedItems]
 document.cookie = `viewedItems=${historystring}; sameSite=Strict; path=/;`;
 document.cookie = `historyPosition=${historyposition}; sameSite=Strict; path=/;`;
}
///////////////////////////////////////////////////////////////////////////////
function clearHistory(){
 setHistory();
 clearDetails();
}
///////////////////////////////////////////////////////////////////////////////
function getHistoryPosition(){
 return parseInt(getCookie('historyPosition'));
}
///////////////////////////////////////////////////////////////////////////////
function currentItem(){
 var history = getHistory();
 var pos = getHistoryPosition();
 if (pos>-1){
  return history[pos];
 } else {
  return '';
 }
}
///////////////////////////////////////////////////////////////////////////////
function showCurrentItem(){
 showItemDetails(currentItem());
}
///////////////////////////////////////////////////////////////////////////////
function decPosition(){
 var pos = getHistoryPosition();
 var history = getHistory();
 if (history.length==0){
  pos = -1;
 } else if (pos>0){
  pos = pos-1;
 }
 document.cookie = `historyPosition=${pos}; sameSite=Strict; path=/;`;
}
///////////////////////////////////////////////////////////////////////////////
function incPosition(){
 var pos = getHistoryPosition();
 var history = getHistory();
 if (history.length==0){
  pos = -1;
 } else if (pos<(history.length-1)){
  pos = pos+1;
 }
 document.cookie = `historyPosition=${pos}; sameSite=Strict; path=/;`;
}

///////////////////////////////////////////////////////////////////////////////
function generateItem(){
 var formname = document.getElementById("formname").value;
 var formcreator = document.getElementById("formcreator").value;
 var formlink = document.getElementById("formlink").value;
 var formdescription = document.getElementById("formdescription").value;
 var formimage = document.getElementById("formimage").value;
 var formvideo = document.getElementById("formvideo").value;
 var formreference = document.getElementById("formreference").value;
 var formsource = document.getElementById("formsource").value;

 // check the tags
 var tagimage = document.getElementById("formtagimage").checked;
 var tagpaper = document.getElementById("formtagpaper").checked;
 var tagsource = document.getElementById("formtagsource").checked;
 var tagtool = document.getElementById("formtagtool").checked;
 var tagvideo = document.getElementById("formtagvideo").checked;
 var tagwebpage = document.getElementById("formtagwebpage").checked;

 // create a tags string
 var tagchoices = [];
 if (tagimage) tagchoices.push('image');
 if (tagpaper) tagchoices.push('paper');
 if (tagsource) tagchoices.push('source');
 if (tagtool) tagchoices.push('tool');
 if (tagvideo) tagchoices.push('video');
 if (tagwebpage) tagchoices.push('webpage');

 var tags = tagchoices.join(',');

 var newitem = `{
 'name': '${formname}',
 'creator': '${formcreator}',
 'link': '${formlink}',
 'description': '${formdescription}',
 'image': '${formimage}',
 'video': '${formvideo}',
 'reference': '${formreference}',
 'source': '${formsource}',
 'tags': '${tags}',
}`;
 // escape back-slashes (they are preserved on the form output, but need escaping for entering into items.js)
 newitem = newitem.replace('\\','\\\\');

 // show the output on the page
 document.getElementById("formoutput").innerHTML = newitem;
 document.getElementById("formoutput").rows = 12;

 // set it up for copying
 document.getElementById("formoutput").setAttribute("data-copy-text",newitem);
 // and enable the copy button
 document.getElementById("copyoutput").removeAttribute("disabled");
}

async function copyOutput(){
 // Modified from https://www.jasongaylord.com/blog/2020/05/21/copy-to-clipboard-using-javascript
 if (!navigator.clipboard) return;
 try {
  var copy_value = document.getElementById("formoutput").getAttribute("data-copy-text");
  await navigator.clipboard.writeText(copy_value);
  alert('Text copied successfully');
 } catch (error){
  console.error("copy failed", error);
 }
}

///////////////////////////////////////////////////////////////////////////////
// hash function for strings, by esmiralha: https://stackoverflow.com/a/7616484
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
