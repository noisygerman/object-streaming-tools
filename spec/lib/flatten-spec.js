describe( 'FlattenStream instances', ()=>{

  const generateUITPath
    = require( 'noisy-jasmine/test-util/generate-uit-path' );

  const flatten
    = require( generateUITPath( __filename ) );

  it( 'should have non-array type instances simply pass through', ( done )=>{

    const expected = 1;
    let actual;

    const stream = flatten()
      .on( 'data', ( output )=>actual = output )
      .on( 'end', ()=>{

        expect( expected )
          .toEqual( actual );

        done();

      } );

    stream.write( expected, null, ()=>null );
    stream.end();

  } );

  it( 'should pipe all data of an array in order', ( done )=>{

    const input = new Array( 250 )
      .fill()
      .reduce( ( arr, _, index )=>arr.concat( index + 1 ), [] );

    const output
      = [];

    const writeStream = require( 'stream' ).Writable( {
      objectMode: true,
      write( item, _, next ){

        output.push( item );
        next();

      }
    } );

    const stream = flatten( input );

    stream
      .pipe( writeStream )
      .on( 'finish', ()=>{

        expect( input )
          .toEqual( output );

        done();

      } );

    stream.write( input );
    stream.end();

  } );

  it( 'should skip null values', ( done )=>{

    const expected
      = [ 1, 2, 3, 4 ];

    const inputs = [
      [ undefined ],
      [ null, 1, null, 2, undefined, 3, null ],
      4
    ];

    const actual
      = [];

    const stream = flatten()
      .on( 'data', ( output )=>actual.push( output ) )
      .on( 'end', ()=>{

        expect( expected )
          .toEqual( actual );

        done();

      } );

    inputs.forEach( ( input )=>stream.write( input ) );
    stream.end();

  } );


} );
