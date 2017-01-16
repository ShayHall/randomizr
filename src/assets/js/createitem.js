const generators = document.getElementsByClassName('generator');
const remove = document.getElementsByClassName('js-remove-button');
const addbutton = document.getElementsByClassName('js-add-button');
const randomizrbutton = document.querySelector('.js-randomizr');
const list = document.getElementsByClassName('list');
const listinput = document.getElementsByClassName('list__input');

const createitem = function() {
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

      Array.from(remove).forEach(function(remove) {
        remove.addEventListener('click', function(){
          randomcolor();
          this.parentNode.remove();
        });
      });

    }
  }
  x.previousSibling.previousSibling.value = "";
};//createitem function


const triggercreateclick = function (e) {
  var x = this;
  this.nextSibling.nextSibling.addEventListener('click', createitem);
  e.preventDefault();
  if (e.keyCode == 13) {
    this.nextSibling.nextSibling.click();
  }
};

Array.from(generators).forEach(function(gen) {
  for ( var i = 0; i < gen.childNodes.length; i++) {
    var kidnode = gen.childNodes[i];
    if (kidnode.className && (kidnode.className.indexOf("js-add-button") >= 0)) {
      kidnode.addEventListener('click', createitem);
    }

    if (kidnode.className && kidnode.className.indexOf("list__input") >= 0) {
        kidnode.addEventListener('keyup', triggercreateclick);
    }

  }

});
