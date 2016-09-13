$('.editorList').on('click', '.removeEditor', function(){
  var userId = $(this).data("userId");
  var $nodeParent = $(this).parent();
  $.ajax({
    url: 'api/documents/editors',
    method: 'delete',
    data: {userId: userId},
    success: function(){$nodeParent.remove()},
    error: function(){console.log("Couldn't delete user.")}
  })
});

$('.foundUsers').on('click', '.foundUser', function(){
  var userId = $(this).data("userId");
  $.post({
    url: 'api/documents/editors',
    data: {userId: userId},
    success: addUserNode,
    error: function(){console.log("Couldn't add user.")}
  })
});

$('.searchUsers').on('keyup',function(e){
  var value = $(this).val() + '%';
  if(value === "%"){
    $('.foundUsers').empty();
  } else {
    $.ajax({
      url: '/api/users',
      method: 'get',
      data: {username: value},
      success: function(data){
        createFoundUsers(data);
      },
      error: function(){}
    });
  }
});

function createFoundUsers(userArray){
  $('.foundUsers').empty();
  userArray.forEach(user=>{
    $('<li>')
      .addClass("foundUser")
      .attr("data-user-id", user.id)
      .text(user.username)
      .appendTo($('.foundUsers'));
  });
}