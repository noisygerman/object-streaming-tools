describe( 'The slice function', ()=>{

  const uitPath = require( 'noisy-jasmine/test-util/generate-uit-path' )( __filename );

  const asArray = require( '../../lib/asArray' );
  const fromArray = require( '../../lib/fromArray' );
  const slice = require( uitPath );

  function onError( err ){

    throw( err );
  
  }

  it( 'should emit items when they are in the specified range', ( done )=>{

    const items = ['foo', 'bar', 'baz', 'test', 'value', 'another'];
    const start = 1;
    const end = 3;
    const actual = [];
    const expected = ['bar', 'baz'];

    fromArray( items )
      .on( 'error', onError )
      .pipe( slice( start, end ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );
        done();
    
      } );
  
  } );

  it( 'should emit items from start till stream is finished when end is not defined', ( done )=>{

    const items = ['foo', 'bar', 'baz', 'test', 'value', 'another'];
    const start = 1;
    const actual = [];
    const expected = items.slice( 1 );

    fromArray( items )
      .on( 'error', onError )
      .pipe( slice( start ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );
        done();
    
      } );
  
  } );

  it( 'should throw an error if start is not a number or undefined',  ()=>{

    const startValues = ['text', undefined];
    const expected = 'start must be a number';

    startValues.forEach( ( start )=>{

      expect( ()=>slice( start ) )
        .to.throw( expected );
    
    } );
  
  } );

  it( 'should throw an error if start is < 0',  ()=>{

    const start = -1;
    const expected = 'start must be >= 0';


    expect( ()=>slice( start ) )
      .to.throw( expected );
  
  } );

  it( 'should unpipe from the stream and allow it to finish after end is reached', ( done )=>{

    const items = ['foo', 'bar'];
    const start = 0;
    const end = 1;
    const actual = [];
    const expected = ['foo'];

    fromArray( items )
      .on( 'error', onError )
      .pipe( slice( start, end ) )
      .on( 'error', onError )
      .pipe( asArray() )
      .on( 'data', ( items )=>actual.push( ...items ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );
        done();
    
      } );
  
  } );

} );
