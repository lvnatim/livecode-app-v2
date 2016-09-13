$('.close-block-profile').on('click', function(){
  $('.block-profile').animate({"top":"100%", "bottom":"-100%"});
});

$(".documentTitle").on("keypress", function(e){
  var thisDoc = $(this);
  var docId = thisDoc.parent().data("live-code");
  var newTitle = thisDoc.html();
  if(e.keyCode === 13){
    e.preventDefault();
    thisDoc.next().focus();
    $.ajax({
      method: 'POST',
      url: '/profile/rename/',
      data: {
        docId: docId,
        newTitle: newTitle
      },
      success: function(data){
        console.log('Successfully posted');
        thisDoc.blur().next().focus();
        return false;
      }
    })
  }else{
    console.log("Nothing registered");
  }
});