describe( 'findIndexStream instances', ()=>{

  const createFindIndexStream
    = require( process.cl_test_util.generateUITPath( __filename ) );

  const uitPath
    = process.cl_test_util.generateUITPath( __filename );

  const path
    = require( 'path' );

  const streamUtilFolder
    = path.dirname( uitPath );

  const fromArrayPath
    = path.join( streamUtilFolder, 'from-array' );

  const fromArray
    = require( fromArrayPath );

  const asyncify
    = require( 'async/asyncify' );

  function compare( outer, inner ){
    
    return outer === inner;

  }


  it( 'should emit each index of the streamed element in the given array', ( done )=>{

    const arr
      = [ 0, 1, 2, 3 ];

    const result
      = [];

    const expected
      = [ 0, 1, 2, 3 ];

    fromArray( arr )
      .pipe( createFindIndexStream( arr, asyncify( compare ) ) )
      .on( 'end', done )
      .on( 'data', result.push.bind( result ) )
      .on( 'finish', ()=>{

        expect( result )
          .toEqual( expected );

        done();

      } );

  } );


  it( 'should emit -1 if a given item is not found', ( done )=>{

    const sourceArray
      = [ 0 ];

    const searchArray
      = [ 3 ];

    const result
      = [];

    const expected
      = [ -1 ];

    fromArray( sourceArray )
      .pipe( createFindIndexStream( searchArray, asyncify( compare ) ) )
      .on( 'end', done )
      .on( 'data', result.push.bind( result ) )
      .on( 'finish', ()=>{

        expect( result )
          .toEqual( expected );

        done();

      } );

  } );


  it( 'should emit -1 when searching empty arrays', ( done )=>{

    const sourceArray
      = [ 0 ];

    const searchArray
      = [];

    const result
      = [];

    const expected
      = [ -1 ];

    fromArray( sourceArray )
      .pipe( createFindIndexStream( searchArray, asyncify( compare ) ) )
      .on( 'end', done )
      .on( 'data', result.push.bind( result ) )
      .on( 'finish', ()=>{

        expect( result )
          .toEqual( expected );

        done();

      } );
  
  } );


  it( 'should emit no data for empty source arrays', ( done )=>{

    const sourceArray
      = [];

    const searchArray
      = [];

    const result
      = [];

    const expected
      = [];

    fromArray( sourceArray )
      .pipe( createFindIndexStream( searchArray, asyncify( compare ) ) )
      .on( 'end', done )
      .on( 'data', result.push.bind( result ) )
      .on( 'finish', ()=>{

        expect( result )
          .toEqual( expected );

        done();

      } );
  
  } );
  
 
} );
