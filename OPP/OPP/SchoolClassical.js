// Object Class from the lecture (demo) - Classical OOP
var Class = (function () {
    function createClass(properties) {
        var f = function () {
            //This is an addition to enable super (base) class with inheritance
            if (this._superConstructor) {
                this._super = new this._superConstructor(arguments);
            }
            this.init.apply(this, arguments);
        }
        for (var prop in properties) {
            f.prototype[prop] = properties[prop];
        }
        if (!f.prototype.init) {
            f.prototype.init = function () { }
        }
        return f;
    }

    Function.prototype.inherit = function (parent) {
        var oldPrototype = this.prototype;
        this.prototype = new parent();
        this.prototype._superConstructor = parent;
        for (var prop in oldPrototype) {
            this.prototype[prop] = oldPrototype[prop];
        }
    }

    return {
        create: createClass,
    };
}());

// Object School with properties name, town, classes and method addClass
var School = Class.create({
    init: function () {
        this.name = arguments[0];
        this.town = arguments[1];
        this.classes = [];
    },
    addClass: function () {
        if (arguments[0] instanceof SchoolClass) {
            this.classes.push(arguments[0]);
        }
    }
});

// Object SchoolClass with properties name, capacity, formTeacher, students and method addStudent
var SchoolClass = Class.create({
    init: function () {
        this.name = arguments[0];
        this.capacity = arguments[1];
        this.formTeacher = arguments[2];
        this.students = [];
    },
    addStudent: function () {
        if (this.capacity > this.students.length) {
            if (arguments[0] instanceof Student) {
                this.students.push(arguments[0]);
            }
        }
    }
});

// Object Person with properties fname, lname, age and method introduce
var Person = Class.create({
    init: function (fname, lname, age) {
        this.fname = fname;
        this.lname = lname;
        this.age = age;
    },
    introduce: function () {
        return "Name: " + this.fname + " " + this.lname + ", Age: " + this.age;
    }
});

// Object Student with properties _super (base class), grade and overriden method introduce
var Student = Class.create({
    init: function (fname, lname, age, grade) {
        this._super.init(fname, lname, age);
        this.grade = grade;
    },
    introduce: function () {
        return this._super.introduce() + ", grade: " + this.grade;
    }
});

// Class Student inherit class Person (base class)
Student.inherit(Person);

// Object Teacher with properties _super (base class), specialty and overriden method introduce
var Teacher = Class.create({
    init: function (fname, lname, age, specialty) {
        this._super.init(fname, lname, age);
        this.specialty = specialty;
    },
    introduce: function () {
        return this._super.introduce() + ", specialty: " + this.specialty;
    }
});

// Class Student inherit class Person (base class)
Teacher.inherit(Person);

// Example
var cecoTroikata = new Student("Ceco", "Troikata", 3, 2);
var pesho = new Student("Pesho", "Peshev", 5, 5);
var mitkoZubara = new Teacher("Mitko", "Zubara", 6, "asp");

console.log(cecoTroikata.introduce === mitkoZubara.introduce);
console.log(cecoTroikata.introduce === pesho.introduce);
console.log(cecoTroikata.introduce());
console.log(mitkoZubara.introduce());
console.log(pesho.introduce());

var schoolClass = new SchoolClass("class", 20, mitkoZubara);
schoolClass.addStudent(cecoTroikata);
schoolClass.addStudent(mitkoZubara);
console.log("class has students:");
for (var count = 0; count < schoolClass.students.length; count++) {
    console.log(schoolClass.students[count].introduce());
}

var school = new School("school", "city");
school.addClass(schoolClass);
console.log(school.name + " in " + school.town + " has " + school.classes.length + " classes");