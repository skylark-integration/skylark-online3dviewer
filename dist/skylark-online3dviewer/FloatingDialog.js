/**
 * skylark-online3dviewer - A version of online3dviewer that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-online3dviewer/
 * @license MIT
 */
define(["skylark-jquery"],function(i){var t=function(){this.dialogDiv=null,this.contentDiv=null};return t.prototype.Open=function(t){function o(t,o,l){i("<div>").addClass("dialogbutton").html(l.text).appendTo(o).click(function(){l.callback(t)})}null!==this.dialogDiv&&this.Close(),this.dialogDiv=i("<div>").addClass("dialog").appendTo(i("body")),i("<div>").addClass("dialogtitle").html(t.title).appendTo(this.dialogDiv),this.contentDiv=i("<div>").addClass("dialogcontent").appendTo(this.dialogDiv),null!==t.text&&void 0!==t.text&&this.contentDiv.html(t.text);var l,n=i("<div>").addClass("dialogbuttons").appendTo(this.dialogDiv);for(l=0;l<t.buttons.length;l++)o(this,n,t.buttons[l]);document.addEventListener("click",this.MouseClick.bind(this),!0),this.Resize()},t.prototype.Close=function(){null!==this.dialogDiv&&(this.dialogDiv.remove(),this.dialogDiv=null,i("body").unbind("click"))},t.prototype.GetContentDiv=function(){return this.contentDiv},t.prototype.Resize=function(){null!==this.dialogDiv&&(this.dialogDiv.css("left",(document.body.clientWidth-this.dialogDiv.width())/2+"px"),this.dialogDiv.css("top",(document.body.clientHeight-this.dialogDiv.height())/3+"px"))},t.prototype.MouseClick=function(i){if(null!==this.dialogDiv){for(var t=!1,o=i.target;null!==o;)o===this.dialogDiv.get()[0]&&(t=!0),o=o.parentElement;t||this.Close()}},t});
//# sourceMappingURL=sourcemaps/FloatingDialog.js.map
