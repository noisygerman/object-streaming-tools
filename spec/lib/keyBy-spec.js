describe( 'KeyByStream instances', ()=>{

  const generateUITPath
    = require( 'noisy-jasmine/test-util/generate-uit-path' );

  const createKeyAssignStream
    = require( generateUITPath( __filename ) );

  const assert
    = require( 'assert' );

  it( 'should map data received to an object keyed by the iteratee it was created with', ( done )=>{

    const key
      = 'someKey';

    const value1
      = 'item1';

    const value2
      = 'item2';

    const input = [
      { [ key ]: value1, stringKey: typeof '' },
      { [ key ]: value2, 0: typeof 0 }
    ];

    const expected = {
      [ value1 ]: input[ 0 ],
      [ value2 ]: input[ 1 ]
    };

    let output;

    function setOnData( obj ){

      assert( !output, '\'data\' emitted more than once' );
      output = obj;

    }

    const stream = createKeyAssignStream( key )
      .on( 'data', setOnData )
      .on( 'finish', ()=>{

        expect( output )
          .to.deep.equal( expected );

        done();

      } );

    input.forEach( stream.write, stream );
    stream.end();

  } );

  it( 'should support functions as iteratees', ( done )=>{

    const key
      = 'someKey';

    const value
      = 'item';

    const input = {
      [ key ]:           value,
      someOtherProperty: typeof ''
    };

    const expectedKey
      =  `Modified value '${ input[ key ] }'`;

    const expected = {
      [ expectedKey ]: input
    };

    let output;

    function keyBy( obj ){

      return `Modified value '${ obj[ key ] }'`;

    }

    const writeStream = require( 'stream' ).Writable( {
      objectMode: true,
      write( obj, _, next ){

        assert( !output, '\'data\' emitted more than once' );
        output = obj;
        next();

      }
    } );

    const stream
      = createKeyAssignStream( keyBy );

    stream
      .pipe( writeStream )
      .on( 'finish', ()=>{

        expect( output )
          .to.deep.equal( expected );

        done();

      } );

    stream.write( input );
    stream.end();

  } );

  it( 'should emit an error if a key value is not returned by the iteratee', ( done )=>{

    const someKey
      = 'key';

    const someInvalidInput
      = {}; // someInvalidInput[ someKey ] will return null, making input invalid

    function onEvent( err ){

      expect( err )
        .to.exist;

      done();

    }

    const stream = createKeyAssignStream( someKey )
      .on( 'error', onEvent )
      .on( 'finish', onEvent );

    stream.write( someInvalidInput );
    stream.end();


  } );

  it( 'should thow if no iteratee is provided', ()=>{

    expect( createKeyAssignStream )
      .to.throw();

  } );

} );
