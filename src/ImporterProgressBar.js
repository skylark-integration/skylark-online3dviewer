define([
	"skylark-jquery"
],function($){
	var ImporterProgressBar = function (parent)
	{
		this.parent = parent;
		this.borderDiv = null;
		this.contentDiv = null;
		this.maxCount = null;
		this.maxWidth = null;
	};

	ImporterProgressBar.prototype.Init = function (maxCount)
	{
		this.borderDiv = $('<div>').addClass ('progressbarborder').appendTo (this.parent);
		this.contentDiv = $('<div>').addClass ('progressbarcontent').appendTo (this.borderDiv);

		this.maxCount = maxCount;
		this.maxWidth = this.borderDiv.width ();
		this.Step (0);
	};

	ImporterProgressBar.prototype.Step = function (count)
	{
		var step = this.maxWidth / this.maxCount;
		var width = count * step;
		if (count == this.maxCount) {
			width = this.maxWidth;
		}
		this.contentDiv.width (width);
	};
	
	return ImporterProgressBar;
});