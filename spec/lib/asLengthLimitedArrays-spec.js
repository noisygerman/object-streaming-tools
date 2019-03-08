describe( 'The asLengthLimitedArrays function', ()=>{

  const uitPath = require( 'noisy-jasmine/test-util/generate-uit-path' )( __filename );

  const fromArray = require( '../../lib/fromArray' );
  const asLengthLimitedArrays = require( uitPath );

  function onError( err ){

    throw( err );
  
  }

  it( 'should emit items split with the maxLength specified if they exceed it', ( done )=>{

    const items = ['foo', 'bar', 'baz'];
    const maxLength = 2;
    const actual = [];
    const expected = [['foo', 'bar'], ['baz']];

    fromArray( items )
      .on( 'error', onError )
      .pipe( asLengthLimitedArrays( maxLength ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );
        done();
    
      } );
  
  } );

  it( 'should emit all items if they do not exceed maxLength specified', ( done )=>{

    const items = ['foo', 'bar', 'baz'];
    const maxLength = 5;
    const actual = [];
    const expected = [['foo', 'bar', 'baz']];

    fromArray( items )
      .on( 'error', onError )
      .pipe( asLengthLimitedArrays( maxLength ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );
        done();
    
      } );
  
  } );

  it( 'should emit items one by one if maxLength is not specified', ( done )=>{

    const items = ['foo', 'bar', 'baz'];
    const actual = [];
    const expected = [['foo'], ['bar'], ['baz']];

    fromArray( items )
      .on( 'error', onError )
      .pipe( asLengthLimitedArrays() )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( actual )
          .to.deep.equal( expected );
        done();
    
      } );
  
  } );

  it( 'should throw an error if maxLength is <= 0', ()=>{

    const expected = 'maxLength must be > 0';

    const maxLengths = [0, -1];

    maxLengths.forEach( ( maxLength )=>{

      expect( ()=>asLengthLimitedArrays( maxLength ) )
        .to.throw( expected );
    
    } );
    
  
  } );
  

} );
