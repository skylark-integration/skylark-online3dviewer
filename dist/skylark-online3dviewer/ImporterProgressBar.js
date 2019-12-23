/**
 * skylark-online3dviewer - A version of online3dviewer that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-online3dviewer/
 * @license MIT
 */
define(["skylark-jquery"],function(t){var i=function(t){this.parent=t,this.borderDiv=null,this.contentDiv=null,this.maxCount=null,this.maxWidth=null};return i.prototype.Init=function(i){this.borderDiv=t("<div>").addClass("progressbarborder").appendTo(this.parent),this.contentDiv=t("<div>").addClass("progressbarcontent").appendTo(this.borderDiv),this.maxCount=i,this.maxWidth=this.borderDiv.width(),this.Step(0)},i.prototype.Step=function(t){var i=t*(this.maxWidth/this.maxCount);t==this.maxCount&&(i=this.maxWidth),this.contentDiv.width(i)},i});
//# sourceMappingURL=sourcemaps/ImporterProgressBar.js.map
