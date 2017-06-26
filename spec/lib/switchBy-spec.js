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

      } )
      .resume();


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

      } )
      .resume();

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

      } )
      .resume();

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

      } )
      .resume();

  } );

  it( 'should do nothing if no match was found', ( done )=>{

    const input
      = 'any';
      
    const key
      = 'some key';
      
    function predicate( val, next ){

      next( null, key ); 

    }
  
    just( input )
      .on( 'error', onError )
      .pipe( switchBy( predicate, [] ) )
      .on( 'error', onError )
      .on( 'finish', ()=>{
        
        // we made it w/o timeout, o we are done!
        done();

      } )
      .resume();

  } );

  it( 'should execute a provided default function if no match was found', ( done )=>{

    const input
      = 'any';
      
    const key
      = 'some key';

    function predicate( val, next ){

      next( null, key ); 

    }

    function onNoMatch( val, next ){

      next( null, val );

    }
  
    let actual;

    just( input )
      .on( 'error', onError )
      .pipe( switchBy( predicate, [], onNoMatch ) )
      .on( 'error', onError )
      .on( 'data', ( value )=>{
        
        assert( actual == null );
        actual = value;

      } )
      .on( 'finish', ()=>{

        expect( actual )
          .toEqual( input );        
        done();

      } );

  } );

  it( 'should execute each function of an array, if the key matches that array', ( done )=>{

    const input
      = 'any';

    const modifier
      = 'via func';

    const key
      = 'some key';

  
    function predicate( val, next ){

      next( null, key ); 

    }

    const expected
      = [ `${ input } ${ modifier }0`, `${ input } ${ modifier }1` ];

    let actual;
    
    const thenDo = [
      ( val, next )=>next( null, `${ input } ${ modifier }${ 0 }` ),
      ( val, next )=>next( null, `${ input } ${ modifier }${ 1 }` )
    ];

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
          .toEqual( expected );
        done();

      } );

  } );

} );
