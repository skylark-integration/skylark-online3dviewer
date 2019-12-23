/**
 * skylark-online3dviewer - A version of online3dviewer that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-online3dviewer/
 * @license MIT
 */
define(["skylark-jquery"],function(t){var o=function(o){this.table=t("<table>").addClass("infotable").appendTo(o)};return o.prototype.AddRow=function(o,e){var n=t("<tr>").appendTo(this.table);t("<td>").html(o).appendTo(n),t("<td>").html(e).appendTo(n)},o.prototype.AddColorRow=function(o,e){var n=t("<tr>").appendTo(this.table);t("<td>").html(o).appendTo(n);var a=document.createElement("td"),d=(a=t("<td>").appendTo(n),t("<div>").addClass("colorbutton").appendTo(a));d.attr("title","("+e[0]+", "+e[1]+", "+e[2]+")");for(var p=JSM.RGBComponentsToHexColor(255*e[0],255*e[1],255*e[2]).toString(16);p.length<6;)p="0"+p;d.css("background","#"+p)},o});
//# sourceMappingURL=sourcemaps/InfoTable.js.map
