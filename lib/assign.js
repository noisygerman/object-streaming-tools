/**
 * Creates a stream that assigns all inputs as properties to a single object,
 * emitting the results when the source stream ends
 *
 * @returns {object} the map stream instance
 */
function createAssignStream(){

  const obj
    = {};


  function transform( properties, _, next ){

    Object.assign( obj, properties );
    next();

  }

  function flush( done ){

    this.push( obj );
    done();

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform,
    flush
  } );

}

module.exports = createAssignStream;
