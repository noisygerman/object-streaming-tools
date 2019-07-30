const isNumber = require( 'lodash/isNumber' );
const inRange = require( 'lodash/inRange' );
const assert = require( 'assert' );

function createSliceStream( start, end = Infinity ){

  assert( isNumber( start ) , 'start must be a number' );
  assert( start >= 0, 'start must be >= 0' );
  assert( isNumber( end ), 'end must be a number' );

  let index = 0;

  function transform( item, _, next ){

    if( index == end ){

      this.push( null );
      return next();
    
    }

    if( inRange( index, start, end ) ){

      index++;

      return next( null, item );
    
    }

    index++;
    return next();

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = createSliceStream;
