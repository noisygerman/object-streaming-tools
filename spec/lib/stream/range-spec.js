describe( 'RangeStream instances', ()=>{

  const range
    = require( process.cl_test_util.generateUITPath( __filename ) );

  it( 'should emit all numbers in order', ( done )=>{

    const expected = new Array( 1000 )
      .fill()
      .map( ( _, index )=>index );

    const output
      = [];

    range( 0, 999 )
      .on( 'data', output.push.bind( output ) )
      .on( 'end', ()=>{

        expect( expected )
          .toEqual( output );

        done();

      } );

  } );

  it( 'error if the arguments are not integers', ()=>{

    expect( ()=>range( 'a', 9 ) ).toThrow();
    expect( ()=>range( 0, 9.3 ) ).toThrow();

  } );
  
} );
