describe( 'FilterStream instances', ()=>{

  const generateUITPath
    = require( 'noisy-jasmine/test-util/generate-uit-path' );

  const filter
    = require( generateUITPath( __filename ) );

  const asyncify
    = require( 'async/asyncify' );

  it( 'should only emit items that match the provided filter', ( done )=>{

    const input
      = [ 0, 1, -1, 2 ];

    const actual
      = [];

    const expected
      = [ 1, 2 ];

    const stream = filter( asyncify( ( i )=>i > 0 ) )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );

        done();

      } );

    input.forEach( stream.write.bind( stream ) );
    stream.end();

  } );

  it( 'should disallow predicates other than functions to be used', ()=>{

    [ {}, 1, null, 'string', true, undefined, [] ]
      .forEach( ( p )=>expect( filter.bind( null, p ) ).to.throw() );

  } );

  it( 'should emit an error, if the filter function emits an error', ( done )=>{

    const assert
      = require( 'assert' );

    const stream = filter( asyncify( ()=>assert( false ) ) )
      .on( 'error', ( err )=>{

        expect( err ).to.exist;
        done();

      } )
      .on( 'finish', ()=>assert( false, 'Error was not caught' ) );

    stream.write( 'something' );

  } );

} );
