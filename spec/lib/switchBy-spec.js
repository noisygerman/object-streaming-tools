describe( 'Instances of switchBy streams', ()=>{

  const just
    = require( '../../lib/just' );

  const switchBy
    = require( require( 'noisy-jasmine/test-util/generate-uit-path' )( __filename ) );

  function onError( err ){

    throw( err );

  }

  it( 'should call the async predicate with the value piped in', ( done )=>{

    const input
      = 'any';
      
    const key
      = 'some key';
    
    let actual;

    function predicate( val, next ){

      actual = val;
      next( null, key ); 

    }

    function onKeyMatch( _, next ){
      
      next( null, key );
     
    }
  
    just( input )
      .on( 'error', onError )
      .pipe( switchBy( predicate, [ { ifMatches: key, thenDo: onKeyMatch } ] ) )
      .on( 'error', onError )
      .on( 'finish', ()=>{

        expect( actual )
          .toBe( input );
        
        done();

      } );

  } );

} );
