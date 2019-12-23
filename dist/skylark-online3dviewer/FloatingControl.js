/**
 * skylark-online3dviewer - A version of online3dviewer that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-online3dviewer/
 * @license MIT
 */
define(["skylark-jquery"],function(t){var o=function(){this.parent=null,this.controlDiv=null,this.contentDiv=null};return o.prototype.Open=function(o){null!==this.controlDiv&&this.Close(),this.parent=o.parent,this.controlDiv=t("<div>").addClass("control").appendTo(t("body")),this.contentDiv=t("<div>").addClass("controlcontent").html(o.text).appendTo(this.controlDiv),this.Resize()},o.prototype.Close=function(){null!==this.controlDiv&&(this.controlDiv.remove(),this.controlDiv=null)},o.prototype.Resize=function(){null!==this.controlDiv&&(this.controlDiv.css("left",this.parent.offset().left+(this.parent.width()-this.controlDiv.width())/2+"px"),this.controlDiv.css("top",this.parent.offset().top+(this.parent.height()-this.controlDiv.height())/3+"px"))},o});
//# sourceMappingURL=sourcemaps/FloatingControl.js.map
