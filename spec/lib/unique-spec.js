describe( 'UniqueStream instances', ()=>{

  const generateUITPath
    = require( 'noisy-jasmine/test-util/generate-uit-path' );

  const unique
    = require( generateUITPath( __filename ) );

  it( 'should directly emit items that are unique', ( done )=>{

    const input
      = [1, 2, 3, 4, 4];

    const actual
      = [];

    const expected
      = [ 1, 2, 3, 4 ];

    const stream = unique()
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );

        done();

      } );

    input.forEach( stream.write.bind( stream ) );
    stream.end();

  } );

  it( 'should emit duplicate items via the "duplicate" event', ( done )=>{

    const input
      = [ 0, 1, -1, 2, 1, 2 ];

    const actual
      = [];

    const expected
      = [ 1, 2 ];

    const stream = unique()
      .on( unique.DuplicateEventKey, actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );

        done();

      } )
      .resume();

    input.forEach( stream.write.bind( stream ) );
    stream.end();

  } );

} );
