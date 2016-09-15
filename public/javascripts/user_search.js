// USER SEARCH FOR EDITORS

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

// USER SEARCH FOR PROFILES

function createFoundProfiles(userArray){
  $(".user-profiles").empty();
  console.log(userArray);

  userArray.forEach(user=>{
    var $profileNode = $('<div>')
      .addClass("user-profile")
      .attr("data-user-id", user.id);
    
    $("<h3>")
      .text(user.firstName + " " + user.lastName)
      .appendTo($profileNode);

    $("<p>")
      .text("(" + user.username + ")")  
      .appendTo($profileNode);

    $("<p>")
      .text("Preferred Language: Javascript")
      .appendTo($profileNode);  

    $profileNode.appendTo($(".user-profiles"));
  });
}

$('.search-user-profiles').on('keyup',function(e){
  var value = $(this).val() + '%';
  if(value === "%"){
  } else {
    $.ajax({
      url: '/api/users/profiles',
      method: 'get',
      data: {username: value},
      success: createFoundProfiles,
      error: function(){}
    });
  }
});

$('.block-users').on('click', '.user-profile' ,function(){
  var userId = $(this).data("userId")
  $('.block-profile').toggleClass('hidden');
  $.get({
    url: 'api/users/profile',
    data: {userId: userId},
    success: loadProfile
  });
});