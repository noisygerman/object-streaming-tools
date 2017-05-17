describe( 'MapStream instances', ()=>{

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
  
  const asArray
    = require( uitPath );

  it( 'should map data received to an array', ( done )=>{

    const input
      = [ 1 ];

    const output
      = [];

    fromArray( input )
      .pipe( asArray() )
      .on( 'data', ( arr )=>output.push( ...arr ) )
      .on( 'end', ()=>{

        expect( input )
          .toEqual( output );

        done();

      } );

  } );

  it( 'should emit all data of an array in order', ( done )=>{

    const input = new Array( 250 )
      .fill()
      .reduce( ( arr, _, index )=>arr.concat( index + 1 ), [] );

    const output
      = [];

    fromArray( input )
      .pipe( asArray() )
      .on( 'data', ( arr )=>output.push( ...arr ) )
      .on( 'end', ()=>{

        expect( input )
          .toEqual( output );

        done();

      } );

  } ); 

  it( 'should pipe all data of an array in order', ( done )=>{

    const input
      = [ 1, 2 ];

    const output
      = [];

    const writeStream = require( 'stream' ).Writable( {
      objectMode: true,
      write( item, _, next ){
        
        output.push( ...item );
        next();
      
      }
    } );

    fromArray( input )
      .pipe( asArray() )
      .pipe( writeStream )
      .on( 'finish', ()=>{

        expect( input )
          .toEqual( output );

        done();

      } );

  } ); 

} );
