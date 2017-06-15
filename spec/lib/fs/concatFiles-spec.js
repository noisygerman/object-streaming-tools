describe( 'Instances of concatFiles streams', ()=>{

  const just
    = require( '../../../lib/stream/just' );

  const concatFiles
    = require( process.cl_test_util.generateUITPath( __filename ) );

  function onError( err ){

    throw( err );

  }

  const mockFsConfig = {
    dirPath: {
      file1: 'contents of file1',
      file2: 'contents of file2',
      file3: 'long file'.repeat( 500 )
    }
  };

  const mockFs
    = require( 'mock-fs' ); 

  beforeEach( ()=>mockFs( mockFsConfig ) );
  afterEach( ()=>mockFs.restore() );
  
  it( 'should emit contents of files in a directory as a continuous stream', ( done )=>{

    const input = [
      'file1',
      'file2'
    ];

    const expected = [
      mockFsConfig.dirPath.file1,
      mockFsConfig.dirPath.file2
    ].join( '' );

    const actual
      = [];

    just( input )
      .on( 'error', onError )
      .pipe( concatFiles( 'dirPath' ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( expected )
          .toEqual( actual.join( '' ) );

        done();

      } );

  } );


  it( 'should inject a delimiter in between contents of files', ( done )=>{
 
    const input = [
      'file1',
      'file2'
    ];

    const delimiter
      = ', ';

    const expected = [
      mockFsConfig.dirPath.file1,
      mockFsConfig.dirPath.file2
    ].join( delimiter );

    const actual
      = [];

    just( input )
      .on( 'error', onError )
      .pipe( concatFiles( 'dirPath', delimiter ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( expected )
          .toEqual( actual.join( '' ) );

        done();

      } );


  } );

  it( 'should support empty file lists ', ( done )=>{
 
    const input
      = [];

    const actual
      = [];

    just( input )
      .on( 'error', onError )
      .pipe( concatFiles( 'dirPath' ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( input )
          .toEqual( actual );

        done();

      } );


  } );

  it( 'should support non-null falsey values as delimiters', ( done )=>{
  
    const input = [
      'file1',
      'file2'
    ];

    const delimiter
      = false;

    const expected = [
      mockFsConfig.dirPath.file1,
      mockFsConfig.dirPath.file2
    ].join( delimiter );

    const actual
      = [];

    just( input )
      .on( 'error', onError )
      .pipe( concatFiles( 'dirPath', delimiter ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( expected )
          .toEqual( actual.join( '' ) );

        done();

      } );


  } );

  it( 'should ignore null-falsey values as delimiters', ( done )=>{
  
    const input = [
      'file1',
      'file2'
    ];

    const delimiter
      = undefined;

    const expected = [
      mockFsConfig.dirPath.file1,
      mockFsConfig.dirPath.file2
    ].join( '' );

    const actual
      = [];

    just( input )
      .on( 'error', onError )
      .pipe( concatFiles( 'dirPath', delimiter ) )
      .on( 'error', onError )
      .on( 'data', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( expected )
          .toEqual( actual.join( '' ) );

        done();

      } );


  } );

  it( 'should emit "bof" when a new file starts', ( done )=>{
  
    const input = [
      'file3',
      'file2'
    ];

    const dirPath
      = 'dirPath';

    const path
      = require( 'path' );

    const expected = [
      path.join( dirPath, input[0] ),
      path.join( dirPath, input[1] )
    ];

    let firstDataEmitted = 0;
    let firstBofEmitted = 0;
    
    const actual
      = [];

    just( input )
      .on( 'error', onError )
      .pipe( concatFiles( 'dirPath' ) )
      .on( 'error', onError )
      .on( 'data', ()=>{

        if( firstDataEmitted === 0 ) firstDataEmitted = firstBofEmitted + 1;

      } )
      .on( 'bof', ()=>{
       
        if( firstBofEmitted === 0 ) firstBofEmitted = 1;

      } )
      .on( 'bof', actual.push.bind( actual ) )
      .on( 'finish', ()=>{

        expect( expected )
          .toEqual( actual );
       
        expect( firstBofEmitted )
          .toBeLessThan( firstDataEmitted );

        done();

      } );


  } );

} );
