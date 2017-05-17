describe( 'RemoveAtStream instances', ()=>{

  const removeAt
    = require( process.cl_test_util.generateUITPath( __filename ) );

  it( 'should remove item from the array it was instiated with at the index piped in', ( done )=>{

    const input = [ 0 ];

    const stream = removeAt( input )
      .on( 'data', ()=>null )
      .on( 'finish', ()=>{

        expect( input.length )
          .toBe( 0 );
      
        done();
      
      } );

    stream.write( 0 );
    stream.end();

  } );

  it( 'should emit removed non-null values, and remove null-y and non-null-y items alike', ( done )=>{

    const input
      = [ 0, null, undefined ];

    const output
      = [];

    const expected
      = [ 0 ];

    const stream = removeAt( input )
      .on( 'data', output.push.bind( output ) )
      .on( 'finish', ()=>{

        expect( output )
          .toEqual( expected );
      
        done();
      
      } );

    do{
      
      stream.write( 0 );

    } while( input.length );
    
    stream.end();

  } );

  it( 'should throw if the ctor input is not an array', ()=>{

    [ null, undefined, {}, 0, '', ()=>null ].forEach( ( invalidTypeInstance )=>{

      expect( ()=>removeAt( invalidTypeInstance ) ).toThrow();

    } );


  } );

  it( 'should emit an error if a piped in index exceeds the valid range of the array', ()=>{

    const input
      = [];

    const errors
      = [];

    removeAt( input )
      .on( 'error', errors.push.bind( errors ) )
      .write( -1 );

    removeAt( input )
      .on( 'error', errors.push.bind( errors ) )
      .write( input.length );
 
    expect( errors.length )
      .toBe( 2 );

  } );

} );
