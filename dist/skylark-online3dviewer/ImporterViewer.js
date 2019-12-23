/**
 * skylark-online3dviewer - A version of online3dviewer that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-online3dviewer/
 * @license MIT
 */
define(["skylark-threejs","skylark-jsmodeler"],function(e,n){n.THREE=e;var i=function(){this.viewer=null,this.jsonData=null};return i.prototype.Init=function(e){this.viewer=new n.ThreeViewer;var i=document.getElementById(e);return!!this.viewer.Start(i,{cameraEyePosition:[8,-6,4],cameraCenterPosition:[0,0,0],cameraUpVector:[0,0,1]})&&(this.viewer.navigation.SetNearDistanceLimit(.1),this.viewer.navigation.SetFarDistanceLimit(1e5),this.viewer.SetClearColor(14540253),this.viewer.Draw(),!0)},i.prototype.GetJsonData=function(){return this.jsonData},i.prototype.SetJsonData=function(e){this.jsonData=e},i.prototype.RemoveMeshes=function(){this.viewer.RemoveMeshes()},i.prototype.ShowAllMeshes=function(e){this.RemoveMeshes();var i=this,t=0,o={onStart:function(n){e.onStart(n),i.viewer.EnableDraw(!1)},onProgress:function(n,o){for(;t<o.length;)i.viewer.AddMesh(o[t]),t+=1;e.onProgress(n)},onFinish:function(n){i.AdjustClippingPlanes(50),i.FitInWindow(),i.viewer.EnableDraw(!0),i.viewer.Draw(),e.onFinish(n)}};n.ConvertJSONDataToThreeMeshes(this.jsonData,this.Draw.bind(this),o)},i.prototype.GetMeshesUnderPosition=function(n,i){var t,o=this.viewer.GetObjectsUnderPosition(n,i),r=[];for(t=0;t<o.length;t++)o[t].object instanceof e.Mesh&&r.push(o[t].object);return r},i.prototype.ShowMesh=function(n,i){this.viewer.scene.traverse(function(t){t instanceof e.Mesh&&t.originalJsonMeshIndex==n&&(t.visible=!!i)})},i.prototype.GetMeshesByMaterial=function(n){var i=[];return this.viewer.scene.traverse(function(t){t instanceof e.Mesh&&t.originalJsonMaterialIndex==n&&(0!==i.length&&i[i.length-1]==t.originalJsonMeshIndex||i.push(t.originalJsonMeshIndex))}),i},i.prototype.HighlightMesh=function(n,i){this.viewer.scene.traverse(function(t){t instanceof e.Mesh&&t.originalJsonMeshIndex==n&&(i?t.material.emissive.setHex(5592405):t.material.emissive.setHex(0))})},i.prototype.FitInWindow=function(){this.viewer.FitInWindow()},i.prototype.FitMeshInWindow=function(n){var i=[];this.viewer.scene.traverse(function(t){t instanceof e.Mesh&&t.originalJsonMeshIndex==n&&i.push(t)}),this.viewer.FitMeshesInWindow(i)},i.prototype.FitMeshesInWindow=function(n){var i=[];this.viewer.scene.traverse(function(t){t instanceof e.Mesh&&-1!=n.indexOf(t.originalJsonMeshIndex)&&i.push(t)}),this.viewer.FitMeshesInWindow(i)},i.prototype.AdjustClippingPlanes=function(){this.viewer.MeshCount()>0&&this.viewer.AdjustClippingPlanes(50)},i.prototype.SetFixUp=function(){this.viewer.navigation.EnableFixUp(!this.viewer.navigation.cameraFixUp)},i.prototype.SetNamedView=function(e){var i,t,o;if("z"==e)i=new n.Coord(1,0,0),t=new n.Coord(0,0,0),o=new n.Coord(0,0,1);else if("-z"==e)i=new n.Coord(-1,0,0),t=new n.Coord(0,0,0),o=new n.Coord(0,0,-1);else if("y"==e)i=new n.Coord(1,0,0),t=new n.Coord(0,0,0),o=new n.Coord(0,1,0);else if("-y"==e)i=new n.Coord(-1,0,0),t=new n.Coord(0,0,0),o=new n.Coord(0,-1,0);else if("x"==e)i=new n.Coord(0,1,0),t=new n.Coord(0,0,0),o=new n.Coord(1,0,0);else{if("-x"!=e)return;i=new n.Coord(0,-1,0),t=new n.Coord(0,0,0),o=new n.Coord(-1,0,0)}this.viewer.cameraMove.Set(i,t,o),this.viewer.FitInWindow()},i.prototype.Draw=function(){this.viewer.Draw()},i});
//# sourceMappingURL=sourcemaps/ImporterViewer.js.map
