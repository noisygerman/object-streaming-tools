describe( 'UniqueStream instances', ()=>{

  const generateUITPath
    = require( 'noisy-jasmine/test-util/generate-uit-path' );

  const uniqueBy
    = require( generateUITPath( __filename ) );

  describe( 'for a string iteratee', ()=>{

    it( 'should directly emit items that are unique', ( done )=>{

      const input
        = [{ id: 'foo' }, { id: 'bar' }, { id: 'foo' }];
  
      const actual
        = [];
  
      const expected
        = [ { id: 'foo' }, { id: 'bar' } ];
  
      const stream = uniqueBy( 'id' )
        .on( 'data', actual.push.bind( actual ) )
        .on( 'finish', ()=>{
  
          expect( actual )
            .to.deep.equal( expected );
  
          done();
  
        } );
  
      input.forEach( stream.write.bind( stream ) );
      stream.end();
  
    } );
  
    it( 'should emit duplicate items via the "duplicate" event', ( done )=>{
  
      const input
        = [{ id: 'foo' }, { id: 'bar' }, { id: 'foo' }, { id: 'bar' }, { id: 'fum' }];
  
      const actual
        = [];
  
      const expected
        = [ { id: 'foo' }, { id: 'bar' } ];
  
      const stream = uniqueBy( 'id' )
        .on( uniqueBy.DuplicateEventKey, actual.push.bind( actual ) )
        .on( 'finish', ()=>{
  
          expect( actual )
            .to.deep.equal( expected );
  
          done();
  
        } )
        .resume();
  
      input.forEach( stream.write.bind( stream ) );
      stream.end();
  
    } );
  
  } );

  describe( 'for a function iteratee', ()=>{

    it( 'should directly emit items that are unique', ( done )=>{

      const input
        = [1.1, 1.2, 2.3, 2.4];
  
      const actual
        = [];
  
      const expected
        = [1.1, 2.3];
  
      const stream = uniqueBy( Math.floor )
        .on( 'data', actual.push.bind( actual ) )
        .on( 'finish', ()=>{
  
          expect( actual )
            .to.deep.equal( expected );
  
          done();
  
        } );
  
      input.forEach( stream.write.bind( stream ) );
      stream.end();
  
    } );
  
    it( 'should emit duplicate items via the "duplicate" event', ( done )=>{
  
      const input
        = [1.1, 1.2, 2.3, 2.4];
  
      const actual
        = [];
  
      const expected
        = [ 1.2, 2.4 ];
  
      const stream = uniqueBy( Math.floor )
        .on( uniqueBy.DuplicateEventKey, actual.push.bind( actual ) )
        .on( 'finish', ()=>{
          
          expect( actual )
            .to.deep.equal( expected );
  
          done();
  
        } )
        .resume();
  
      input.forEach( stream.write.bind( stream ) );
      stream.end();
  
    } );
  
  } );

} );
