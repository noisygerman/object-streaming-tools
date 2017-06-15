const just
  = require( './just' );

const forIn
  = require( './forIn' );

const filter
  = require( './filter' );

const apply
  = require( './apply' );

const asyncify
  = require( 'async/asyncify' );

/**
 * Creates a transform stream that emits the values of all properties, own or
 * inherited.
 *
 * @returns {object} the transform stream
 *
 */
function createValuesStream(){

  function transform( obj, _, next ){

    just( obj )
      .on( 'error', next )
      .pipe( forIn() )
      .on( 'error', next )
      .pipe( filter( asyncify( ( { value } )=>value != null ) ) )
      .on( 'error', next )
      .pipe( apply( asyncify( ( { value } )=>value ) ) )
      .on( 'error', next )
      .on( 'data', this.push.bind( this ) )
      .on( 'finish', next );

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = createValuesStream;
