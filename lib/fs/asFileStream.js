const fs
  = require( 'fs' );

/**
 * Creates a transform stream that expects a file path and emits the file's
 * contents as a stream.
 * 
 * Aside from regular transform stream events, also emits 'eof' to signify
 * the end of the file
 * 
 * @param {String} [encoding='utf8']
 *  [optional] encoding of the file at the path 
 *  
 * @returns {Object}
 *  the transform stream
 */
function  asFileStream( encoding = 'utf8' ){

  function transform( filePath, _, next ){
  
    this.emit( 'bof', filePath );
    
    fs.createReadStream( filePath, encoding )
      .on( 'error', next )  
      .on( 'data', this.push.bind( this ) )
      .on( 'end', ()=>{
        
        this.emit( 'eof', filePath );
        next();
      
      } );
  
  }
  
  return require( 'stream' ).Transform( {
    writableObjectMode: true,
    transform
  } ); 
  
}

module.exports = asFileStream;
