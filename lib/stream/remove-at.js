const assert
  = require( 'assert' );

/**
 * Creates a transform stream that removes items from the provided array at
 * the index piped in.
 *
 * @param {any[]} arr
 *  The array from which to remove items
 *
 * @returns {object} the transform stream created
 */
function createRemoveAtStream( arr ){

  assert( Array.isArray( arr ), `Expected array, got ${ typeof arr }` );

  function transform( index, _, next ){

    if( index < 0 || index >= arr.length ) return next( new RangeError( `index ${ index } is out of range` ) );

    const item = arr.splice( index, 1 )[ 0 ];

    if( item != null ) this.push( item );
    next();

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = createRemoveAtStream;

