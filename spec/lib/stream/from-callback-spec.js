describe( 'CallbackResultStream instances', ()=>{

  const createCallbackResultStream
    = require( process.cl_test_util.generateUITPath( __filename ) );

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
          .toBe( 1 );

        expect( output[ 0 ] )
          .toEqual( expected );

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

        expect( err ).toBe( expected );
        done();

      } )
      .on( 'data', ()=>assert( false, 'Should throw' ) );

  } );

} );
