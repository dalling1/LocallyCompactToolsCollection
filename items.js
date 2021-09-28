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
 `+(items[n].link.length?`<a href="${items[n].link}">${items[n].link}</a>`:``)+`
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
 if (['image','paper','tool','video','webpage'].indexOf(tag)>-1){
  var T = document.getElementsByClassName('tag:'+tag);
  for (var i=0;i<T.length;i++){
   if (T[i].parentElement.parentElement.classList.contains('shrink')){
    T[i].parentElement.parentElement.classList.remove('shrink');
   } else {
    T[i].parentElement.parentElement.classList.add('shrink');
   }
  }
 } else if (tag==''){
  var T = document.getElementsByClassName('shrink');
  for (var i=T.length;i>0;i--){
   T[i-1].classList.remove('shrink');
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
 // take a comma-separated string as input and return an array of
 //  strings containing an icon name for each tag
 var iconpath = 'icons/'; // should end in '/'

 var icons = [];
 var tags = tagstring.split(',');
 for (var i=0;i<tags.length;i++){
  switch (tags[i]){
   case 'image': icons.push('image.svg'); break;
   case 'paper': icons.push('file-text.svg'); break;
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
// define the items; we could add fields like tags, type, etc.
var items = [];
items[items.length] = {
 'name': 'Buildings Gallery',
 'link': 'https://buildings.gallery',
 'description': 'Some description should go here.',
 'image': '',
 'reference': 'https://arxiv.org/abs/2011.11707',
 'source': '',
 'tags': 'webpage',
};
///
items[items.length] = {
 'name': 'Tree Focus Models',
 'link': 'https://dalling1.github.io/focusmodels/',
 'description': 'Tools for drawing regular trees in layouts focusing on a vertex, edge or axis.  Also a tool for drawing monochromatic rays.',
 'image': '',
 'reference': '',
 'source': '',
 'tags': 'webpage,tool',
};
///
items[items.length] = {
 'name': 'Bruhat-Tits Tree Visualiser',
 'link': 'https://ariymarkowitz.github.io/Bruhat-Tits-Tree-Visualiser/',
 'description': 'A visualiser of the Bruhat-Tits tree over ℚp, and the action of GL(2, ℚp) on the tree.',
 'image': '',
 'reference': '',
 'source': '',
 'tags': 'webpage,tool',
};
///
items[items.length] = {
 'name': 'Free Products of Graphs',
 'link': 'https://dalling1.github.io/freeproductgraphs/',
 'description': 'Draws the free product of user-specified graphs.',
 'image': '',
 'reference': '',
 'source': 'https://github.com/dalling1/freeproductgraphs',
 'tags': 'webpage,tool',
};
///
items[items.length] = {
 'name': 'Label-Regular Trees',
 'link': 'https://dalling1.github.io/labelregulartrees/',
 'description': 'A tool to draw label-regular trees using a user-specified generating matrix.',
 'image': '',
 'reference': '',
 'source': 'https://github.com/dalling1/labelregulartrees',
 'tags': 'webpage,tool',
};
///
items[items.length] = {
 'name': 'Zero-Dimensional Symmetry Research Group',
 'link': 'https://zerodimensional.group/',
 'description': 'Home page of the Zero-Dimensional Symmetry research group, based at the University of Newcastle but with members across the globe.',
 'image': '',
 'reference': '',
 'source': '',
 'tags': 'webpage',
};
///
items[items.length] = {
 'name': 'Classification for certain automorphism groups of trees',
 'link': '',
 'description': 'Paper by Nicholas Radu entitled "A classification theorem for boundary 2-transitive automorphism groups of trees".',
 'image': '',
 'reference': 'https://dial.uclouvain.be/pr/boreal/object/boreal:182440',
 'source': '',
 'tags': 'paper',
};
///
items[items.length] = {
 'name': 'CARMA Spikeys',
 'link': 'https://carma.edu.au/art/img/carmaspikeys-2-03.jpg',
 'description': '3D rendering of a small building.',
 'image': '',
 'reference': '',
 'source': '',
 'tags': 'image',
};
///
items[items.length] = {
 'name': 'GAP package for universal groups',
 'link': 'https://gap-packages.github.io/',
 'description': 'UGALY is a GAP package that provides methods to create, analyse and find local actions of generalised universal groups acting on locally finite regular trees, following Burger-Mozes and Tornier.',
 'image': '',
 'reference': 'http://www.numdam.org/item/PMIHES_2000__92__113_0/, https://arxiv.org/abs/2002.09876, https://www.youtube.com/watch?v=MsoE450ZZtg',
 'source': 'https://github.com/gap-packages/UGALY',
 'tags': 'tool,paper,video',
}
///
items[items.length] = {
 'name': 'GAP package for self-replicating groups',
 'link': 'https://github.com/SamSGKing/SRGroups',
 'description': 'SRGroups is a GAP package for self-replicating groups in the sense of Horadam.',
 'image': '',
 'reference': 'https://nova.newcastle.edu.au/vital/access/manager/Repository/uon:17152, http://videos.birs.ca/2021/21w5151/202108191530-Tornier.mp4',
 'source': 'https://github.com/SamSGKing/SRGroups',
 'tags': 'tool,paper',
}
///
items[items.length] = {
 'name': 'TikZ/PSTricks templates for common graphs',
 'link': '',
 'description': 'A collection of TikZ and PSTricks snippets to include images of common graphs in LaTeX',
 'image': '',
 'reference': '',
 'source': '',
 'tags': 'tool',
}
