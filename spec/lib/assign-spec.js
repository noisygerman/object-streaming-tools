describe( 'AssignStream instances', ()=>{

  const generateUITPath
    = require( 'noisy-jasmine/test-util/generate-uit-path' );

  const uitPath
   = generateUITPath( __filename );

  const path
    = require( 'path' );

  const streamUtilFolder
    = path.dirname( uitPath );

  const fromArrayPath
    = path.join( streamUtilFolder, 'fromArray' );

  const fromArray
    = require( fromArrayPath );

  const assign
    = require( uitPath );

  const assert
    = require( 'assert' );

  it( 'should map data received to an array', ( done )=>{

    const key1
      = 'someKey';

    const key2
      = 0;

    const input = [
      { [ key1 ]: typeof key1 },
      { [ key2 ]: typeof key2 }
    ];

    const expected = {
      [ key1 ]: typeof key1,
      [ key2 ]: typeof key2
    };

    let output;

    function setOnData( obj ){

      assert( !output, '\'data\' emitted more than once' );
      output = obj;

    }

    fromArray( input )
      .pipe( assign() )
      .on( 'data', setOnData )
      .on( 'end', ()=>{

        expect( output )
          .to.deep.equal( expected );

        done();

      } );

  } );

  it( 'should assign all data of an array', ( done )=>{

    const input = new Array( 250 )
      .fill()
      .map( ( _, index )=>( { [ `key${ index }`]: `value${ index }` } ) );

    const expected = input
      .reduce( ( obj, properties )=>Object.assign( obj, properties ), {} );

    let output;

    function setOnData( obj ){

      assert( !output, '\'data\' emitted more than once' );
      output = obj;

    }

    fromArray( input )
      .pipe( assign() )
      .on( 'data', setOnData )
      .on( 'end', ()=>{

        expect( output )
          .to.deep.equal( expected );

        done();

      } );

  } );

  it( 'should pipe all data of an array in order', ( done )=>{

    const key1
      = 'someKey';

    const key2
      = 0;

    const input = [
      { [ key1 ]: typeof key1 },
      { [ key2 ]: typeof key2 }
    ];

    const expected = {
      [ key1 ]: typeof key1,
      [ key2 ]: typeof key2
    };

    let output;

    const writeStream = require( 'stream' ).Writable( {
      objectMode: true,
      write( obj, _, next ){

        assert( !output, '\'data\' emitted more than once' );
        output = obj;
        next();

      }
    } );

    fromArray( input )
      .pipe( assign() )
      .pipe( writeStream )
      .on( 'finish', ()=>{

        expect( output )
          .to.deep.equal( expected );

        done();

      } );

  } );

} );
