describe( 'Instances of asFileStream streams', ()=>{

  const just
    = require( '../../../lib/stream/just' );

  const asFileStream
    = require( process.cl_test_util.generateUITPath( __filename ) );

  function onError( err ){

    throw( err );

  }

  const mockFsConfig = {
    file:        'contents of file',
    anotherFile: 'contents of anotherFile'
  };

  const mockFs
    = require( 'mock-fs' ); 

  beforeEach( ()=>mockFs( mockFsConfig ) );
  afterEach( ()=>mockFs.restore() );
  

  it( 'should emit the contents of the file at a given path', ( done )=>{

    const input
      = 'file';

    const expected
      = mockFsConfig.file;

    const actual
      = [];

    just( input )
      .on( 'error', onError )
      .pipe( asFileStream() )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{
     
        expect( expected )
          .toEqual( actual.join() );

        done();

      } );

  } );

  it( 'should emit "eof" with the original file path at the end of each file', ( done )=>{
  
    const input
      = Object.keys( mockFsConfig );

    const expected
      = input;

    const actual
      = [];

    just( ...input )
      .on( 'error', onError )
      .pipe( asFileStream() )
      .on( 'error', onError )
      .on( 'eof', actual.push.bind( actual ) )
      .on( 'finish', ()=>{
     
        expect( expected )
          .toEqual( actual );

        done();

      } );
 
  } );

  it( 'should emit "bof" with the original file path at the beginning of each file', ( done )=>{
  
    const input
      = Object.keys( mockFsConfig );

    const expected
      = input;

    const actual
      = [];

    let firstDataEmitted = 0;
    let firstBofEmitted = 0;
    
    just( ...input )
      .on( 'error', onError )
      .pipe( asFileStream() )
      .on( 'error', onError )
      .on( 'data', ()=>{

        if( firstDataEmitted === 0 ) firstDataEmitted = firstBofEmitted + 1;

      } )
      .on( 'bof', ( filePath )=>{
       
        actual.push( filePath );
        if( firstBofEmitted === 0 ) firstBofEmitted = 1;
       
      } )
      .on( 'finish', ()=>{
     
        expect( expected )
          .toEqual( actual );

        expect( firstBofEmitted )
          .toBeLessThan( firstDataEmitted );
        
        done();

      } );
 
  } );

} );
