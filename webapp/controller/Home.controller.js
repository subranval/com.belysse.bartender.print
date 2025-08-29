sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter"
], (Controller, JSONModel, Fragment,Filter) => {
    "use strict";

    return Controller.extend("com.belysse.bartender.print.controller.Home", {
        onInit() {
            var oViewModel = new JSONModel(sap.ui.require.toUrl("com/belysse/bartender/print/model/model.json"));
            this.getView().setModel(oViewModel, "oViewModel");
        },
        onSelectLabelGroup: function (oEvent) {
            var sSelectedKey = oEvent.getSource().getSelectedKey();
            var oViewModel = this.getView().getModel("oViewModel");

            // Get the maps from the model
            var oLabelTypeDataMap = oViewModel.getProperty("/LabelTypeDataMap");
            var oDocTypeDataMap = oViewModel.getProperty("/DocTypeDataMap");

            // Fetch the relevant arrays or default to empty
            var oLabelTypeData = oLabelTypeDataMap[sSelectedKey] || [];
            var oDocTypeData = oDocTypeDataMap[sSelectedKey] || [];

            oViewModel.setProperty("/LabelTypeData", oLabelTypeData);
            oViewModel.setProperty("/DocTypeData", oDocTypeData);

        },
        openPlantVH: function () {
            this.getView().setBusy(true);
            if (!this._pPlantVHDialog) {
                this._pPlantVHDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "com.belysse.bartender.print.view.fragments.PlantVH",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }
            this._pPlantVHDialog.then(function (oDialog) {
                oDialog.open();
                this.getView().setBusy(false);
            }.bind(this));
        },
        onSelectPlant: function (oEvent) {
            let oTable = this.getView().byId("idPlantTable").getTable();
            let oSelectedObj = oTable.getSelectedItem().getBindingContext().getObject();
            let oViewModel = this.getView().getModel("oViewModel");
            oViewModel.setProperty("/Plant", oSelectedObj.Plant);
            this.getView().byId("idPlantTable").getParent().close();
        },
        onClosePlant: function (oEvent) {
            oEvent.getSource().getParent().close();
        },
        openDocumentNoVH: function () {
            let oView = this.getView();
            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.belysse.bartender.print.view.fragments.DocumentNoVH",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }

            this._pValueHelpDialog.then(function (oValueHelpDialog) {
                // create a filter for the binding
                oValueHelpDialog.getBinding("items").filter([new Filter(
                    "DocumentType",
                    "EQ",
                    "EL"
                )]);
                // open value help dialog filtered by the input value
                oValueHelpDialog.open(sInputValue);
            });
        }
    });
});