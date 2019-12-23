define([
	"skylark-jquery"
],function($){
	var ExtensionButtons = function (parent)
	{
		this.buttonsDiv = $('<div>').attr ('id', 'extbuttons').appendTo (parent);
	};

	ExtensionButtons.prototype.GetButtonsDiv = function ()
	{
		return this.buttonsDiv;
	};
	
	return ExtensionButtons;	
});