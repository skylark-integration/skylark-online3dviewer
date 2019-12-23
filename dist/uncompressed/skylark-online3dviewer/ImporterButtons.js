define([
	"skylark-jquery"
],function($){
	var ImporterButtons = function (parent)
	{
		this.buttonsDiv = $('<div>').attr ('id', 'buttons').appendTo (parent);
	};

	ImporterButtons.prototype.AddLogo = function (title)
	{
		var logoDiv = $('<div>').attr ('id', 'logo').html (title).appendTo (this.buttonsDiv);
		logoDiv.click (function () {
			location.hash = '';
			location.reload ();
		});
	};

	ImporterButtons.prototype.AddButton = function (image, title, onClick)
	{
		var buttonImage = $('<img>').addClass ('topbutton').attr ('src', image).attr ('title', title).appendTo (this.buttonsDiv);
		buttonImage.click (function () {
			onClick ();
		});
	};

	ImporterButtons.prototype.AddToggleButton = function (image, toggleImage, title, onClick)
	{
		var buttonImage = $('<img>').addClass ('topbutton').attr ('src', image).attr ('title', title).appendTo (this.buttonsDiv);
		var isOn = true;
		buttonImage.click (function () {
			isOn = !isOn;
			if (isOn) {
				buttonImage.attr ('src', image);
			} else {
				buttonImage.attr ('src', toggleImage);
			}
			onClick ();
		});
	};

	return ImporterButtons;	
});