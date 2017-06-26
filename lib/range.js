/**
 * Streams out each integer in the range provided, inclusive
 *
 * Similar to RxJs 'range' operator
 *
 * @param {number} start
 *   Integer to start from (inclusive)
 *
 * @param {number} end
 *   Integer to end on (inclusive)
 *
 * @returns {object}
 *   A stream that will emit each integer in the range,
 *   including start and end
 *
 */
function createRangeStream( start, end ){

  if( !Number.isInteger( start ) || !Number.isInteger( end ) ) throw new Error( 'start and end must be integers' );

  let current = start;

  function read( n ){

    if( current > end ) return process.nextTick( this.push.bind( this, null ) );

    while( current <= end && n ){

      const next = current;

      n--;
      current++;
      process.nextTick( this.push.bind( this, next ) );

    }

  }

  return require( 'stream' ).Readable( {
    objectMode: true,
    read
  } );

}

module.exports = createRangeStream;
