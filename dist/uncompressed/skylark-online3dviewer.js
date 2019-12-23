/**
 * skylark-online3dviewer - A version of online3dviewer that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-online3dviewer/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-online3dviewer/InfoTable',[
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
define('skylark-online3dviewer/FloatingControl',[
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
define('skylark-online3dviewer/FloatingDialog',[
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
define('skylark-online3dviewer/ExtensionInterface',[],function(){
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
define('skylark-online3dviewer/ExtensionButtons',[
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
define('skylark-online3dviewer/ImporterProgressBar',[
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
define('skylark-online3dviewer/ImporterButtons',[
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
define('skylark-online3dviewer/ImporterMenu',[
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

define('skylark-online3dviewer/ImporterViewer',[
	"skylark-threejs",
	"skylark-jsmodeler"
],function(THREE,JSM){
	JSM.THREE = THREE;
	
	var ImporterViewer = function ()
	{
		this.viewer = null;
		this.jsonData = null;
	};

	ImporterViewer.prototype.Init = function (canvasName)
	{
		var viewerSettings = {
			cameraEyePosition : [8.0, -6.0, 4.0],
			cameraCenterPosition : [0.0, 0.0, 0.0],
			cameraUpVector : [0, 0, 1]
		};

		this.viewer = new JSM.ThreeViewer ();
		var canvas = document.getElementById (canvasName);
		if (!this.viewer.Start (canvas, viewerSettings)) {
			return false;
		}
		this.viewer.navigation.SetNearDistanceLimit (0.1);
		this.viewer.navigation.SetFarDistanceLimit (100000.0);
		this.viewer.SetClearColor (0xdddddd);
		this.viewer.Draw ();
		
		return true;
	};

	ImporterViewer.prototype.GetJsonData = function ()
	{
		return this.jsonData;
	};

	ImporterViewer.prototype.SetJsonData = function (jsonData)
	{
		this.jsonData = jsonData;
	};

	ImporterViewer.prototype.RemoveMeshes = function ()
	{
		this.viewer.RemoveMeshes ();
	};

	ImporterViewer.prototype.ShowAllMeshes = function (inEnvironment)
	{
		this.RemoveMeshes ();
		
		var myThis = this;
		var currentMeshIndex = 0;
		var environment = {
			onStart : function (taskCount/*, meshes*/) {
				inEnvironment.onStart (taskCount);
				myThis.viewer.EnableDraw (false);
			},
			onProgress : function (currentTask, meshes) {
				while (currentMeshIndex < meshes.length) {
					myThis.viewer.AddMesh (meshes[currentMeshIndex]);
					currentMeshIndex = currentMeshIndex + 1;
				}
				inEnvironment.onProgress (currentTask);
			},
			onFinish : function (meshes) {
				myThis.AdjustClippingPlanes (50.0);
				myThis.FitInWindow ();
				myThis.viewer.EnableDraw (true);
				myThis.viewer.Draw ();
				inEnvironment.onFinish (meshes);
			}
		};
		
		JSM.ConvertJSONDataToThreeMeshes (this.jsonData, this.Draw.bind (this), environment);
	};

	ImporterViewer.prototype.GetMeshesUnderPosition = function (x, y)
	{
		var objects = this.viewer.GetObjectsUnderPosition (x, y);
		var meshes = [];
		var i;
		for (i = 0; i < objects.length; i++) {
			if (objects[i].object instanceof THREE.Mesh) {
				meshes.push (objects[i].object);
			}
		}
		return meshes;
	};

	ImporterViewer.prototype.ShowMesh = function (index, show)
	{
		this.viewer.scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				if (current.originalJsonMeshIndex == index) {
					if (show) {
						current.visible = true;
					} else {
						current.visible = false;
					}
				}
			}
		});
	};

	ImporterViewer.prototype.GetMeshesByMaterial = function (materialIndex)
	{
		var meshIndices = [];
		this.viewer.scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				if (current.originalJsonMaterialIndex == materialIndex) {
					if (meshIndices.length === 0 || meshIndices[meshIndices.length - 1] != current.originalJsonMeshIndex) {
						meshIndices.push (current.originalJsonMeshIndex);
					}
				}
			}
		});
		return meshIndices;
	};

	ImporterViewer.prototype.HighlightMesh = function (index, highlight)
	{
		this.viewer.scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				if (current.originalJsonMeshIndex == index) {
					if (highlight) {
						current.material.emissive.setHex (0x555555);
					} else {
						current.material.emissive.setHex (0);
					}
				}
			}
		});
	};

	ImporterViewer.prototype.FitInWindow = function ()
	{
		this.viewer.FitInWindow ();
	};

	ImporterViewer.prototype.FitMeshInWindow = function (index)
	{
		var meshes = [];
		this.viewer.scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				if (current.originalJsonMeshIndex == index) {
					meshes.push (current);
				}
			}
		});
		this.viewer.FitMeshesInWindow (meshes);
	};

	ImporterViewer.prototype.FitMeshesInWindow = function (meshIndices)
	{
		var meshes = [];
		this.viewer.scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				if (meshIndices.indexOf (current.originalJsonMeshIndex) != -1) {
					meshes.push (current);
				}
			}
		});
		this.viewer.FitMeshesInWindow (meshes);
	};

	ImporterViewer.prototype.AdjustClippingPlanes = function ()
	{
		if (this.viewer.MeshCount () > 0) {
			this.viewer.AdjustClippingPlanes (50.0);
		}
	};

	ImporterViewer.prototype.SetFixUp = function ()
	{
		this.viewer.navigation.EnableFixUp (!this.viewer.navigation.cameraFixUp);
	};

	ImporterViewer.prototype.SetNamedView = function (viewName)
	{
		var eye, center, up;
		if (viewName == 'z') {
			eye = new JSM.Coord (1.0, 0.0, 0.0);
			center = new JSM.Coord (0.0, 0.0, 0.0);
			up = new JSM.Coord (0.0, 0.0, 1.0);
		} else if (viewName == '-z') {
			eye = new JSM.Coord (-1.0, 0.0, 0.0);
			center = new JSM.Coord (0.0, 0.0, 0.0);
			up = new JSM.Coord (0.0, 0.0, -1.0);
		} else if (viewName == 'y') {
			eye = new JSM.Coord (1.0, 0.0, 0.0);
			center = new JSM.Coord (0.0, 0.0, 0.0);
			up = new JSM.Coord (0.0, 1.0, 0.0);
		} else if (viewName == '-y') {
			eye = new JSM.Coord (-1.0, 0.0, 0.0);
			center = new JSM.Coord (0.0, 0.0, 0.0);
			up = new JSM.Coord (0.0, -1.0, 0.0);
		} else if (viewName == 'x') {
			eye = new JSM.Coord (0.0, 1.0, 0.0);
			center = new JSM.Coord (0.0, 0.0, 0.0);
			up = new JSM.Coord (1.0, 0.0, 0.0);
		} else if (viewName == '-x') {
			eye = new JSM.Coord (0.0, -1.0, 0.0);
			center = new JSM.Coord (0.0, 0.0, 0.0);
			up = new JSM.Coord (-1.0, 0.0, 0.0);
		} else {
			return;
		}

		this.viewer.cameraMove.Set (eye, center, up);
		this.viewer.FitInWindow ();
	};

	ImporterViewer.prototype.Draw = function ()
	{
		this.viewer.Draw ();
	};

	return ImporterViewer;
});

