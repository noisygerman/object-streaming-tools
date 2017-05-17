/**
 * Creates a stream that maps all inputs in an array, emitting the results when the
 * source stream ends
 *
 * @returns {object} the map stream instance
 */
function createMapStream(){

  let mappedItems
    = [];

  function transform( item, _, next ){

    mappedItems.push( item );
    next();

  }

  function flush( done ){

    const result = mappedItems; // eslint-disable-line newline-after-var
    mappedItems  = null;

    this.push( result );
    done();

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform,
    flush
  } );

}

module.exports = createMapStream;
