define([
	"skylark-langx/skylark",
	"./ImporterApp"
],function(skylark,ImporterApp) {
	return skylark.attach("intg.jsmodeler.Online3dViewer",ImporterApp);
});