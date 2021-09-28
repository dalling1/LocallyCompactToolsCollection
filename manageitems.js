///////////////////////////////////////////////////////////////////////////////
function setupItems(){
 // add the items to the webpage
 var catalogue = document.getElementById("catalogue");
 for (var i=0;i<items.length;i++){
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

  newitem.onclick = function(){showItem(this.id)};
  // append it to the catalogue on the page
  catalogue.appendChild(newitem);
 }
}

///////////////////////////////////////////////////////////////////////////////
function showItem(id){
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
`+makeLinks('webpage',items[n].link)+`
`+makeLinks('paper',items[n].reference)+`
`+makeLinks('image',items[n].image)+`
`+makeLinks('video',items[n].video)+`
`+makeLinks('source',items[n].source)+`
 <p>${items[n].description}</p>`;
 detailsDiv.innerHTML = detailsText;
}

///////////////////////////////////////////////////////////////////////////////
function toggleLang(lang){
 if (['jp'].indexOf(lang)>-1){
  var L = document.querySelectorAll(':lang("'+lang+'")');
  for (var i=0;i<L.length;i++){
   if (L[i].classList.contains('hidden')){
    L[i].classList.remove('hidden');
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
 var tags = tagstring.split(',');
 for (var i=0;i<tags.length;i++){
  switch (tags[i]){
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
//console.log('requested type '+type);
//console.log(showIcons(type));
 var output = ``;
 if (datastring.length){
  var data = datastring.split(',');
  for (var i=0;i<data.length;i++){
   output += `<p><a class="detaillink" href="${data[i]}">`+showIcons(type)+data[i]+`</a></p>\n`;
  }
 }
 return output;
}
