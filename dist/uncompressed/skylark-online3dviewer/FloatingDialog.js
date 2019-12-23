define([
	"skylark-jquery"
],function($){
	var FloatingDialog = function ()
	{
		this.dialogDiv = null;
		this.contentDiv = null;
	};

	FloatingDialog.prototype.Open = function (parameters)
	{
		function AddButton (dialog, parent, button)
		{
			var buttonDiv = $('<div>').addClass ('dialogbutton').html (button.text).appendTo (parent);
			buttonDiv.click (function () {
				button.callback (dialog);
			});
		}

		if (this.dialogDiv !== null) {
			this.Close ();
		}

		this.dialogDiv = $('<div>').addClass ('dialog').appendTo ($('body'));
		$('<div>').addClass ('dialogtitle').html (parameters.title).appendTo (this.dialogDiv);
		this.contentDiv = $('<div>').addClass ('dialogcontent').appendTo (this.dialogDiv);
		if (parameters.text !== null && parameters.text !== undefined) {
			this.contentDiv.html (parameters.text);
		}
		var buttonsDiv = $('<div>').addClass ('dialogbuttons').appendTo (this.dialogDiv);

		var i, button;
		for (i = 0; i < parameters.buttons.length; i++) {
			button = parameters.buttons[i];
			AddButton (this, buttonsDiv, button);
		}

		document.addEventListener ('click', this.MouseClick.bind (this), true);
		this.Resize ();
	};

	FloatingDialog.prototype.Close = function ()
	{
		if (this.dialogDiv === null) {
			return;
		}
		
		this.dialogDiv.remove ();
		this.dialogDiv = null;
		$('body').unbind ('click');
	};

	FloatingDialog.prototype.GetContentDiv = function ()
	{
		return this.contentDiv;
	};

	FloatingDialog.prototype.Resize = function ()
	{
		if (this.dialogDiv === null) {
			return;
		}
		
		this.dialogDiv.css ('left', ((document.body.clientWidth - this.dialogDiv.width ()) / 2.0) + 'px');
		this.dialogDiv.css ('top', ((document.body.clientHeight - this.dialogDiv.height ()) / 3.0) + 'px');
	};

	FloatingDialog.prototype.MouseClick = function (clickEvent)
	{
		if (this.dialogDiv === null) {
			return;
		}

		var dialogClicked = false;
		var target = clickEvent.target;
		while (target !== null) {
			if (target === this.dialogDiv.get ()[0]) {
				dialogClicked = true;
			}
			target = target.parentElement;
		}
		
		if (!dialogClicked) {
			this.Close ();
		}
	};

	return FloatingDialog;
});