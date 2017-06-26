# Object Streaming Tools

Helper functions to simplify creating and concatenating object streams in NodeJS

## Motivation

Writing NodeJs streams can be quite challenging. While I myself have create
snippets in my IDE to make my life easier when creating them, frequently I
found myself writing the same code over and over again. Since I am lazy,
I don't really like working this way. And frankly, the German in me simply
wanted - nay demanded! - more efficient, DRYer code.

Looking for a solution early 2016, I first explored RxJs3 . While I
very much appreciated the beauty of that project's approach, it seemed overkill
for what I needed. And when I noticed the significant differences between
version 3 and the then up-and-coming version 4, I decided to take another path.
I also looked at Highland.js, which is very similar in its approach to our goals
here, but was not quit there yet, when we started this.

For the enterprise level application I was designing for and working on with a
team at Copperleaf Technologies, I cooked up my first few helper tools that we
then continued to develop as a team throughout the year.

At version 1.0, this library was at the state we shipped it with that application
in May 2017. Copperleaf Technologies has graciously allowed me to take ownership of the project,
so here it is.

I hope some of you will find it useful.

## Examples

---
### start with anything

```JavaScript
const just = require( 'object-streaming-tools/lib/just' );

just( 'Hello World!' )
  .on( 'data', console.log );

// output:
// Hello World!
```

---

### iterate

```JavaScript
const fromArray = require( 'object-streaming-tools/lib/fromArray' );

fromArray( [ 1, 2, 3 ] )
  .on( 'data', console.log );

// output:
// 1
// 2
// 3
```

---

### iterate with the spread (...) operator

```JavaScript
const just = require( 'object-streaming-tools/lib/just' );

just( ...[ 1, 2, 3 ] )
  .on( 'data', console.log );

// output:
// 1
// 2
// 3
```

---

### filter

```JavaScript
const just     = require( 'object-streaming-tools/lib/just' );
const filter   = require( 'object-streaming-tools/lib/filter' );
const asyncify = require( 'async/asyncify' );

just( ...[ 1, 2, 3 ] )
  .pipe( filter( asyncify( ( x )=>x >= 2 ) ) )
  .on( 'data', console.log );

// output:
// 2
// 3
```

---

### get a range of numbers

```JavaScript
const range = require( 'object-streaming-tools/lib/range' );

range( 1, 3 )
  .on( 'data', console.log );

// output:
// 1
// 2
// 3
```

---

### switch things up

```JavaScript
const range    = require( 'object-streaming-tools/lib/range' );
const switchBy = require( 'object-streaming-tools/lib/switchBy' );
const asyncify = require( 'async/asyncify' );

const lookup = [ 'one', 'three', 'five' ];

const forTrue  = { ifMatches: true,  thenDo: asyncify( x=>lookup[ x ] ) };
const forFalse = { ifMatches: false, thenDo: asyncify( x=>x ) };

range( 1, 5 )
  .pipe( switchBy( asyncify( x=>!!x % 2 ), [ forTrue, forFalse ] ) )
  .on( 'data', console.log );

// output:
// one
// 2
// three
// 4
// five
```

TBC