/**
 * Created by miganga on 5/30/14.
 */

/*check for existence returns false for null, undefined, {}.notHere, (function(){})*/
function existy(x) { return x != null}

/*checks for true, returns false for false, undefined*/
function truthy(x) { return (x != false) && existy(x) }

/*improved console log function*/
function clog(message,data) { var msg = message || 'Custom';console.log(  msg + ' : '+ data) }
