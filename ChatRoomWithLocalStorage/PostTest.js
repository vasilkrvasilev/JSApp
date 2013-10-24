module("Post.init");

test("When post is initialized, should set the correct values", function() {
  var user = {
    name: "Me"
  };
  var text = "test";
  var post = new Post(text, user);

  equal(post.user.name, "Me");
  equal(post.text, "test");
});

module("Post.load");

test("When post saved in local Storage", function() {
	var initialLength = localStorage.length;
	var user = {
	name: "Me"
	};
	var text = "test";
	var post = new Post(text, user);
	post.load();
	equal(initialLength + 1, localStorage.length);
});

module("Post.load");

test("When empty post saved in local Storage", function() {
	var initialLength = localStorage.length;
	var user = {
	name: "Me"
	};
	var text = "";
	var post = new Post(text, user);
	post.load();
	equal(initialLength + 1, localStorage.length);
});