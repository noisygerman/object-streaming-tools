describe( 'CallbackResultStream instances', ()=>{

  const generateUITPath
    = require( 'noisy-jasmine/test-util/generate-uit-path' );

  const createCallbackResultStream
    = require( generateUITPath( __filename ) );

  const assert
    = require( 'assert' );

  it( 'should emit the result of a callback-based function', ( done )=>{

    const expected = 1;

    function emitOne( next ){

      setImmediate( next, null, expected );

    }

    const output
      = [];

    createCallbackResultStream( emitOne )
      .on( 'data', output.push.bind( output ) )
      .on( 'end', ()=>{

        expect( output.length )
          .to.equal( 1 );

        expect( output[ 0 ] )
          .to.deep.equal( expected );

        done();

      } );

  } );

  it( 'should emit an error, if the callback errored out', ( done )=>{

    const expected
      = { 418: 'I\'m a teapot' };

    function emitMany( next ){

      setImmediate( next, expected );

    }

    createCallbackResultStream( emitMany )
      .on( 'error', ( err )=>{

        expect( err ).to.equal( expected );
        done();

      } )
      .on( 'data', ()=>assert( false, 'Should throw' ) );

  } );

} );
