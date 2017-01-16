'use strict';

var generators = document.getElementsByClassName('generator');
var remove = document.getElementsByClassName('js-remove-button');
var addbutton = document.getElementsByClassName('js-add-button');
var randomizrbutton = document.querySelector('.js-randomizr');
var list = document.getElementsByClassName('list');
var listinput = document.getElementsByClassName('list__input');

var createitem = function createitem() {
  randomcolor();

  var x = this;
  var y = x.previousSibling.previousSibling.value;
  var newlistitem, listtext, removebutton;
  for (var i = 0; i < generators.length; i++) {
    if (x.parentNode === generators[i]) {
      listtext = document.createElement('p');
      listtext.classList.add('list-text');
      listtext.innerHTML = y;

      removebutton = document.createElement('button');
      removebutton.classList.add('button', 'button--remove', 'js-remove-button');
      removebutton.style.background = "#fff";
      removebutton.style.border = "2px solid #000";
      removebutton.innerHTML = "Remove";

      newlistitem = document.createElement('li');
      newlistitem.classList.add('listitem');
      newlistitem.appendChild(listtext);
      newlistitem.appendChild(removebutton);

      list[i].appendChild(newlistitem);

      Array.from(remove).forEach(function (remove) {
        remove.addEventListener('click', function () {
          randomcolor();
          this.parentNode.remove();
        });
      });
    }
  }
  x.previousSibling.previousSibling.value = "";
}; //createitem function


var triggercreateclick = function triggercreateclick(e) {
  var x = this;
  this.nextSibling.nextSibling.addEventListener('click', createitem);
  e.preventDefault();
  if (e.keyCode == 13) {
    this.nextSibling.nextSibling.click();
  }
};

Array.from(generators).forEach(function (gen) {
  for (var i = 0; i < gen.childNodes.length; i++) {
    var kidnode = gen.childNodes[i];
    if (kidnode.className && kidnode.className.indexOf("js-add-button") >= 0) {
      kidnode.addEventListener('click', createitem);
    }

    if (kidnode.className && kidnode.className.indexOf("list__input") >= 0) {
      kidnode.addEventListener('keyup', triggercreateclick);
    }
  }
});

// main.js
var buttons = document.getElementsByClassName('button');
// const remove = document.getElementsByClassName('js-remove-button');
// const addbutton = document.getElementsByClassName('js-add-button');
// const randomizrbutton = document.querySelector('.js-randomizr');
var hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']; //for randomizing colors

var randomcolor = function randomcolor() {
  var color = [];
  //generate a random color for the randomizr
  for (var a = 0; a < buttons.length; a++) {

    for (var i = 0; i < 6; i++) {
      var ind = Math.floor(Math.random() * 16);
      color.push(hex[ind]);
    }
    var newcolor = color.join("");
    newcolor.toString();
    color = []; //reset color for next random color
    buttons[a].style.background = "#" + newcolor; //set background to newly created random color
  }
};

var randomizr = document.querySelector('.js-randomizr');
var results = document.querySelector('.results');

randomizr.addEventListener('click', function () {
  randomcolor();

  results.innerHTML = "This is a randomizr.  Add options for different parts of what you want to say to each column then hit the randomizer button to see the results!";
  var randomresult = "";
  var lastresult = "";
  //look at each list
  for (var i = 0; i < list.length; i++) {
    //check to see if there are any items in list
    if (list[i].children.length > 0) {
      //pick a randome item from the list
      var child = list[i].children;
      randomresult = child[Math.floor(Math.random() * child.length)].children[0].innerHTML;
      //add the item to the results
      results.innerHTML = lastresult + " " + randomresult;
      lastresult = results.innerHTML;
    }
  }
});
//# sourceMappingURL=../maps/app.es5.js.map
