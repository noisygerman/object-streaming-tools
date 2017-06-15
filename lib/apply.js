/**
 * Runs each item piped in through a provided function
 *
 * @param {Function } func
 *   the function to apply of format function func( {VALUE}, next );
 *
 * @returns {object}
 *   The ApplyStream instacne
 */
function createApplyStream( func ){

  function transform( item, _, next ){

    process.nextTick( func.bind( null, item, next ) );

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = createApplyStream;
