// main.js
const buttons = document.getElementsByClassName('button');
// const remove = document.getElementsByClassName('js-remove-button');
// const addbutton = document.getElementsByClassName('js-add-button');
// const randomizrbutton = document.querySelector('.js-randomizr');
const hex = [0,1,2,3,4,5,6,7,8,9, 'a', 'b', 'c', 'd', 'e', 'f'];//for randomizing colors

const randomcolor = function() {
  var color = [];
  //generate a random color for the randomizr
  for (var a = 0; a < buttons.length; a++) {

    for (var i = 0; i < 6; i++) {
      var ind = Math.floor(Math.random()*16);
      color.push(hex[ind]);
    }
    var newcolor = color.join("");
    newcolor.toString();
    color = []; //reset color for next random color
    buttons[a].style.background = "#" + newcolor; //set background to newly created random color
  }


};
