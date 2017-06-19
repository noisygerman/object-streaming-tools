describe( 'ArrayReadStream instances', ()=>{

  const generateUITPath
    = require( 'noisy-jasmine/test-util/generate-uit-path' );

  const createArrayReadStream
    = require( generateUITPath( __filename ) );

  it( 'should emit data of an array', ( done )=>{

    const input
      = [ 1 ];

    const output
      = [];

    createArrayReadStream( input )
      .on( 'data', output.push.bind( output ) )
      .on( 'end', ()=>{

        expect( input )
          .toEqual( output );

        done();

      } );

  } );

  it( 'should emit all data of an array in order', ( done )=>{

    const input = new Array( 250 )
      .fill()
      .map( ( _, index )=>index + 1 );

    const output
      = [];

    createArrayReadStream( input )
      .on( 'data', output.push.bind( output ) )
      .on( 'end', ()=>{

        expect( input )
          .toEqual( output );

        done();

      } );

  } );

  it( 'should pipe all data of an array in order', ( done )=>{

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

    createArrayReadStream( input )
      .pipe( writeStream )
      .on( 'finish', ()=>{

        expect( input )
          .toEqual( output );

        done();

      } );

  } );

} );
