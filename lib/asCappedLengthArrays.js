const isNumber = require( 'lodash/isNumber' );
const assert = require( 'assert' );

function createAsCappedArrayLengthStream( maxLength = 1 ){

  assert( isNumber( maxLength ), 'maxLength must be a number' );
  assert( maxLength > 0, 'maxLength must be > 0' );

  const cache = [];

  function transform( item, _, next ){

    if( cache.length === maxLength ){

      push.call( this );
      cache.push( item );
    
    } else{

      cache.push( item );
    
    }

    next();

  }

  function flush( done ){

    if( cache.length ) push.call( this );
    done();

  }

  reset();

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform,
    flush
  } );

  function reset(){

    cache.length = 0;

  }

  function push(){

    this.push( [].concat( cache ) );
    reset();

  }

}

module.exports = createAsCappedArrayLengthStream;
