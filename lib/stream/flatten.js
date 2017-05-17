/**
 * Transforms incoming data, either individual items or array of items into
 * a stream of individual items.
 *
 * If an array is piped in, the contents will be emitted individually.
 * If an object is piped in, the object is individually forwarded, once
 * previously queued items have been piped out.
 *
 * @returns {object}
 *  a stream that will emit items of the array data it receives
 *
 */
function createFlattenStream(){

  function transform( item, _, next ){

    // should never happen, but who knows, the world is a dangerous place
    if( item == null ) return next();
    if( !Array.isArray( item ) ) return process.nextTick( next.bind( null, null, item ) );

    // don't modify the source
    item = [].concat( item );

    while( item.length ){

      const nextItem = item.shift();

      if( nextItem != null ) return process.nextTick( ()=>{ // eslint-disable-line curly

        this.push( nextItem );
        transform.call( this, item, _, next );

      } );

    }

    next();

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = createFlattenStream;

