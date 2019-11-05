sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/CustomListItem",
	"sap/m/HBox",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/FlexItemData",
	"sap/m/MessageToast"
], function (Controller, CustomListItem, HBox, Button, Text, FlexItemData, MessageToast) {
	"use strict";

	return Controller.extend("quickstart.Todo.Todo.controller.Main", {
		onInit: function () {
			this._updateModelForDisplay();
		},

		onSelectionChange: function (oEvent) {
			var listItems = oEvent.getParameter("listItems");
			var selected = oEvent.getParameter("selected");
			listItems.forEach(function (e) {
				if (selected) {
					e.addStyleClass("strikeThrough");
				} else {
					e.removeStyleClass("strikeThrough");
				}
			});
			this._updateModelForDisplay();
		},

		factoryStandardListItem: function (sId, oContext) {
			var todoText = new sap.m.Text({
				text: "{name}",
				layoutData: new FlexItemData({
					growFactor: 1
				})
			});

			var deleteIcon = new Button({
				icon: "sap-icon://delete",
				type: "Transparent",
				customData: [{
					key: "task",
					value: oContext.getObject()
				}],
				press: this.onDeleteTodo.bind(this)
			});

			var ret = new CustomListItem({
				content: new HBox({
					items: [
						todoText,
						deleteIcon
					]
				}),
				selected: "{done}"
			});

			todoText.addStyleClass("sapUiTinyMarginTopBottom");

			if (oContext.getProperty("done")) {
				ret.addStyleClass("strikeThrough");
			}
			return ret;
		},

		onCreateTodo: function (oEvent) {
			oEvent.getSource().setValue("");
			var sTodo = oEvent.getParameter("value");
			if (sTodo) {
				var oModel = this.getView().getModel();
				var aTodoItems = oModel.getProperty("/items");
				aTodoItems.push({
					name: sTodo,
					selected: false
				});

				this._updateModelForDisplay();
				oModel.setProperty("/items", aTodoItems);

				if (oModel.getProperty("/selectedTabKey") === "completed") {
					MessageToast.show("Task has been added. Switch to 'All' or 'Active' tab to see it");
				}
			}
		},

		_updateModelForDisplay: function () {
			var oModel = this.getView().getModel();
			var aTodoItems = oModel.getProperty("/items");
			var aTodoItemsToDisplay = aTodoItems;
			var total = aTodoItems.length;
			var completed = aTodoItems.filter(function (i) {
				return i.done;
			}).length;
			var active = total - completed;

			switch (oModel.getProperty("/selectedTabKey")) {
			case "completed":
				aTodoItemsToDisplay = aTodoItems.filter(function (i) {
					return i.done;
				});
				break;
			case "active":
				aTodoItemsToDisplay = aTodoItems.filter(function (i) {
					return !i.done;
				});
				break;
			default:
				break;
			}

			oModel.setProperty("/itemsToDisplay", aTodoItemsToDisplay);
			oModel.setProperty("/total", total);
			oModel.setProperty("/completed", completed);
			oModel.setProperty("/active", active);
		},

		onDeleteTodo: function (oEvent) {
			var oTaskToDelete = oEvent.getSource().data("task");
			var oModel = this.getView().getModel();
			var aTodoItems = oModel.getProperty("/items");
			// Filter the task to delete
			aTodoItems = aTodoItems.filter(function (e) {
				return e !== oTaskToDelete;
			});
			oModel.setProperty("/items", aTodoItems);
			this._updateModelForDisplay();
		},

		onIconTabBarSelect: function (oEvent) {
			var selectedKey = oEvent.getParameter("selectedKey");
			var oModel = this.getView().getModel();
			oModel.setProperty("/selectedTabKey", selectedKey);
			this._updateModelForDisplay();
		}
	});
});