define('skylark-online3dviewer/ImporterApp',[
	"skylark-jquery",
	"skylark-jsmodeler",
	"./InfoTable",
	"./FloatingControl",
	"./FloatingDialog",
	"./ExtensionInterface",
	"./ExtensionButtons",
	"./ImporterProgressBar",
	"./ImporterButtons",
	"./ImporterMenu",
	"./ImporterViewer"
],function($,JSM,InfoTable,FloatingControl,FloatingDialog,ExtensionInterface,ExtensionButtons, ImporterProgressBar,ImporterButtons, ImporterMenu,ImporterViewer){
	var ImporterApp = function ()
	{
		this.canvas = null;
		this.viewer = null;
		this.fileNames = null;
		this.inGenerate = false;
		this.meshesGroup = null;
		this.materialMenuItems = null;
		this.meshMenuItems = null;
		this.extensions = [];
		this.importerButtons = null;
		this.extensionButtons = null;
		this.introControl = null;
		this.floatingDialog = null;
		this.isMobile = null;
		this.readyForTest = null;
	};

	ImporterApp.prototype.Init = function ()
	{
		if (!JSM.IsWebGLEnabled () || !JSM.IsFileApiEnabled ()) {
			while (document.body.lastChild) {
				document.body.removeChild (document.body.lastChild);
			}

			var div = $('<div>').addClass ('nosupport').appendTo ($('body'));
			div.html ([
				'<div id="nosupport">',
				this.GetWelcomeText (),
				'<div class="nosupporterror">You need a browser which supports the following technologies: WebGL, WebGLRenderingContext, File, FileReader, FileList, Blob, URL.</div>',
				'</div>'
			].join (''));
			return;
		}
		
		var myThis = this;
		var top = $('#top');
		this.importerButtons = new ImporterButtons (top);
		this.importerButtons.AddLogo ('Online 3D Viewer <span class="version">v 0.6.6</span>');
		this.importerButtons.AddButton ('images/openfile.png', 'Open File', function () { myThis.OpenFile (); });
		this.importerButtons.AddButton ('images/fitinwindow.png', 'Fit In Window', function () { myThis.FitInWindow (); });
		this.importerButtons.AddToggleButton ('images/fixup.png', 'images/fixupgray.png', 'Enable/Disable Fixed Up Vector', function () { myThis.SetFixUp (); });
		this.importerButtons.AddButton ('images/top.png', 'Set Up Vector (Z)', function () { myThis.SetNamedView ('z'); });
		this.importerButtons.AddButton ('images/bottom.png', 'Set Up Vector (-Z)', function () { myThis.SetNamedView ('-z'); });
		this.importerButtons.AddButton ('images/front.png', 'Set Up Vector (Y)', function () { myThis.SetNamedView ('y'); });
		this.importerButtons.AddButton ('images/back.png', 'Set Up Vector (-Y)', function () { myThis.SetNamedView ('-y'); });
		this.importerButtons.AddButton ('images/left.png', 'Set Up Vector (X)', function () { myThis.SetNamedView ('x'); });
		this.importerButtons.AddButton ('images/right.png', 'Set Up Vector (-X)', function () { myThis.SetNamedView ('-x'); });
		
		this.extensionButtons = new ExtensionButtons (top);
		this.introControl = new FloatingControl ();
		this.floatingDialog = new FloatingDialog ();
		
		var match = window.matchMedia ('(max-device-width : 600px)');
		this.isMobile = match.matches;

		window.addEventListener ('resize', this.Resize.bind (this), false);
		this.Resize ();

		var canvasName = 'modelcanvas';
		this.canvas = $('#' + canvasName);
		this.RegisterCanvasClick ();
		this.viewer = new ImporterViewer ();
		this.viewer.Init (canvasName);

		window.addEventListener ('dragover', this.DragOver.bind (this), false);
		window.addEventListener ('drop', this.Drop.bind (this), false);
		
		var fileInput = document.getElementById ('file');
		fileInput.addEventListener ('change', this.FileSelected.bind (this), false);
		
		window.onhashchange = this.LoadFilesFromHash.bind (this);
		var hasHashModel = this.LoadFilesFromHash ();
		if (!hasHashModel && !this.isMobile) {
			this.ShowIntroControl ();
		}
	};

	ImporterApp.prototype.ClearReadyForTest = function ()
	{
		if (this.readyForTest !== null) {
			this.readyForTest.remove ();
			this.readyForTest = null;
		}
	};

	ImporterApp.prototype.SetReadyForTest = function ()
	{
		this.readyForTest = $('<div>').attr ('id', 'readyfortest').hide ().appendTo ($('body'));
	};

	ImporterApp.prototype.AddExtension = function (extension)
	{
		if (!extension.IsEnabled ()) {
			return;
		}
		
		var extInterface = new ExtensionInterface (this);
		extension.Init (extInterface);
	};

	ImporterApp.prototype.ShowIntroControl = function ()
	{
		var dialogText = [
			'<div class="importerdialog">',
			this.GetWelcomeText (),
			'</div>',
		].join ('');
		this.introControl.Open ({
			parent : this.canvas,
			text : dialogText
		});
		this.Resize ();
	};

	ImporterApp.prototype.HideIntroControl = function ()
	{
		this.introControl.Close ();
		this.Resize ();
	};

	ImporterApp.prototype.GetWelcomeText = function ()
	{
		var welcomeText = [
			'<div class="welcometitle">Welcome to Online 3D Viewer!</div>',
			'<div class="welcometext">Here you can view your local 3D models online. You have three ways to open a file. Use the open button above to select files, simply drag and drop files to this browser window, or define the url of the files as location hash.</div>',
			'<div class="welcometextformats">Supported formats: 3ds, obj, stl, off.</div>',
			'<div class="welcometext">Powered by <a target="_blank" href="https://github.com/mrdoob/three.js/">Three.js</a> and <a target="_blank" href="https://github.com/kovacsv/JSModeler">JSModeler</a>.</div>',
			'<div class="welcometext"><a target="_blank" href="https://github.com/kovacsv/Online3DViewer"><img src="images/githublogo.png"/></a></div>',
		].join ('');
		return welcomeText;
	};

	ImporterApp.prototype.Resize = function ()
	{
		function SetWidth (elem, value)
		{
			elem.width = value;
			elem.style.width = value + 'px';
		}

		function SetHeight (elem, value)
		{
			elem.height = value;
			elem.style.height = value + 'px';
		}

		var top = document.getElementById ('top');
		var left = document.getElementById ('left');
		var canvas = document.getElementById ('modelcanvas');
		var height = document.body.clientHeight - top.offsetHeight;

		SetHeight (left, height);
		SetHeight (canvas, height);
		SetWidth (canvas, document.body.clientWidth - left.offsetWidth);
		
		this.introControl.Resize ();
		this.floatingDialog.Resize ();
	};

	ImporterApp.prototype.JsonLoaded = function (progressBar)
	{
		this.Generate (progressBar);
	};

	ImporterApp.prototype.GenerateMenu = function ()
	{
		function AddDefaultGroup (menu, name, id)
		{
			var group = menu.AddGroup (name, {
				id : id,
				openCloseButton : {
					title : 'Show/Hide ' + name
				}
			});
			return group;
		}

		function AddInformation (infoGroup, jsonData)
		{
			var infoTable = new InfoTable (infoGroup.GetContentDiv ());

			var materialCount = jsonData.materials.length;
			var vertexCount = 0;
			var triangleCount = 0;
			
			var i, j, mesh, triangles;
			for (i = 0; i < jsonData.meshes.length; i++) {
				mesh = jsonData.meshes[i];
				vertexCount += mesh.vertices.length / 3;
				for (j = 0; j < mesh.triangles.length; j++) {
					triangles = mesh.triangles[j];
					triangleCount += triangles.parameters.length / 9;
				}
			}
		
			infoTable.AddRow ('Material count', materialCount);	
			infoTable.AddRow ('Vertex count', vertexCount);	
			infoTable.AddRow ('Triangle count', triangleCount);	
		}
		
		function AddMaterial (importerApp, importerMenu, materialsGroup, materialIndex, material)
		{
			var materialMenuItem = materialsGroup.AddSubItem (material.name, {
				openCloseButton : {
					title : 'Show/Hide Information',
					onOpen : function (contentDiv, material) {
						contentDiv.empty ();
						var materialButtons = $('<div>').addClass ('submenubuttons').appendTo (contentDiv);
						var highlightButton = $('<img>').addClass ('submenubutton').attr ('src', 'images/highlightmesh.png').attr ('title', 'Highlight Meshes By Material').appendTo (materialButtons);
						highlightButton.click (function () {
							importerApp.HighlightMeshesByMaterial (materialIndex);
						});
						var fitInWindowButton = $('<img>').addClass ('submenubutton').attr ('src', 'images/fitinwindowsmall.png').attr ('title', 'Fit Meshes In Window By Material').appendTo (materialButtons);
						fitInWindowButton.click (function () {
							importerApp.FitMeshesByMaterialInWindow (materialIndex);
						});
						var table = new InfoTable (contentDiv);
						table.AddColorRow ('Ambient', material.ambient);
						table.AddColorRow ('Diffuse', material.diffuse);
						table.AddColorRow ('Specular', material.specular);
						table.AddRow ('Shininess', material.shininess.toFixed (2));
						table.AddRow ('Opacity', material.opacity.toFixed (2));
					},
					userData : material
				}
			});
			return materialMenuItem;
		}

		function AddMesh (importerApp, importerMenu, meshesGroup, mesh, meshIndex)
		{
			function AddMeshButtons (importerApp, contentDiv, meshName, meshIndex)
			{
				function CopyToClipboard (text) {
					var input = document.createElement ('input');
					input.style.position = 'absolute';
					input.style.left = '0';
					input.style.top = '0';
					input.setAttribute ('value', text);
					document.body.appendChild (input);
					input.select ();
					document.execCommand ('copy');
					document.body.removeChild(input);
				}
				
				var meshButtons = $('<div>').addClass ('submenubuttons').appendTo (contentDiv);
				var fitInWindowButton = $('<img>').addClass ('submenubutton').attr ('src', 'images/fitinwindowsmall.png').attr ('title', 'Fit Mesh In Window').appendTo (meshButtons);
				fitInWindowButton.click (function () {
					importerApp.FitMeshInWindow (meshIndex);
				});
				var highlightButton = $('<img>').addClass ('submenubutton').attr ('src', 'images/highlightmesh.png').attr ('title', 'Highlight Mesh').appendTo (meshButtons);
				highlightButton.click (function () {
					importerApp.HighlightMesh (meshIndex);
				});
				var copyNameToClipboardButton = $('<img>').addClass ('submenubutton').attr ('src', 'images/copytoclipboard.png').attr ('title', 'Copy Mesh Name To Clipboard').appendTo (meshButtons);
				copyNameToClipboardButton.click (function () {
					CopyToClipboard (meshName);
				});
			}
			
			var visibleImage = null;
			var meshMenuItem = meshesGroup.AddSubItem (mesh.name, {
				id : 'meshmenuitem-' + meshIndex.toString (),
				openCloseButton : {
					title : 'Show/Hide Details',
					onOpen : function (contentDiv, mesh) {
						contentDiv.empty ();

						AddMeshButtons (importerApp, contentDiv, mesh.name, meshIndex);
						var table = new InfoTable (contentDiv);
						
						var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
						var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);
						var i, vertex;
						for (i = 0; i < mesh.vertices.length; i =  i + 3) {
							vertex = new JSM.Coord (mesh.vertices[i], mesh.vertices[i + 1], mesh.vertices[i + 2]);
							min.x = JSM.Minimum (min.x, vertex.x);
							min.y = JSM.Minimum (min.y, vertex.y);
							min.z = JSM.Minimum (min.z, vertex.z);
							max.x = JSM.Maximum (max.x, vertex.x);
							max.y = JSM.Maximum (max.y, vertex.y);
							max.z = JSM.Maximum (max.z, vertex.z);
						}
						table.AddRow ('X Size', (max.x - min.x).toFixed (2));
						table.AddRow ('Y Size', (max.y - min.y).toFixed (2));
						table.AddRow ('Z Size', (max.z - min.z).toFixed (2));
						
						var triangleCount = 0;
						var triangles;
						for (i = 0; i < mesh.triangles.length; i++) {
							triangles = mesh.triangles[i];
							triangleCount += triangles.parameters.length / 9;
						}
					
						table.AddRow ('Vertex count', mesh.vertices.length / 3);
						table.AddRow ('Triangle count', triangleCount);
					},
					userData : mesh
				},
				userButtons : [
					{
						id : 'showhidemesh-' + meshIndex,
						title : 'Show/Hide Mesh',
						onCreate : function (image) {
							image.attr ('src', 'images/visible.png');
							visibleImage = image;
						},
						onClick : function (image, meshIndex) {
							importerApp.ShowHideMesh (meshIndex);
						},
						onCtrlClick : function (image, meshIndex) {
							importerApp.IsolateMesh (meshIndex);
						},
						userData : meshIndex
					}
				]
			});
			
			meshMenuItem.isVisible = true;
			meshMenuItem.visibleImage = visibleImage;
			return meshMenuItem;
		}		
		
		var jsonData = this.viewer.GetJsonData ();
		var menu = $('#menu');
		var importerMenu = new ImporterMenu (menu);

		var filesGroup = AddDefaultGroup (importerMenu, 'Files', 'filesmenuitem');
		filesGroup.AddSubItem (this.fileNames.main);
		var i;
		for (i = 0; i < this.fileNames.requested.length; i++) {
			filesGroup.AddSubItem (this.fileNames.requested[i]);
		}
		
		if (this.fileNames.missing.length > 0) {
			var missingFilesGroup = AddDefaultGroup (importerMenu, 'Missing Files', 'missingfilesmenuitem');
			for (i = 0; i < this.fileNames.missing.length; i++) {
				missingFilesGroup.AddSubItem (this.fileNames.missing[i]);
			}
		}
		
		var infoGroup = AddDefaultGroup (importerMenu, 'Information', 'informationmenuitem');
		AddInformation (infoGroup, jsonData);
		
		this.materialMenuItems = [];
		var materialsGroup = AddDefaultGroup (importerMenu, 'Materials', 'materialsmenuitem');
		var material, materialMenuItem;
		for (i = 0; i < jsonData.materials.length; i++) {
			material = jsonData.materials[i];
			materialMenuItem = AddMaterial (this, importerMenu, materialsGroup, i, material);
			this.materialMenuItems.push (materialMenuItem);
		}
		
		this.meshesGroup = AddDefaultGroup (importerMenu, 'Meshes', 'meshesmenuitem');
		this.meshMenuItems = [];
		var mesh, meshMenuItem;
		for (i = 0; i < jsonData.meshes.length; i++) {
			mesh = jsonData.meshes[i];
			meshMenuItem = AddMesh (this, importerMenu, this.meshesGroup, mesh, i);
			this.meshMenuItems.push (meshMenuItem);
		}
		
		this.Resize ();
	};

	ImporterApp.prototype.GenerateError = function (errorMessage)
	{
		this.viewer.RemoveMeshes ();
		var menu = $('#menu');
		menu.empty ();
		
		this.floatingDialog.Open ({
			title : 'Error',
			text : '<div class="importerdialog">' + errorMessage + '</div>',
			buttons : [
				{
					text : 'ok',
					callback : function (dialog) {
						dialog.Close ();
					}
				}
			]
		});	
	};

	ImporterApp.prototype.Generate = function (progressBar)
	{
		function ShowMeshes (importerApp, progressBar, merge)
		{
			importerApp.inGenerate = true;
			var environment = {
				onStart : function (taskCount) {
					progressBar.Init (taskCount);
				},
				onProgress : function (currentTask) {
					progressBar.Step (currentTask + 1);
				},
				onFinish : function () {
					importerApp.GenerateMenu ();
					importerApp.inGenerate = false;
					importerApp.SetReadyForTest ();
				}
			};
			
			if (merge) {
				var jsonData = importerApp.viewer.GetJsonData ();
				importerApp.viewer.SetJsonData (JSM.MergeJsonDataMeshes (jsonData));
			}
			importerApp.viewer.ShowAllMeshes (environment);
		}

		var jsonData = this.viewer.GetJsonData ();
		if (jsonData.materials.length === 0 || jsonData.meshes.length === 0) {
			this.GenerateError ('Failed to open file. Maybe something is wrong with your file.');
			this.SetReadyForTest ();
			return;
		}
		
		var myThis = this;
		if (jsonData.meshes.length > 250) {
			this.floatingDialog.Open ({
				title : 'Information',
				text : '<div class="importerdialog">The model contains a large number of meshes. It can cause performance problems. Would you like to merge meshes?</div>',
				buttons : [
					{
						text : 'yes',
						callback : function (dialog) {
							ShowMeshes (myThis, progressBar, true);
							dialog.Close ();
						}
					},
					{
						text : 'no',
						callback : function (dialog) {
							ShowMeshes (myThis, progressBar, false);
							dialog.Close ();
						}
					}				
				]
			});
		} else {
			ShowMeshes (myThis, progressBar, false);
		}
	};

	ImporterApp.prototype.FitInWindow = function ()
	{
		this.viewer.FitInWindow ();
	};

	ImporterApp.prototype.FitMeshInWindow = function (meshIndex)
	{
		this.viewer.FitMeshInWindow (meshIndex);
	};

	ImporterApp.prototype.FitMeshesByMaterialInWindow = function (materialIndex)
	{
		var meshIndices = this.viewer.GetMeshesByMaterial (materialIndex);
		if (meshIndices.length === 0) {
			return;
		}
		this.viewer.FitMeshesInWindow (meshIndices);
	};

	ImporterApp.prototype.SetFixUp = function ()
	{
		this.viewer.SetFixUp ();
	};

	ImporterApp.prototype.SetNamedView = function (viewName)
	{
		this.viewer.SetNamedView (viewName);
	};

	ImporterApp.prototype.SetView = function (viewType)
	{
		this.viewer.SetView (viewType);
	};

	ImporterApp.prototype.ShowHideMesh = function (meshIndex)
	{
		var meshMenuItem = this.meshMenuItems[meshIndex];
		this.ShowHideMeshInternal (meshIndex, !meshMenuItem.isVisible);
		this.viewer.Draw ();
	};

	ImporterApp.prototype.IsolateMesh = function (meshIndex)
	{
		var i, meshMenuItem;
		
		var onlyThisVisible = true;
		if (!this.meshMenuItems[meshIndex].isVisible) {
			onlyThisVisible = false;
		} else {
			for (i = 0; i < this.meshMenuItems.length; i++) {
				meshMenuItem = this.meshMenuItems[i];
				if (meshMenuItem.isVisible && i !== meshIndex) {
					onlyThisVisible = false;
					break;
				}
			}
		}
		
		var i;
		for (i = 0; i < this.meshMenuItems.length; i++) {
			if (onlyThisVisible) {
				this.ShowHideMeshInternal (i, true);
			} else {
				if (i == meshIndex) {
					this.ShowHideMeshInternal (i, true);
				} else {
					this.ShowHideMeshInternal (i, false);
				}
			}
		}
		
		this.viewer.Draw ();
	};

	ImporterApp.prototype.ShowHideMeshInternal = function (meshIndex, isVisible)
	{
		var meshMenuItem = this.meshMenuItems[meshIndex];
		meshMenuItem.isVisible = isVisible;
		meshMenuItem.visibleImage.attr ('src', meshMenuItem.isVisible ? 'images/visible.png' : 'images/hidden.png');
		this.viewer.ShowMesh (meshIndex, meshMenuItem.isVisible);
	};

	ImporterApp.prototype.HighlightMeshInternal = function (meshIndex, highlight)
	{
		var meshMenuItem = this.meshMenuItems[meshIndex];
		meshMenuItem.Highlight (highlight);
		this.viewer.HighlightMesh (meshIndex, highlight);
	};

	ImporterApp.prototype.ProcessFiles = function (fileList, isUrl)
	{
		this.ClearReadyForTest ();
		this.HideIntroControl ();
		this.floatingDialog.Close ();
		if (this.inGenerate) {
			return;
		}

		var userFiles = fileList;
		if (userFiles.length === 0) {
			return;
		}
		
		this.fileNames = null;
		
		var myThis = this;
		var processorFunc = JSM.ConvertFileListToJsonData;
		if (isUrl) {
			processorFunc = JSM.ConvertURLListToJsonData;
		}

		var menu = $('#menu');
		menu.empty ();
		if (isUrl) {
			menu.html ('Downloading files...');
		} else {
			menu.html ('Loading files...');
		}
		
		processorFunc (userFiles, {
			onError : function () {
				myThis.GenerateError ('No readable file found. You can open 3ds, obj, stl, and off files.');
				myThis.SetReadyForTest ();
				return;
			},
			onReady : function (fileNames, jsonData) {
				myThis.fileNames = fileNames;
				myThis.viewer.SetJsonData (jsonData);
				menu.empty ();
				var progressBar = new ImporterProgressBar (menu);
				myThis.JsonLoaded (progressBar);
			}
		});
	};

	ImporterApp.prototype.RegisterCanvasClick = function ()
	{
		var myThis = this;
		var mousePosition = null;
		this.canvas.mousedown (function () {
			mousePosition = [event.pageX, event.pageY];
		});
		this.canvas.mouseup (function (event) {
			var mouseMoved = (mousePosition == null || event.pageX != mousePosition[0] || event.pageY != mousePosition[1]);
			if (!mouseMoved) {
				var x = event.pageX - $(this).offset ().left;
				var y = event.pageY - $(this).offset ().top;
				myThis.OnCanvasClick (x, y);
			}
			mousePosition = null;
		});
	};

	ImporterApp.prototype.ScrollMeshIntoView = function (meshIndex)
	{
		if (meshIndex == -1) {
			return;
		}
		var menuItem = this.meshMenuItems[meshIndex];
		menuItem.menuItemDiv.get (0).scrollIntoView ();
	};

	ImporterApp.prototype.HighlightMesh = function (meshIndex)
	{
		var i, menuItem, highlight;
		if (meshIndex != -1) {
			for (i = 0; i < this.meshMenuItems.length; i++) {
				menuItem = this.meshMenuItems[i];
				highlight = false;
				if (i == meshIndex) {
					if (!menuItem.IsHighlighted ()) {
						this.HighlightMeshInternal (i, true);
					} else {
						this.HighlightMeshInternal (i, false);
					}
				}
			}
		} else {
			for (i = 0; i < this.meshMenuItems.length; i++) {
				menuItem = this.meshMenuItems[i];
				if (menuItem.IsHighlighted ()) {
					this.HighlightMeshInternal (i, false);
				}
			}
		}
		
		this.viewer.Draw ();
	};

	ImporterApp.prototype.HighlightMeshesByMaterial = function (materialIndex)
	{
		var meshIndices = this.viewer.GetMeshesByMaterial (materialIndex);
		if (meshIndices.length === 0) {
			return;
		}
		
		var i, meshIndex, meshMenuItem;
		this.HighlightMesh (-1);
		for (i = 0; i < meshIndices.length; i++) {
			meshIndex = meshIndices[i];
			meshMenuItem = this.meshMenuItems[meshIndex];
			this.HighlightMeshInternal (meshIndex, true);
		}

		this.meshesGroup.SetOpen (true);
		this.ScrollMeshIntoView (meshIndices[0]);
		this.viewer.Draw ();
	};

	ImporterApp.prototype.OnCanvasClick = function (x, y)
	{
		if (this.meshMenuItems == null) {
			return;
		}
		var objects = this.viewer.GetMeshesUnderPosition (x, y);
		var meshIndex = -1;
		if (objects.length > 0) {
			meshIndex = objects[0].originalJsonMeshIndex;
			this.meshesGroup.SetOpen (true);
		}
		
		this.HighlightMesh (meshIndex);
		this.ScrollMeshIntoView (meshIndex);
	};

	ImporterApp.prototype.DragOver = function (event)
	{
		event.stopPropagation ();
		event.preventDefault ();
		event.dataTransfer.dropEffect = 'copy';
	};

	ImporterApp.prototype.Drop = function (event)
	{
		event.stopPropagation ();
		event.preventDefault ();
		this.ResetHash ();
		this.ProcessFiles (event.dataTransfer.files, false);
	};

	ImporterApp.prototype.FileSelected = function (event)
	{
		event.stopPropagation ();
		event.preventDefault ();
		this.ResetHash ();
		this.ProcessFiles (event.target.files, false);
	};

	ImporterApp.prototype.OpenFile = function ()
	{
		var fileInput = document.getElementById ('file');
		fileInput.click ();
	};

	ImporterApp.prototype.ResetHash = function ()
	{
		if (window.location.hash.length > 1) {
			window.location.hash = '';
		}
	};

	ImporterApp.prototype.LoadFilesFromHash = function ()
	{
		if (window.location.hash.length < 2) {
			return false;
		}
		
		var fileInput = $('#file');
		var hash = window.location.hash;
		if (hash == '#testmode') {
			fileInput.css ('display', '');
			fileInput.css ('position', 'absolute');
			fileInput.css ('right', '10px');
			fileInput.css ('bottom', '10px');
			return false;	
		}
		
		fileInput.css ('display', 'none');
		var hash = hash.substr (1, hash.length - 1);
		var fileList = hash.split (',');
		this.ProcessFiles (fileList, true);
		return true;
	};

	return ImporterApp;
});
define('skylark-online3dviewer/main',[
	"skylark-langx/skylark",
	"./ImporterApp"
],function(skylark,ImporterApp) {
	return skylark.attach("intg.jsmodeler.Online3dViewer",ImporterApp);
});
define('skylark-online3dviewer', ['skylark-online3dviewer/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-online3dviewer.js.map
