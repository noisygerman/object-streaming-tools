describe( 'ValuesStream instances', ()=>{

  const generateUITPath
    = require( 'noisy-jasmine/test-util/generate-uit-path' );

  const values
    = require( generateUITPath( __filename ) );

  it( 'should emit the value of properties of objects piped in', ( done )=>{

    const expected
      = 'value';

    const input
      = { prop: expected };

    const output
      = [];

    const stream = values()
      .on( 'data', output.push.bind( output ) )
      .on( 'finish', ()=>{

        expect( output.length )
          .to.equal( 1 );

        expect( output[ 0 ] )
          .to.deep.equal( expected );

        done();

      } );

    stream.write( input );
    stream.end();

  } );

  it( 'should emit as many property values as are available', ( done )=>{

    const expected = new Array( 250 )
      .fill()
      .map( ( _, index )=>index + 1 );

    const input = expected
      .reduce( ( obj, val )=>Object.assign( obj, { [ val ]: val } ), {} );

    const output
      = [];

    const stream = values()
      .on( 'data', output.push.bind( output ) )
      .on( 'finish', ()=>{

        expect( output )
          .to.deep.equal( expected );

        done();

      } );

    stream.write( input );
    stream.end();

  } );


  it( 'should emit nothing for empty objects', ( done )=>{

    const output
      = [];

    const stream = values()
      .on( 'data', output.push.bind( output ) )
      .on( 'finish', ()=>{

        expect( output.length )
          .to.equal( 0 );

        done();

      } );

    stream.write( {} );
    stream.end();

  } );

  it( 'should skip null/undefined property values', ( done )=>{

    const value
      = 'value';

    const anotherValue
      = 'anotherValue';

    const expected = [
      value,
      anotherValue
    ];

    const input = {
      badNews:     undefined,
      moreBadNews: null,
      value,
      anotherValue
    };

    const output
      = [];

    const stream = values()
      .on( 'data', output.push.bind( output ) )
      .on( 'finish', ()=>{

        expect( output.length )
          .to.deep.equal( expected.length );

        output.forEach( ( o )=>{

          expect( expected.includes( o ) )
            .to.equal( true );

        } );

        done();

      } );

    stream.write( input );
    stream.end();

  } );


} );
