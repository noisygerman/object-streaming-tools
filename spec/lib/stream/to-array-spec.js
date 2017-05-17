describe( 'WriteToArrayStream instances', ()=>{

  const uitPath
   = process.cl_test_util.generateUITPath( __filename );

  const path
    = require( 'path' );

  const streamUtilFolder
    =  path.dirname( uitPath );
  
  const fromArrayPath
    = path.join( streamUtilFolder, 'from-array' );

  const fromArray
    = require( fromArrayPath );
  
  const toArray
    = require( uitPath );

  it( 'should write data received to an array', ( done )=>{

    const expected
      = [ 1 ];

    let actual
      = [];

    fromArray( expected )
      .pipe( toArray() )
      .on( 'data', ( output )=>actual = actual.concat( output ) )
      .on( 'end', ()=>{

        expect( expected )
          .toEqual( actual );

        done();

      } );

  } );

  it( 'should emit all data of an array', ( done )=>{

    const expected = new Array( 250 )
      .fill()
      .reduce( ( arr, _, index )=>arr.concat( index + 1 ), [] );

    let actual
      = [];

    fromArray( expected )
      .pipe( toArray() )
      .on( 'data', ( output )=>actual = actual.concat( output ) )
      .on( 'end', ()=>{

        expect( expected )
          .toEqual( actual );

        done();

      } );

  } ); 

} );
