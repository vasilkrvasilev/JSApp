// Method create to create an object from the lecture (demo) - Prototypal OOP
if (!Object.create) {
    Object.create = function (obj) {
        function f() { };
        f.prototype = obj;
        return new f();
    }
}

// Method extend to inherit an object from the lecture (demo) - Prototypal OOP
if (!Object.prototype.extend) {
    Object.prototype.extend = function (properties) {
        function f() { };
        f.prototype = Object.create(this);
        for (var prop in properties) {
            f.prototype[prop] = properties[prop];
        }

        f.prototype._super = Object.create(this);
        return new f();
    }
}

// Object School with properties name, town, classes
var School = {
    init: function () {
        this.name = arguments[0];
        this.town = arguments[1];
        this.classes = [];
        for (var count = 2; count < arguments.length; count++) {
            this.classes.push(arguments[count]);
        }
    }
};

// Object SchoolClass with properties name, capacity, formTeacher, students
var SchoolClass = {
    init: function () {
        this.name = arguments[0];
        this.capacity = arguments[1];
        this.formTeacher = arguments[2];
        this.students = [];
        var numberStudents = Math.min(arguments.length - 3, this.capacity);
        for (var count = 3; count < 3 + numberStudents; count++) {
            this.students.push(arguments[count]);
        }
    }
};

// Object Person with properties fname, lname, age and method introduce
var Person = {
    init: function (fname, lname, age) {
        this.fname = fname;
        this.lname = lname;
        this.age = age;
    },
    introduce: function () {
        return "Name: " + this.fname + " " + this.lname + ", Age: " + this.age;
    }
};

// Object Student inherited Person with properties _super (base class), grade and overriden method introduce
var Student = Person.extend({
    init: function (fname, lname, age, grade) {
        this._super.init.apply(this, arguments);
        this.grade = grade;
    },
    introduce: function () {
        return this._super.introduce.apply(this) + ", grade: " + this.grade;
    }
});

// Object Teacher inherited Person with properties _super (base class), specialty and overriden method introduce
var Teacher = Person.extend({
    init: function (fname, lname, age, specialty) {
        this._super.init.apply(this, arguments);
        this.specialty = specialty;
    },
    introduce: function () {
        return this._super.introduce.apply(this) + ", specialty: " + this.specialty;
    }
});

// Example
var cecoTroikata = Object.create(Student);
cecoTroikata.init("Ceco", "Troikata", 3, 2);
var mitkoZubara = Object.create(Teacher);
mitkoZubara.init("Mitko", "Zubara", 6, "asp");
var pesho = Object.create(Student);
pesho.init("Pesho", "Peshev", 5, 5);

console.log(cecoTroikata.introduce === mitkoZubara.introduce);
console.log(cecoTroikata.introduce === pesho.introduce);
console.log(cecoTroikata.introduce());
console.log(mitkoZubara.introduce());
console.log(pesho.introduce());

var schoolClass = Object.create(SchoolClass);
schoolClass.init("class", 20, mitkoZubara, cecoTroikata, pesho);
console.log("class has students:");
for (var count = 0; count < schoolClass.students.length; count++) {
    console.log(schoolClass.students[count].introduce());
}

var school = Object.create(School);
school.init("school", "city", schoolClass);
console.log(school.name + " in " + school.town + " has " + school.classes.length + " classes");