const randomizr = document.querySelector('.js-randomizr');
const results = document.querySelector('.results');


randomizr.addEventListener('click', function() {
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
      randomresult = child[Math.floor(Math.random()*child.length)].children[0].innerHTML;
      //add the item to the results
      results.innerHTML = (lastresult + " " + randomresult);
      lastresult = results.innerHTML;
    }
  }
});
