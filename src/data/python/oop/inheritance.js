import { py, oop } from './common.js'

export const inheritanceLessonsA = [
    {
      id: 'py-inheritance-super',
      title: 'Inheritance basics and super()',
      blurb: 'Subclassing, calling the parent with super(), and the missing-super bug.',
      kind: 'code',
      practice: {
        prompt: 'Write `Animal(name)` with `speak()` returning `"<name> makes a sound"`.\n\nWrite `Dog(name, breed)`, a subclass that calls `super().__init__(name)`, stores `breed`, and overrides `speak()` to return `"<name> says Woof (<breed>)"`.\n\nWrite `Cat(name)`, a subclass with **no extra `__init__`**, overriding `speak()` to return `"<name> says Meow"`.',
        starter: 'class Animal:\n    def __init__(self, name):\n        ...\n\n    def speak(self):\n        ...\n\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        ...\n\n    def speak(self):\n        ...\n\n\nclass Cat(Animal):\n    def speak(self):\n        ...\n',
        solution: py`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound"


class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed

    def speak(self):
        return f"{self.name} says Woof ({self.breed})"


class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow"`,
        samples: ['Dog("Rex", "Labrador").speak()', 'Cat("Tom").speak()'],
        cases: [
          ['A plain animal', 'Animal("Thing").speak()'],
          ['A dog speaks with its breed', 'Dog("Rex", "Labrador").speak()'],
          ['super().__init__ set the name', 'Dog("Rex", "Labrador").name'],
          ['The breed is stored', 'Dog("Rex", "Labrador").breed'],
          ['A cat speaks', 'Cat("Tom").speak()'],
          ['Cat inherits __init__ unchanged', 'Cat("Tom").name'],
          ['A dog is an Animal', 'isinstance(Dog("Rex", "Labrador"), Animal)'],
          ['A cat is an Animal', 'isinstance(Cat("Tom"), Animal)'],
          ['An animal is not a dog', 'isinstance(Animal("Thing"), Dog)'],
        ],
        traps: [
          py`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound"


class Dog(Animal):
    def __init__(self, name, breed):
        self.breed = breed

    def speak(self):
        return f"{self.name} says Woof ({self.breed})"


class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow"`,
          py`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound"


class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed

    def speak(self):
        return f"{self.name} says Woof"


class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow"`,
          py`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound"


class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed

    def speak(self):
        return f"{self.name} says Woof ({self.breed})"


class Cat(Animal):
    def __init__(self):
        pass

    def speak(self):
        return f"{self.name} says Meow"`,
        ],
      },
      real: [
        oop({
          title: 'Track -> Song hierarchy',
          use: ['tracks'],
          starter: 'class Track:\n    def __init__(self, name, milliseconds):\n        ...\n\n    def summary(self):\n        return f"{self.name}: {self.milliseconds}ms"\n\n\nclass Song(Track):\n    def __init__(self, name, milliseconds, lyrics_by):\n        ...\n\n    def summary(self):\n        ...\n\nplain = Track(tracks[0]["Name"], tracks[0]["Milliseconds"])\nsong = Song(tracks[1]["Name"], tracks[1]["Milliseconds"], "Angus Young")\nanswer = (plain.summary(), song.summary(), song.name)\n',
          given: '# tracks is a list of dictionaries. Track.summary() is already written for you.',
          brief: 'Write `Track(name, milliseconds)`. Write `Song(Track)` with an extra `lyrics_by`, calling `super().__init__` for the shared part. Override `summary()` on `Song` to return `Track.summary()` (via `super()`) followed by `" (lyrics by <lyrics_by>)"`.',
          reference: py`class Track:
    def __init__(self, name, milliseconds):
        self.name = name
        self.milliseconds = milliseconds

    def summary(self):
        return f"{self.name}: {self.milliseconds}ms"


class Song(Track):
    def __init__(self, name, milliseconds, lyrics_by):
        super().__init__(name, milliseconds)
        self.lyrics_by = lyrics_by

    def summary(self):
        return super().summary() + f" (lyrics by {self.lyrics_by})"

plain = Track(tracks[0]["Name"], tracks[0]["Milliseconds"])
song = Song(tracks[1]["Name"], tracks[1]["Milliseconds"], "Angus Young")
answer = (plain.summary(), song.summary(), song.name)`,
          walkthrough: '`super().__init__(name, milliseconds)` reuses `Track`\'s setup, and `super().summary()` reuses its text, so `Song` only adds what is genuinely new.',
          traps: [py`class Track:
    def __init__(self, name, milliseconds):
        self.name = name
        self.milliseconds = milliseconds

    def summary(self):
        return f"{self.name}: {self.milliseconds}ms"


class Song(Track):
    def __init__(self, name, milliseconds, lyrics_by):
        self.lyrics_by = lyrics_by

    def summary(self):
        return super().summary() + f" (lyrics by {self.lyrics_by})"

plain = Track(tracks[0]["Name"], tracks[0]["Milliseconds"])
song = Song(tracks[1]["Name"], tracks[1]["Milliseconds"], "Angus Young")
answer = (plain.summary(), song.summary(), song.name)`],
        }),
        oop({
          title: 'Person -> Customer',
          use: ['customers'],
          starter: 'class Person:\n    def __init__(self, first, last):\n        ...\n\n    def full_name(self):\n        return f"{self.first} {self.last}"\n\n\nclass Customer(Person):\n    def __init__(self, first, last, country):\n        ...\n\nc = Customer(customers[0]["FirstName"], customers[0]["LastName"], customers[0]["Country"])\nanswer = (c.full_name(), c.country, isinstance(c, Person))\n',
          given: '# customers is a list of dictionaries. Person.full_name() is already written for you.',
          brief: 'Write `Person(first, last)`. Write `Customer(Person)` adding `country`, calling `super().__init__` for the shared part.',
          reference: py`class Person:
    def __init__(self, first, last):
        self.first = first
        self.last = last

    def full_name(self):
        return f"{self.first} {self.last}"


class Customer(Person):
    def __init__(self, first, last, country):
        super().__init__(first, last)
        self.country = country

c = Customer(customers[0]["FirstName"], customers[0]["LastName"], customers[0]["Country"])
answer = (c.full_name(), c.country, isinstance(c, Person))`,
          walkthrough: '`Customer` reuses `Person`\'s constructor through `super().__init__`, so `full_name()` keeps working unchanged, exactly as substitutability promises.',
          traps: [py`class Person:
    def __init__(self, first, last):
        self.first = first
        self.last = last

    def full_name(self):
        return f"{self.first} {self.last}"


class Customer(Person):
    def __init__(self, first, last, country):
        self.first = first
        self.last = last
        self.country = country
        self.first, self.last = last, first

c = Customer(customers[0]["FirstName"], customers[0]["LastName"], customers[0]["Country"])
answer = (c.full_name(), c.country, isinstance(c, Person))`],
        }),
        oop({
          title: 'A shape family from real areas',
          use: ['tracks'],
          starter: 'class Shape:\n    def area(self):\n        raise NotImplementedError\n\n\nclass TrackBar(Shape):\n    def __init__(self, milliseconds):\n        ...\n\n    def area(self):\n        ...\n\nbars = [TrackBar(t["Milliseconds"]) for t in tracks[:20]]\nanswer = round(sum(bar.area() for bar in bars), 2)\n',
          given: '# tracks is a list of dictionaries. Imagine each track as a 1-pixel-tall bar as wide as its length in seconds.',
          brief: 'Write `TrackBar(Shape)` whose `area()` treats the track as a rectangle of height 1 and width equal to its length **in seconds** (`milliseconds / 1000`), so `area()` returns the length in seconds. Store the total area of the first 20 bars, rounded to 2 decimals, in `answer`.',
          reference: py`class Shape:
    def area(self):
        raise NotImplementedError


class TrackBar(Shape):
    def __init__(self, milliseconds):
        self.milliseconds = milliseconds

    def area(self):
        return self.milliseconds / 1000

bars = [TrackBar(t["Milliseconds"]) for t in tracks[:20]]
answer = round(sum(bar.area() for bar in bars), 2)`,
          walkthrough: '`TrackBar` fulfils the promise `Shape` made (an `area()` method), so it can be used exactly like any other shape.',
          traps: [py`class Shape:
    def area(self):
        raise NotImplementedError


class TrackBar(Shape):
    def __init__(self, milliseconds):
        self.milliseconds = milliseconds

    def area(self):
        return self.milliseconds

bars = [TrackBar(t["Milliseconds"]) for t in tracks[:20]]
answer = round(sum(bar.area() for bar in bars), 2)`],
        }),
      ],
    },
    {
      id: 'py-overriding-substitution',
      title: 'Overriding, isinstance/issubclass and the Liskov idea',
      blurb: 'Substitutability, and overrides that quietly break the promise.',
      kind: 'code',
      practice: {
        prompt: 'Write a `Shape` base class whose `area()` raises `NotImplementedError`. Write `Rectangle(width, height)` and `Circle(radius)` subclasses (`Circle`\'s area is `3.14159 * radius ** 2`). Write `total_area(shapes)` returning the sum of `.area()` over any list of shapes, **rounded to 2 decimals**.',
        starter: 'class Shape:\n    def area(self):\n        ...\n\n\nclass Rectangle(Shape):\n    def __init__(self, width, height):\n        ...\n\n    def area(self):\n        ...\n\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        ...\n\n    def area(self):\n        ...\n\n\ndef total_area(shapes):\n    ...\n',
        solution: py`class Shape:
    def area(self):
        raise NotImplementedError


class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2


def total_area(shapes):
    return round(sum(shape.area() for shape in shapes), 2)`,
        samples: ['total_area([Rectangle(2, 3), Circle(1)])'],
        cases: [
          ['One rectangle', 'total_area([Rectangle(3, 4)])'],
          ['One circle', 'total_area([Circle(2)])'],
          ['A mix', 'total_area([Rectangle(2, 3), Circle(1)])'],
          ['An empty list', 'total_area([])'],
          ['Several rectangles', 'total_area([Rectangle(1, 1), Rectangle(2, 2), Rectangle(3, 3)])'],
          ['Rectangle is a Shape', 'isinstance(Rectangle(1, 1), Shape)'],
          ['Raises: Shape.area is not implemented', 'Shape().area()'],
        ],
        traps: [
          py`class Shape:
    def area(self):
        raise NotImplementedError


class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 2 * 3.14159 * self.radius


def total_area(shapes):
    return round(sum(shape.area() for shape in shapes), 2)`,
          py`class Shape:
    def area(self):
        raise NotImplementedError


class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2


def total_area(shapes):
    return round(sum(shape.area() for shape in shapes) - 1, 2)`,
          py`class Shape:
    def area(self):
        return 0


class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2


def total_area(shapes):
    return round(sum(shape.area() for shape in shapes), 2)`,
        ],
      },
      real: [
        oop({
          title: 'A discount policy family',
          use: ['invoices'],
          starter: 'class Discount:\n    def apply(self, total):\n        raise NotImplementedError\n\n\nclass NoDiscount(Discount):\n    def apply(self, total):\n        ...\n\n\nclass PercentOff(Discount):\n    def __init__(self, percent):\n        ...\n\n    def apply(self, total):\n        ...\n\ndef total_after(invoices, discount):\n    return round(sum(discount.apply(inv["Total"]) for inv in invoices), 2)\n\nanswer = (total_after(invoices[:5], NoDiscount()), total_after(invoices[:5], PercentOff(10)))\n',
          given: '# invoices is a list of dictionaries with "Total". total_after already works with any Discount.',
          brief: 'Write `NoDiscount.apply(total)` returning `total` unchanged, and `PercentOff(percent).apply(total)` returning `total` reduced by that percentage. `total_after` must work, unmodified, with either.',
          reference: py`class Discount:
    def apply(self, total):
        raise NotImplementedError


class NoDiscount(Discount):
    def apply(self, total):
        return total


class PercentOff(Discount):
    def __init__(self, percent):
        self.percent = percent

    def apply(self, total):
        return total - total * self.percent / 100

def total_after(invoices, discount):
    return round(sum(discount.apply(inv["Total"]) for inv in invoices), 2)

answer = (total_after(invoices[:5], NoDiscount()), total_after(invoices[:5], PercentOff(10)))`,
          walkthrough: 'Because both discounts honour the same `apply(total)` interface, `total_after` never needs to know which one it received: substitution at work.',
          traps: [py`class Discount:
    def apply(self, total):
        raise NotImplementedError


class NoDiscount(Discount):
    def apply(self, total):
        return total


class PercentOff(Discount):
    def __init__(self, percent):
        self.percent = percent

    def apply(self, total):
        return total - self.percent

def total_after(invoices, discount):
    return round(sum(discount.apply(inv["Total"]) for inv in invoices), 2)

answer = (total_after(invoices[:5], NoDiscount()), total_after(invoices[:5], PercentOff(10)))`],
        }),
        oop({
          title: 'A broken postcondition, made visible',
          use: ['tracks'],
          starter: 'class Pricer:\n    def price_for(self, unit_price, quantity):\n        raise NotImplementedError\n\n\nclass NormalPricer(Pricer):\n    def price_for(self, unit_price, quantity):\n        ...\n\n\nclass BrokenPricer(Pricer):\n    def price_for(self, unit_price, quantity):\n        ...\n\ndef bill(tracks, qty, pricer):\n    return round(sum(pricer.price_for(t["UnitPrice"], qty) for t in tracks), 2)\n\nanswer = []\nfor pricer in (NormalPricer(), BrokenPricer()):\n    total = bill(tracks[:5], 2, pricer)\n    answer.append(total >= 0)\n',
          given: '# tracks is a list of dictionaries with "UnitPrice". bill() trusts that a price is never negative.',
          brief: 'Write `NormalPricer.price_for(unit_price, quantity)` returning `unit_price * quantity`. Write `BrokenPricer.price_for(unit_price, quantity)` that **violates the promise** by returning a **negative** number (for example, the negative of the normal price). `answer` records, for each pricer, whether the total stayed non-negative.',
          reference: py`class Pricer:
    def price_for(self, unit_price, quantity):
        raise NotImplementedError


class NormalPricer(Pricer):
    def price_for(self, unit_price, quantity):
        return unit_price * quantity


class BrokenPricer(Pricer):
    def price_for(self, unit_price, quantity):
        return -(unit_price * quantity)

def bill(tracks, qty, pricer):
    return round(sum(pricer.price_for(t["UnitPrice"], qty) for t in tracks), 2)

answer = []
for pricer in (NormalPricer(), BrokenPricer()):
    total = bill(tracks[:5], 2, pricer)
    answer.append(total >= 0)`,
          walkthrough: '`bill` never changes: it simply calls `price_for` and trusts the result. The exercise is to see, concretely, how a subclass that quietly breaks a promise (never negative) poisons every caller that relied on it, without raising any error at all.',
          traps: [py`class Pricer:
    def price_for(self, unit_price, quantity):
        raise NotImplementedError


class NormalPricer(Pricer):
    def price_for(self, unit_price, quantity):
        return unit_price * quantity


class BrokenPricer(Pricer):
    def price_for(self, unit_price, quantity):
        return unit_price * quantity

def bill(tracks, qty, pricer):
    return round(sum(pricer.price_for(t["UnitPrice"], qty) for t in tracks), 2)

answer = []
for pricer in (NormalPricer(), BrokenPricer()):
    total = bill(tracks[:5], 2, pricer)
    answer.append(total >= 0)`],
        }),
        oop({
          title: 'Describing any shape without a chain of isinstance',
          use: ['tracks'],
          starter: 'class Shape:\n    def area(self):\n        raise NotImplementedError\n\n    def describe(self):\n        ...\n\n\nclass TrackBar(Shape):\n    def __init__(self, milliseconds):\n        self.milliseconds = milliseconds\n\n    def area(self):\n        return self.milliseconds / 1000\n\nbars = [TrackBar(t["Milliseconds"]) for t in tracks[:3]]\nanswer = [bar.describe() for bar in bars]\n',
          given: '# tracks is a list of dictionaries. TrackBar is already finished; only Shape.describe needs writing.',
          brief: 'Write `Shape.describe()` (on the **base class only**) returning `f"a shape with area {self.area():.2f}"`. It must work for `TrackBar` (and any future shape) **without** `TrackBar` overriding it, by calling `self.area()` polymorphically.',
          reference: py`class Shape:
    def area(self):
        raise NotImplementedError

    def describe(self):
        return f"a shape with area {self.area():.2f}"


class TrackBar(Shape):
    def __init__(self, milliseconds):
        self.milliseconds = milliseconds

    def area(self):
        return self.milliseconds / 1000

bars = [TrackBar(t["Milliseconds"]) for t in tracks[:3]]
answer = [bar.describe() for bar in bars]`,
          walkthrough: '`describe` is defined once, on `Shape`, and calls `self.area()` — which, thanks to polymorphism, resolves to whichever subclass\'s `area()` the actual instance has, with no repetition needed in `TrackBar`.',
          traps: [py`class Shape:
    def area(self):
        raise NotImplementedError

    def describe(self):
        return "a shape with area 0.00"


class TrackBar(Shape):
    def __init__(self, milliseconds):
        self.milliseconds = milliseconds

    def area(self):
        return self.milliseconds / 1000

bars = [TrackBar(t["Milliseconds"]) for t in tracks[:3]]
answer = [bar.describe() for bar in bars]`],
        }),
      ],
    },
    {
      id: 'py-mro-multiple-inheritance',
      title: 'Method resolution order and multiple inheritance',
      blurb: 'The MRO, the diamond problem, and how super() really works.',
      kind: 'code',
      practice: {
        prompt: 'Write `mro_names(cls)`. It returns a **list of class names** (strings), in the order of `cls.__mro__`.',
        starter: 'def mro_names(cls):\n    ...\n',
        solution: py`def mro_names(cls):
    return [c.__name__ for c in cls.__mro__]`,
        samples: ['mro_names(int)'],
        cases: [
          ['A plain class', 'class A:\n    pass\nmro_names(A)'],
          ['Single inheritance', 'class A:\n    pass\nclass B(A):\n    pass\nmro_names(B)'],
          ['Multiple inheritance', 'class A:\n    pass\nclass B:\n    pass\nclass C(A, B):\n    pass\nmro_names(C)'],
          ['A diamond', 'class A:\n    pass\nclass B(A):\n    pass\nclass C(A):\n    pass\nclass D(B, C):\n    pass\nmro_names(D)'],
          ['object is always last', 'class A:\n    pass\nmro_names(A)[-1]'],
          ['A built-in type', 'mro_names(bool)'],
        ],
        traps: [
          py`def mro_names(cls):
    return [c.__name__ for c in cls.__bases__]`,
          py`def mro_names(cls):
    return list(cls.__mro__)`,
          py`def mro_names(cls):
    return sorted(c.__name__ for c in cls.__mro__)`,
        ],
      },
      real: [
        oop({
          title: 'Two cooperating catalogue mixins',
          dataset: 'chinook',
          starter: 'class Base:\n    def describe(self):\n        return "base"\n\n\nclass A(Base):\n    def describe(self):\n        return "A -> " + super().describe()\n\n\nclass B(Base):\n    def describe(self):\n        return "B -> " + super().describe()\n\n\nclass C(A, B):\n    def describe(self):\n        ...\n\nanswer = (C().describe(), [cls.__name__ for cls in C.__mro__])\n',
          given: '# A, B and Base are already defined above, in the diamond shape from the lesson. Only C.describe needs writing.',
          brief: 'Write `C.describe`: it should prepend `"C -> "` and then continue the **cooperative chain** with `super().describe()`, just like `A` and `B` already do.',
          reference: py`class Base:
    def describe(self):
        return "base"


class A(Base):
    def describe(self):
        return "A -> " + super().describe()


class B(Base):
    def describe(self):
        return "B -> " + super().describe()


class C(A, B):
    def describe(self):
        return "C -> " + super().describe()

answer = (C().describe(), [cls.__name__ for cls in C.__mro__])`,
          walkthrough: 'Each class\'s `super()` follows the MRO, not "its own parent": `A`\'s `super()` lands on `B`, not `Base`, because `B` comes next in `C`\'s MRO. That is how the chain visits every class exactly once.',
          traps: [py`class Base:
    def describe(self):
        return "base"


class A(Base):
    def describe(self):
        return "A -> " + Base.describe(self)


class B(Base):
    def describe(self):
        return "B -> " + super().describe()


class C(A, B):
    def describe(self):
        return "C -> " + super().describe()

answer = (C().describe(), [cls.__name__ for cls in C.__mro__])`],
        }),
        oop({
          title: 'Combine two independent behaviours',
          use: ['tracks'],
          starter: 'class Named:\n    def __init__(self, name, **kwargs):\n        super().__init__(**kwargs)\n        self.name = name\n\n\nclass Priced:\n    def __init__(self, price, **kwargs):\n        ...\n\n\nclass Item(Named, Priced):\n    pass\n\nitem = Item(name=tracks[0]["Name"], price=tracks[0]["UnitPrice"])\nanswer = (item.name, item.price, [c.__name__ for c in Item.__mro__])\n',
          given: '# tracks is a list of dictionaries. Named is already finished; only Priced.__init__ needs writing.',
          brief: 'Write `Priced.__init__` to match the same cooperative pattern as `Named`: forward `**kwargs` with `super().__init__(**kwargs)` first, then store `price`. This shows two independent mixin-like classes combining cleanly in `Item`.',
          reference: py`class Named:
    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.name = name


class Priced:
    def __init__(self, price, **kwargs):
        super().__init__(**kwargs)
        self.price = price


class Item(Named, Priced):
    pass

item = Item(name=tracks[0]["Name"], price=tracks[0]["UnitPrice"])
answer = (item.name, item.price, [c.__name__ for c in Item.__mro__])`,
          walkthrough: 'Both `__init__` methods forward whatever they do not use with `super().__init__(**kwargs)`, so the chain reaches every class in the MRO exactly once, in order, ending at `object`.',
          traps: [py`class Named:
    def __init__(self, name, **kwargs):
        self.name = name


class Priced:
    def __init__(self, price, **kwargs):
        super().__init__(**kwargs)
        self.price = price


class Item(Named, Priced):
    pass

item = Item(name=tracks[0]["Name"], price=tracks[0]["UnitPrice"])
answer = (item.name, item.price, [c.__name__ for c in Item.__mro__])`],
        }),
        oop({
          title: 'Checking a hierarchy with issubclass',
          use: ['genres'],
          starter: 'class Media:\n    pass\n\n\nclass Audio(Media):\n    pass\n\n\nclass Track(Audio):\n    def __init__(self, name):\n        ...\n\ntracks_as_objects = [Track(g["Name"]) for g in genres[:5]]\nanswer = (\n    all(isinstance(t, Media) for t in tracks_as_objects),\n    issubclass(Track, Media),\n    issubclass(Media, Track),\n    [c.__name__ for c in Track.__mro__],\n)\n',
          given: '# genres is a list of dictionaries. The hierarchy Media -> Audio -> Track is already declared; only Track.__init__ needs writing.',
          brief: 'Write `Track.__init__`, storing `name`. Then `isinstance`/`issubclass` should see straight through the whole three-level chain, even though only `Track` defines a constructor.',
          reference: py`class Media:
    pass


class Audio(Media):
    pass


class Track(Audio):
    def __init__(self, name):
        self.name = name

tracks_as_objects = [Track(g["Name"]) for g in genres[:5]]
answer = (
    tracks_as_objects[0].name,
    all(isinstance(t, Media) for t in tracks_as_objects),
    issubclass(Track, Media),
    issubclass(Media, Track),
    [c.__name__ for c in Track.__mro__],
)`,
          walkthrough: '`isinstance`/`issubclass` follow the whole chain, not just the direct parent, which is exactly what the MRO records.',
          traps: [py`class Media:
    pass


class Audio(Media):
    pass


class Track(Audio):
    def __init__(self, name):
        self.name = name

tracks_as_objects = [Track(g["Name"]) for g in genres[:5]]
answer = (
    tracks_as_objects[0].name,
    all(isinstance(t, Media) for t in tracks_as_objects),
    issubclass(Media, Track),
    issubclass(Track, Media),
    [c.__name__ for c in Track.__mro__],
)`],
        }),
      ],
    },
    {
      id: 'py-mixins-cooperative',
      title: 'Mixins and cooperative inheritance',
      blurb: 'Small, focused classes designed to be combined, and *args/**kwargs.',
      kind: 'code',
      practice: {
        prompt: 'Write `JsonMixin`, a class with **no `__init__`**, adding a method `to_json()` that returns `self.__dict__` converted to JSON text with `json.dumps`.',
        starter: 'class JsonMixin:\n    def to_json(self):\n        ...\n',
        solution: py`class JsonMixin:
    def to_json(self):
        import json
        return json.dumps(self.__dict__)`,
        samples: ['class Point(JsonMixin):\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\nPoint(1, 2).to_json()'],
        cases: [
          ['A simple object', 'class Point(JsonMixin):\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\nimport json\njson.loads(Point(1, 2).to_json())'],
          ['A different shape of object', 'class Item(JsonMixin):\n    def __init__(self, name):\n        self.name = name\nimport json\njson.loads(Item("pen").to_json())'],
          ['Works for any class, unrelated to Point', 'class Empty(JsonMixin):\n    pass\nimport json\njson.loads(Empty().to_json())'],
          ['Does not swallow a base class\'s constructor arguments', 'class Base:\n    def __init__(self, x):\n        self.x = x\nclass Thing(JsonMixin, Base):\n    pass\nThing(5).x'],
          ['The result is text', 'class Item(JsonMixin):\n    def __init__(self, name):\n        self.name = name\ntype(Item("pen").to_json()).__name__'],
        ],
        traps: [
          py`class JsonMixin:
    def to_json(self):
        return str(self.__dict__)`,
          py`class JsonMixin:
    def __init__(self):
        pass

    def to_json(self):
        import json
        return json.dumps(self.__dict__)`,
          py`class JsonMixin:
    def to_json(self):
        import json
        return json.dumps(vars(JsonMixin))`,
        ],
      },
      real: [
        oop({
          title: 'A logging mixin for saving tracks',
          use: ['tracks'],
          starter: 'class LoggingMixin:\n    def save(self):\n        ...\n\n\nclass TrackRecord:\n    def __init__(self, name):\n        self.name = name\n        self.log = []\n\n    def save(self):\n        self.log.append(f"saved {self.name}")\n        return True\n\n\nclass LoggedTrack(LoggingMixin, TrackRecord):\n    pass\n\nlt = LoggedTrack(tracks[0]["Name"])\nresult = lt.save()\nanswer = (result, lt.log)\n',
          given: '# tracks is a list of dictionaries. TrackRecord is finished; only LoggingMixin.save needs writing.',
          brief: 'Write `LoggingMixin.save()`: it must append `f"logging {self.name}"` to `self.log`, then call `super().save()` and return **its** result, so the chain reaches `TrackRecord.save()` too.',
          reference: py`class LoggingMixin:
    def save(self):
        self.log.append(f"logging {self.name}")
        return super().save()


class TrackRecord:
    def __init__(self, name):
        self.name = name
        self.log = []

    def save(self):
        self.log.append(f"saved {self.name}")
        return True


class LoggedTrack(LoggingMixin, TrackRecord):
    pass

lt = LoggedTrack(tracks[0]["Name"])
result = lt.save()
answer = (result, lt.log)`,
          walkthrough: 'The mixin does its own small piece of work and then calls `super().save()` to continue the chain, rather than replacing `TrackRecord.save()` outright.',
          traps: [py`class LoggingMixin:
    def save(self):
        self.log.append(f"logging {self.name}")
        return True


class TrackRecord:
    def __init__(self, name):
        self.name = name
        self.log = []

    def save(self):
        self.log.append(f"saved {self.name}")
        return True


class LoggedTrack(LoggingMixin, TrackRecord):
    pass

lt = LoggedTrack(tracks[0]["Name"])
result = lt.save()
answer = (result, lt.log)`],
        }),
        oop({
          title: 'A comparable mixin for genres',
          use: ['genres'],
          starter: 'class ComparableMixin:\n    def __eq__(self, other):\n        ...\n\n\nclass GenreRecord(ComparableMixin):\n    def __init__(self, genre_id, name):\n        self.genre_id = genre_id\n        self.name = name\n\na = GenreRecord(genres[0]["GenreId"], genres[0]["Name"])\nb = GenreRecord(genres[0]["GenreId"], genres[0]["Name"])\nc = GenreRecord(genres[1]["GenreId"], genres[1]["Name"])\nanswer = (a == b, a == c)\n',
          given: '# genres is a list of dictionaries. GenreRecord is finished; only ComparableMixin.__eq__ needs writing.',
          brief: 'Write `ComparableMixin.__eq__(self, other)` so that two instances are equal exactly when their `__dict__`s are equal. It must work for `GenreRecord`, without `ComparableMixin` knowing anything about its fields.',
          reference: py`class ComparableMixin:
    def __eq__(self, other):
        return self.__dict__ == other.__dict__


class GenreRecord(ComparableMixin):
    def __init__(self, genre_id, name):
        self.genre_id = genre_id
        self.name = name

a = GenreRecord(genres[0]["GenreId"], genres[0]["Name"])
b = GenreRecord(genres[0]["GenreId"], genres[0]["Name"])
c = GenreRecord(genres[1]["GenreId"], genres[1]["Name"])
answer = (a == b, a == c)`,
          walkthrough: 'Comparing `self.__dict__ == other.__dict__` works for any class that mixes this in, because it only ever looks at whatever attributes happen to be there.',
          traps: [py`class ComparableMixin:
    def __eq__(self, other):
        return self is other


class GenreRecord(ComparableMixin):
    def __init__(self, genre_id, name):
        self.genre_id = genre_id
        self.name = name

a = GenreRecord(genres[0]["GenreId"], genres[0]["Name"])
b = GenreRecord(genres[0]["GenreId"], genres[0]["Name"])
c = GenreRecord(genres[1]["GenreId"], genres[1]["Name"])
answer = (a == b, a == c)`],
        }),
        oop({
          title: 'Forwarding keyword arguments through a mixin',
          use: ['artists'],
          starter: 'class TaggedMixin:\n    def __init__(self, *args, tag="untagged", **kwargs):\n        ...\n\n\nclass Sourced:\n    def __init__(self, source="unknown", **kwargs):\n        super().__init__(**kwargs)\n        self.source = source\n\n\nclass ArtistRecord(TaggedMixin, Sourced):\n    def __init__(self, name, **kwargs):\n        super().__init__(**kwargs)\n        self.name = name\n\na = ArtistRecord(artists[0]["Name"], tag="favourite", source="csv")\nb = ArtistRecord(artists[1]["Name"])\nanswer = (a.name, a.tag, a.source, b.tag, b.source)\n',
          given: '# artists is a list of dictionaries. Sourced and ArtistRecord are finished; only TaggedMixin.__init__ needs writing.',
          brief: 'Write `TaggedMixin.__init__`, storing `tag` on `self`, and forwarding **everything else** (`*args, **kwargs`, including a `source` it knows nothing about) with `super().__init__(*args, **kwargs)`, so the chain reaches `Sourced` too.',
          reference: py`class TaggedMixin:
    def __init__(self, *args, tag="untagged", **kwargs):
        super().__init__(*args, **kwargs)
        self.tag = tag


class Sourced:
    def __init__(self, source="unknown", **kwargs):
        super().__init__(**kwargs)
        self.source = source


class ArtistRecord(TaggedMixin, Sourced):
    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.name = name

a = ArtistRecord(artists[0]["Name"], tag="favourite", source="csv")
b = ArtistRecord(artists[1]["Name"])
answer = (a.name, a.tag, a.source, b.tag, b.source)`,
          walkthrough: '`tag` is captured as a keyword-only parameter with a default, and everything else — including `source`, which `TaggedMixin` knows nothing about — is passed on with `super().__init__(*args, **kwargs)`, so `Sourced` still gets what it needs.',
          traps: [py`class TaggedMixin:
    def __init__(self, tag="untagged"):
        self.tag = tag


class Sourced:
    def __init__(self, source="unknown", **kwargs):
        super().__init__(**kwargs)
        self.source = source


class ArtistRecord(TaggedMixin, Sourced):
    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.name = name

a = ArtistRecord(artists[0]["Name"], tag="favourite", source="csv")
b = ArtistRecord(artists[1]["Name"])
answer = (a.name, a.tag, a.source, b.tag, b.source)`],
        }),
      ],
    },
]
