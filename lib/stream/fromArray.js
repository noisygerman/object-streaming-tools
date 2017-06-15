/**
 * Wraps the array provided in a readable stream, emitting items
 * in the array on read
 *
 * @note: The array will not be modified
 *
 * @param { any[] } arr
 *  The array to streamify
 *
 * @returns { object } a stream that will emit chunk of the array on read
 *
 */
function createArrayReadStream( arr ){

  arr = arr || [];
  return require( './just' )( ...arr );

}

module.exports = createArrayReadStream;
