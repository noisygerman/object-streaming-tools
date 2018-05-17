describe( 'Instances of asCappedArray streams', ()=>{

  const generateUITPath
    = require( 'noisy-jasmine/test-util/generate-uit-path' );

  const just
    = require( '../../lib/just' );

  const asCappedArray
    = require( generateUITPath( __filename ) );

  function onError( err ){

    throw( err );

  }

  it( 'should emit all items in a single object if the max buffer size is not reached', ( done )=>{

    const input = [
      { key: 'item1' },
      { key: 'item2' }
    ];

    const expected = [
      input
    ];

    const actual = [
    ];

    const maxBufferSizeInByte
      =  Buffer.byteLength( JSON.stringify( input[ 0 ] ) ) * 2;

    just( ...input )
      .on( 'error', onError )
      .pipe( asCappedArray( maxBufferSizeInByte ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );

        done();

      } );

  } );

  it( 'should emit items split over multiple objects if the max buffer size is reached', ( done )=>{

    const input = [
      'item1',
      'item2'
    ];

    const expected = [
      [ input[0] ],
      [ input[1] ]
    ];

    const actual = [
    ];

    const maxBufferSizeInByte
      =  Buffer.byteLength( JSON.stringify( input[ 0 ] ) );

    just( ...input )
      .on( 'error', onError )
      .pipe( asCappedArray( maxBufferSizeInByte ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );

        done();

      } );

  } );

  it( 'should emit items that exceed the bufferSize as individual objects', ( done )=>{

    const input = 'item';

    const expected = [
      [ input ]
    ];

    const actual = [
    ];

    const maxBufferSizeInByte
      =  Buffer.byteLength( JSON.stringify( input ) ) / 2;

    just( input )
      .on( 'error', onError )
      .pipe( asCappedArray( maxBufferSizeInByte ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );

        done();

      } );

  } );


  it( 'should not combine items that exceed the bufferSize with other objects', ( done )=>{

    const input = [
      '1',
      'item2',
      '3'
    ];

    const expected = [
      [ input[0] ],
      [ input[1] ],
      [ input[2] ]
    ];

    const actual = [
    ];

    const maxBufferSizeInByte
      =  Buffer.byteLength( JSON.stringify( input[ 1 ] ) ) / 2;

    just( ...input )
      .on( 'error', onError )
      .pipe( asCappedArray( maxBufferSizeInByte ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );

        done();

      } );

  } );

} );
