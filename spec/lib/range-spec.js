describe( 'RangeStream instances', ()=>{

  const generateUITPath
    = require( 'noisy-jasmine/test-util/generate-uit-path' );

  const range
    = require( generateUITPath( __filename ) );

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
          .to.deep.equal( output );

        done();

      } );

  } );

  it( 'error if the arguments are not integers', ()=>{

    expect( ()=>range( 'a', 9 ) ).to.throw();
    expect( ()=>range( 0, 9.3 ) ).to.throw();

  } );

} );
