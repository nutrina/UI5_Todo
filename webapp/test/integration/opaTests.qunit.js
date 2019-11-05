/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"quickstart/Todo/Todo/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});