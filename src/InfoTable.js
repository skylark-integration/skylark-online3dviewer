define([
	"skylark-jquery"
],function($){
	var InfoTable = function (parent)
	{
		this.table = $('<table>').addClass ('infotable').appendTo (parent);
	};

	InfoTable.prototype.AddRow = function (name, value)
	{
		var tableRow = $('<tr>').appendTo (this.table);
		$('<td>').html (name).appendTo (tableRow);
		$('<td>').html (value).appendTo (tableRow);
	};

	InfoTable.prototype.AddColorRow = function (name, color)
	{
		var tableRow = $('<tr>').appendTo (this.table);
		$('<td>').html (name).appendTo (tableRow);

		var valueColumn = document.createElement ('td');
		var valueColumn = $('<td>').appendTo (tableRow);
		
		var colorDiv = $('<div>').addClass ('colorbutton').appendTo (valueColumn);
		colorDiv.attr ('title', '(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')');
		var hexColor = JSM.RGBComponentsToHexColor (color[0] * 255.0, color[1] * 255.0, color[2] * 255.0);
		var colorString = hexColor.toString (16);
		while (colorString.length < 6) {
			colorString = '0' + colorString;
		}
		colorDiv.css ('background', '#' + colorString);
	};

	return InfoTable;	
});