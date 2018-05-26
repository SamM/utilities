function application(execute){
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
	return function(){
		var pre_args = Array.prototype.slice.call(arguments);
		pre_args = setup_args.concat(pre_args);
		return function(){
			var args = Array.prototype.slice.call(arguments);
			args = pre_args.concat(args);
			return execute.apply(scope, args);
		};
	};
}
var module;
if(typeof module == 'object'){
    module.exports = application;
}