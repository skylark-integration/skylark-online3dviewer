define([
	"skylark-jquery"
],function($){
	var FloatingControl = function ()
	{
		this.parent = null;
		this.controlDiv = null;
		this.contentDiv = null;
	};

	FloatingControl.prototype.Open = function (parameters)
	{
		if (this.controlDiv !== null) {
			this.Close ();
		}
		this.parent = parameters.parent;
		this.controlDiv = $('<div>').addClass ('control').appendTo ($('body'));
		this.contentDiv = $('<div>').addClass ('controlcontent').html (parameters.text).appendTo (this.controlDiv);	
		this.Resize ();
	};

	FloatingControl.prototype.Close = function ()
	{
		if (this.controlDiv === null) {
			return;
		}
		
		this.controlDiv.remove ();
		this.controlDiv = null;
	};

	FloatingControl.prototype.Resize = function ()
	{
		if (this.controlDiv === null) {
			return;
		}
		
		this.controlDiv.css ('left', (this.parent.offset ().left + (this.parent.width () - this.controlDiv.width ()) / 2.0) + 'px');
		this.controlDiv.css ('top', (this.parent.offset ().top + (this.parent.height () - this.controlDiv.height ()) / 3.0) + 'px');
	};

	return FloatingControl;	
});