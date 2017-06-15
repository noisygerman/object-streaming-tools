const isNumber
  = require( 'lodash/isNumber' );

const assert
  = require( 'assert' );

/**
 * Creates a stream that emits a arrays of items piped in, limited in
 * JSON string size to the value specified in maxBufferSizeInBytes.
 *
 *  1. collects items until the bytes-size of the strings generated for the
 *     items collected would match or exceed bufferMaxSizeInBytes
 *  2. emits the items array
 *  3. creates a new array, starting over at step 1.
 *
 * On flush, the contents of the last collected are emitted as needed.
 *
 * @param {number} [maxBufferSizeInBytes=128000]
 *  the maximum number the sum of the size of all items my have before emitting
 *  a buffer
 * @returns {object}
 *  the stream created
 */
function createAsCappedArraysStream( maxBufferSizeInBytes = 128000 ){

  assert( isNumber( maxBufferSizeInBytes ), 'maxBufferSizeInBytes' );
  assert( maxBufferSizeInBytes > 0, 'maxBufferSizeInBytes' );

  const cache = [];
  let currentItemsLengthInBytes;

  function transform( item, _, next ){

    const itemLengthInBytes
      = Buffer.byteLength( JSON.stringify( item ) );

    const totalItemsLengthInBytes
      = currentItemsLengthInBytes + itemLengthInBytes;

    if( totalItemsLengthInBytes >= maxBufferSizeInBytes ){

      // if the item's size by itself matches or exceeds bufferMaxSizeInBytes
      // we don't need to wait for the next item before we emit the buffer
      if( currentItemsLengthInBytes === 0 || totalItemsLengthInBytes === maxBufferSizeInBytes ){

        cache.push( item );
        push.call( this );

      } else {

        push.call( this );
        cache.push( item );
        currentItemsLengthInBytes = itemLengthInBytes;

      }

    } else {

      cache.push( item );
      currentItemsLengthInBytes = totalItemsLengthInBytes;

    }

    next();

  }

  function flush( done ){

    if( currentItemsLengthInBytes ) push.call( this );
    done();

  }

  reset();

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform,
    flush
  } );


  function reset(){

    cache.length
      = currentItemsLengthInBytes
      = 0;

  }

  function push(){

    this.push( [].concat( cache ) );
    reset();

  }

}

module.exports = createAsCappedArraysStream;

