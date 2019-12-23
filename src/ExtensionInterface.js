define([],function(){
	var ExtensionInterface = function (app)
	{
		this.app = app;
	};

	ExtensionInterface.prototype.GetButtonsDiv = function ()
	{
		return this.app.extensionButtons.GetButtonsDiv ();
	};

	ExtensionInterface.prototype.GetModelJson = function ()
	{
		return this.app.viewer.GetJsonData ();
	};

	return ExtensionInterface;	
});