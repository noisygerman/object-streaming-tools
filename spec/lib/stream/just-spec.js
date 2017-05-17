describe( 'JustStream instances', ()=>{

  const just
    = require( process.cl_test_util.generateUITPath( __filename ) );

  it( 'should emit any input they are instantieted with', ( done )=>{

    const input
      = 1;

    const output
      = [];

    just( input )
      .on( 'data', output.push.bind( output ) )
      .on( 'end', ()=>{

        expect( input )
          .toEqual( output[ 0 ] );

        done();

      } );

  } );

  it( 'should emit all inputs in order ', ( done )=>{

    const input = new Array( 250 )
      .fill()
      .map( ( _, index )=>index + 1 );

    const output
      = [];

    // note the gather operator
    just( ...input )
      .on( 'data', output.push.bind( output ) )
      .on( 'end', ()=>{

        expect( input )
          .toEqual( output );

        done();

      } );

  } );

  it( 'should skip null/undefined values', ( done )=>{

    const expected
     = [ 1, 'n', true ];

    const output
      = [];

    just( null, 1, undefined, 'n', undefined, null, true, null, undefined )
      .on( 'data', output.push.bind( output ) )
      .on( 'end', ()=>{

        expect( expected )
          .toEqual( output );

        done();

      } );

  } );

  it( 'should emit arrays as arrays', ( done )=>{

    const input
      = [ 1, 2 ];

    const output
      = [];

    const writeStream = require( 'stream' ).Writable( {
      objectMode: true,
      write( item, _, next ){

        output.push( item );
        next();

      }
    } );

    just( input )
      .pipe( writeStream )
      .on( 'finish', ()=>{

        expect( input )
          .toEqual( output[ 0 ] );

        done();

      } );

  } );

  it( 'should simply end if no values are provided', ( done )=>{

    just()
      .on( 'data', ()=>null )
      .on( 'end', ()=>{

        // will timeout if we don't get here
        done();

      } );

  } );
  
} );
