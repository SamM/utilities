var llac = require('./llac');

function callbackApp(execute){
	var scope = this;
	var setup_args = Array.prototype.slice.call(arguments, 1);
	if(typeof execute == 'string') execute = scope[execute];
	if(typeof execute == 'object'){
		return application.apply(execute, Array.prototype.slice.call(arguments, 1))
	}
	if(typeof execute != 'function'){
		return function(){
			var args = Array.prototype.slice.call(arguments);
			return application.apply(scope, args);
		};
    }
	var application = function(){
		var pre_args = Array.prototype.slice.call(arguments);
        pre_args = setup_args.concat(pre_args);
        var callback = llac();
		var apply = function(){
			var args = Array.prototype.slice.call(arguments);
			args = pre_args.concat(args);
            var listen = execute.apply(scope, args);
            if(typeof listen == 'function'){
                listen(callback);
            }else{
                if(Array.isArray(listen)){
                    callback.apply(scope, listen);
                }else{
                    callback(listen);
                }
            }
            return apply.listen;
        };
        apply.callback = apply;
        callback.callback = apply;
        callback.listen.callback = apply;
        apply.listen = callback.listen;
        apply.listen(application.callback);
        apply.listenCall = callback.listenCall;
        apply.callListen = callback.callListen;
        return apply;
    };
    application.callback = llac();
    application.listen = application.callback.listen;
    application.listenCall = application.callback.listenCall;
    application.callListen = application.callback.callListen;
    return application;
}

var module;
if(typeof module == 'object'){
    module.exports = callbackApp;
}