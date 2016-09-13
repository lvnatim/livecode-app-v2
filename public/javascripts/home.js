var editor = ace.edit("hero-editor");
editor.setTheme("ace/theme/terminal");
editor.getSession().setMode("ace/mode/javascript");
editor.setOptions({
  fontSize: "18pt"
});

$('body').on('click', function(){
  $('.register-button').text('register');
  $('.registerForm').addClass('closed');
});

$('.login-button').on('click', function(){
  var username = $('.login-username').val()
  var password = $('.login-password').val()
  $.post({
    url: '/api/users/login',
    data: {
      username: username,
      password: password
    },
    success: function(){
      window.location.href = "/app"
    },
    error: function(){console.log("Wrong username/password!")}
  })
});

$('.register-button').on('click', function(e){
  e.stopPropagation();
  if($('.registerForm').hasClass('closed')){
    $(this).text('submit');
    $('.registerForm').removeClass('closed');
  } else {
    var username = $(".register-username").val();
    var firstname = $(".register-firstname").val();
    var lastname = $(".register-lastname").val();
    var email = $(".register-email").val();
    var password = $(".register-password").val();
    var passwordCheck = $(".register-passwordconfirm").val();
    var userData = {
      username: username,
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password
    };
    console.log(userData);

    $.post({
      url: '/api/users/register',
      data: userData,
      success: function(){
        $(this).text('register');
        $('.registerForm').addClass('closed');
      },
      error: function(){

      }
    });
  }
});

$('.registerForm').on('click', function(e){
  e.stopPropagation();
})