describe( 'Instances of switchBy streams', ()=>{

  const assert
    = require( 'assert' );
  
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

    function thenDo( _, next ){
      
      next( null, key );
     
    }
  
    just( input )
      .on( 'error', onError )
      .pipe( switchBy( predicate, [ { ifMatches: key, thenDo } ] ) )
      .on( 'error', onError )
      .on( 'finish', ()=>{

        expect( actual )
          .toBe( input );
        
        done();

      } );

  } );

  it( 'should call matching functions with the original value', ( done )=>{

    const input
      = 'any';
      
    const key
      = 'some key';
    
    let actual;

    function predicate( val, next ){

      next( null, key ); 

    }

    function thenDo( val, next ){
      
      actual = val;
      next( null, key );
     
    }
  
    just( input )
      .on( 'error', onError )
      .pipe( switchBy( predicate, [ { ifMatches: key, thenDo } ] ) )
      .on( 'error', onError )
      .on( 'finish', ()=>{

        expect( actual )
          .toBe( input );
        
        done();

      } );

  } );

  it( 'should return the result of the matched function', ( done )=>{

    const input
      = 'any';

    const modifier
      = 'old string';

    const key
      = 'some key';
    
    let expected;

    function predicate( val, next ){

      next( null, key ); 

    }

    function thenDo( val, next ){

      assert( expected == null );

      expected = `${ val } ${ modifier }`;
      next( null, expected );
     
    }
  
    let actual;

    just( input )
      .on( 'error', onError )
      .pipe( switchBy( predicate, [ { ifMatches: key, thenDo } ] ) )
      .on( 'error', onError )
      .on( 'data', ( result )=>{

        assert( actual == null );
        actual = result;

      } )
      .on( 'finish', ()=>{

        expect( actual )
          .toBe( expected );
        
        done();

      } );

  } );

  it( 'should allow for objects as keys', ( done )=>{

    const input
      = 'any';
      
    const key
      = 'some key';
      
    const keyObj
      = { key };

    let wasCalled;

    function predicate( val, next ){

      next( null, keyObj ); 

    }

    function thenDo( val, next ){
      
      wasCalled = true;
      next();
     
    }
  
    just( input )
      .on( 'error', onError )
      .pipe( switchBy( predicate, [ { ifMatches: keyObj, thenDo } ] ) )
      .on( 'error', onError )
      .on( 'finish', ()=>{

        expect( wasCalled )
          .toBe( true );
        
        done();

      } );

  } );


} );
