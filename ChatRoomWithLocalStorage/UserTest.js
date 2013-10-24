module("User.init");

test("When user is initialized, should set the correct values", function() {
  var name = "Me";
  var user = new User(name);

  equal(user.name, "Me");
});

test("When user is initialized, should set the correct values", function() {
  var name = "Guest";
  var user = new User(name);

  equal(user.name, "Guest");
});