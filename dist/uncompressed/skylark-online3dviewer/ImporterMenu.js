define([
	"skylark-jquery",
	"./ImporterProgressBar",
	"./ImporterButtons"	
],function($,ImporterProgressBar,ImporterButtons){
	function IsSet (val)
	{
		return val !== undefined && val !== null;
	}

	var ImporterMenuItem = function (parentDiv, name, parameters)
	{
		this.parentDiv = parentDiv;
		this.parameters = parameters;

		this.menuItemDiv = null;
		this.isOpen = null;
		this.openCloseImage = null;
		this.contentDiv = null;

		this.Initialize (name);
	};

	ImporterMenuItem.prototype.Initialize = function (name)
	{
		this.menuItemDiv = $('<div>').addClass ('menuitem').appendTo (this.parentDiv);
		if (IsSet (this.parameters)) {
			if (IsSet (this.parameters.id)) {
				this.menuItemDiv.attr ('id', this.parameters.id);
			}
			if (IsSet (this.parameters.openCloseButton)) {
				this.AddOpenCloseButton ();
			}
			if (IsSet (this.parameters.userButtons)) {
				var i, userButton;
				for (i = 0; i < this.parameters.userButtons.length; i++) {
					userButton = this.parameters.userButtons[i];
					this.AddUserButton (userButton);
				}
			}
		}

		var menuItemTextDiv = $('<div>').addClass ('menuitem').html (name).attr ('title', name).appendTo (this.menuItemDiv);
		if (IsSet (this.parameters) && IsSet (this.parameters.openCloseButton)) {
			menuItemTextDiv.css ('cursor', 'pointer');
		}
	};

	ImporterMenuItem.prototype.AddSubItem = function (name, parameters)
	{
		return new ImporterMenuItem (this.contentDiv, name, parameters);
	};

	ImporterMenuItem.prototype.GetContentDiv = function ()
	{
		return this.contentDiv;
	};

	ImporterMenuItem.prototype.AddOpenCloseButton = function ()
	{
		var myThis = this;
		this.isOpen = false;
		this.contentDiv = $('<div>').addClass ('menuitemcontent').hide ().appendTo (this.parentDiv);
		this.openCloseImage = $('<img>').addClass ('menubutton').attr ('title', this.parameters.openCloseButton.title).appendTo (this.menuItemDiv);
		this.openCloseImage.attr ('src', 'images/closed.png');
		this.menuItemDiv.click (function () {
			myThis.SetOpen (!myThis.isOpen);
		});
	};

	ImporterMenuItem.prototype.AddUserButton = function (userButton)
	{
		var userImage = $('<img>').addClass ('menubutton').attr ('title', userButton.title).appendTo (this.menuItemDiv);
		if (IsSet (userButton.id)) {
			userImage.attr ('id', userButton.id);
		}
		if (IsSet (userButton.onCreate)) {
			userButton.onCreate (userImage, userButton.userData);
		}
		if (IsSet (userButton.onClick) || IsSet (userButton.onCtrlClick)) {
			userImage.click (function (event) {
				event.stopPropagation ();
				if (event.ctrlKey && IsSet (userButton.onCtrlClick)) {
					userButton.onCtrlClick (userImage, userButton.userData);
				} else if (IsSet (userButton.onClick)) {
					userButton.onClick (userImage, userButton.userData);
				}
			});
		}
	};

	ImporterMenuItem.prototype.SetOpen = function (isOpen)
	{
		this.isOpen = isOpen;
		if (this.isOpen) {
			if (IsSet (this.parameters.openCloseButton.onOpen)) {
				this.parameters.openCloseButton.onOpen (this.contentDiv, this.parameters.openCloseButton.userData);
			}
			this.contentDiv.show ();
			this.openCloseImage.attr ('src', 'images/opened.png');
		} else {
			if (IsSet (this.parameters.openCloseButton.onClose)) {
				this.parameters.openCloseButton.onClose (this.contentDiv, this.parameters.openCloseButton.userData);
			}
			this.contentDiv.hide ();
			this.openCloseImage.attr ('src', 'images/closed.png');
		}
	};

	ImporterMenuItem.prototype.Highlight = function (highlight)
	{
		if (highlight) {
			this.menuItemDiv.addClass ('highlighted');
		} else {
			this.menuItemDiv.removeClass ('highlighted');
		}
	};

	ImporterMenuItem.prototype.IsHighlighted = function ()
	{
		return this.menuItemDiv.hasClass ('highlighted');
	};

	var ImporterMenu = function (parentDiv)
	{
		this.parentDiv = parentDiv;
		this.parentDiv.empty ();
	};

	ImporterMenu.prototype.AddGroup = function (name, parameters)
	{
		return new ImporterMenuItem (this.parentDiv, name, parameters);
	};


	return ImporterMenu;
});
