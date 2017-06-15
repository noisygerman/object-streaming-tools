/**
 * Emits key/value pairs for each property of objects piped in
 *
 * @returns {object}
 *  a stream that will emit items of the array data it receives
 *
 */
function createForInStream(){

  function transform( item, _, next ){

    // should never happen, but who knows, the world is a dangerous place
    if( item == null ) return next();

    const obj
      = item.toJSON ? item.toJSON() : item;

    const keys
      = streamableKeys( obj );
    
    if( !keys.length ) return next();
    process.nextTick(  publish.bind( this, keys, obj, next ) );

  }


  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = createForInStream;

/* internal functions */

function streamableKeys( obj ){

  const keys
    = [];

  for( const key in obj ){

    if( obj[ key ] != null && typeof obj[ key ] !== 'function' ) keys.push( key );
  
  }

  return keys;

}

function publish( keys, obj, next ){

  if( !keys.length ) return next();

  const key
    = keys.shift();

  const value
    = obj[ key ];

  return process.nextTick( ()=>{ // eslint-disable-line curly

    this.push( { key, value } );
    publish.call( this, keys, obj, next );

  } );

}
