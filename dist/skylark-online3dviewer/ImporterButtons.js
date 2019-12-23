/**
 * skylark-online3dviewer - A version of online3dviewer that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-online3dviewer/
 * @license MIT
 */
define(["skylark-jquery"],function(t){var o=function(o){this.buttonsDiv=t("<div>").attr("id","buttons").appendTo(o)};return o.prototype.AddLogo=function(o){t("<div>").attr("id","logo").html(o).appendTo(this.buttonsDiv).click(function(){location.hash="",location.reload()})},o.prototype.AddButton=function(o,n,i){t("<img>").addClass("topbutton").attr("src",o).attr("title",n).appendTo(this.buttonsDiv).click(function(){i()})},o.prototype.AddToggleButton=function(o,n,i,a){var r=t("<img>").addClass("topbutton").attr("src",o).attr("title",i).appendTo(this.buttonsDiv),c=!0;r.click(function(){(c=!c)?r.attr("src",o):r.attr("src",n),a()})},o});
//# sourceMappingURL=sourcemaps/ImporterButtons.js.map
