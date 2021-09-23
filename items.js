///////////////////////////////////////////////////////////////////////////////
function setupItems(){
 // add the items to the webpage
 var catalogue = document.getElementById("catalogue");
 for (var i=0;i<items.length;i++){
  // make a div for this item
  var newitem = document.createElement('div');
  newitem.classList.add("item");
  newitem.id = `item${i+1}`;
  newitem.innerHTML = `<p class="itemnumber">Item ${i+1}</p><p class="itemnumber" lang="jp">アイテム ${i+1}</p>
<p class="itemname">${items[i].name}</p>`;
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
function clearDetails(){
 var detailsDiv = document.getElementById("details");
 detailsDiv.innerHTML = '';
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
};
///
items[items.length] = {
 'name': 'Tree Focus Models',
 'link': 'https://https://dalling1.github.io/focusmodels/',
 'description': 'Tools for drawing regular trees in layouts focusing on a vertex, edge or axis.  Also a tool for drawing monochromatic rays.',
 'image': '',
 'reference': '',
 'source': '',
};
///
items[items.length] = {
 'name': 'Bruhat-Tits Tree Visualiser',
 'link': 'https://ariymarkowitz.github.io/Bruhat-Tits-Tree-Visualiser/',
 'description': 'A visualiser of the Bruhat-Tits tree over ℚp, and the action of GL(2, ℚp) on the tree.',
 'image': '',
 'reference': '',
 'source': '',
};
///
items[items.length] = {
 'name': 'Free Products of Graphs',
 'link': 'https://dalling1.github.io/freeproductgraphs/',
 'description': 'Draws the free product of user-specified graphs.',
 'image': '',
 'reference': '',
 'source': 'https://github.com/dalling1/freeproductgraphs',
};
///
items[items.length] = {
 'name': 'Label-Regular Trees',
 'link': 'https://dalling1.github.io/labelregulartrees/',
 'description': 'A tool to draw label-regular trees using a user-specified generating matrix.',
 'image': '',
 'reference': '',
 'source': 'https://github.com/dalling1/labelregulartrees',
};
///
items[items.length] = {
 'name': 'Zero-Dimensional Symmetry Research Group',
 'link': 'https://zerodimensional.group/',
 'description': 'Home page of the Zero-Dimensional Symmetry research group, based at the University of Newcastle but with members across the globe.',
 'image': '',
 'reference': '',
 'source': '',
};
///
items[items.length] = {
 'name': 'Classification for certain automorphism groups of trees',
 'link': '',
 'description': 'Paper by Nicholas Radu entitled "A classification theorem for boundary 2-transitive automorphism groups of trees".',
 'image': '',
 'reference': 'https://dial.uclouvain.be/pr/boreal/object/boreal:182440',
 'source': '',
};
///
items[items.length] = {
 'name': 'CARMA Spikeys',
 'link': 'https://carma.edu.au/art/img/carmaspikeys-2-03.jpg',
 'description': '3D rendering of a small building.',
 'image': '',
 'reference': '',
 'source': '',
};
