/**
 * Runs each item piped in through a provided function - the this context
 * for that function will be the wrapping stream
 *
 * @param {Function } func
 *   the function to apply of format function func( {VALUE}, next );
 *
 * @returns {object}
 *   The ApplyStream instance
 */
function createApplyStream( func ){

  function transform( item, _, next ){

    process.nextTick( func.bind( this, item, next ) );

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = createApplyStream;
