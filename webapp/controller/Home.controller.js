sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/m/Token"
], (Controller, JSONModel, Fragment, Filter,Token) => {
    "use strict";

    return Controller.extend("com.belysse.bartender.print.controller.Home", {
        onInit() {
            var oViewModel = new JSONModel(sap.ui.require.toUrl("com/belysse/bartender/print/model/model.json"));
            this.getView().setModel(oViewModel, "oViewModel");

        },
        onSelectLabelGroup: function (oEvent) {
            let sSelectedKey = oEvent.getSource().getSelectedKey();
            let oViewModel = this.getView().getModel("oViewModel");

            // Get the maps from the model
            let oLabelTypeDataMap = oViewModel.getProperty("/LabelTypeDataMap");
            let oDocTypeDataMap = oViewModel.getProperty("/DocTypeDataMap");

            // Fetch the relevant arrays or default to empty
            let oLabelTypeData = oLabelTypeDataMap[sSelectedKey] || [];
            let oDocTypeData = oDocTypeDataMap[sSelectedKey] || [];

            oViewModel.setProperty("/LabelTypeData", oLabelTypeData);
            oViewModel.setProperty("/DocTypeData", oDocTypeData);
            oViewModel.setProperty("/HUFieldVisible", false);
            oViewModel.setProperty("/BatchFieldVisible", false);
            oViewModel.setProperty("/MaterialVisible", false);
            if (sSelectedKey === "Inbound") {
                oViewModel.setProperty("/HUFieldVisible", true);
            }
            else if (sSelectedKey === "Production") {
                oViewModel.setProperty("/MaterialVisible", true);
            }
            else if (sSelectedKey === "Production + Shipping") {
                oViewModel.setProperty("/BatchFieldVisible", true);

            }
            else if (sSelectedKey === "Shipping") {
                oViewModel.setProperty("/HUFieldVisible", true);
                oViewModel.setProperty("/BatchFieldVisible", true);
            }

        },
        onSelectLabelType: function (oEvent) {
            let sSelectedKey = oEvent.getSource().getSelectedKey();
            let oViewModel = this.getView().getModel("oViewModel");
            oViewModel.setProperty("/HUFieldVisible", false);
            oViewModel.setProperty("/BatchFieldVisible", false);
            oViewModel.setProperty("/MaterialVisible", false);

            if (sSelectedKey === "") {

            }

        },
        onSelectDocType: function (oEvent) {
            let sSelectedKey = oEvent.getSource().getSelectedKey();
            let oViewModel = this.getView().getModel("oViewModel");
            oViewModel.setProperty("/DocumentType", sSelectedKey);
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
            let sFilterDocType;
            let sDocumentType = this.getView().getModel("oViewModel").getProperty("/DocumentType");
            if (!sDocumentType) {
                sap.m.MessageToast.show("Please select Document type first!");
                return;
            }
            if (sDocumentType === "Inbound delivery") {
                sFilterDocType = "EL";
            }
            else if (sDocumentType === "Production Order") {
                sFilterDocType = "PP";
            }
            else if (sDocumentType === "Freight Order") {
                sFilterDocType = "SFO2";
            }
            else if (sDocumentType === "Delivery") {
                sFilterDocType = "LF";
            }
            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                   
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
                    sFilterDocType
                )]);
                // open value help dialog filtered by the input value
                oValueHelpDialog.open();
            });
        },
        _handleDocVHClose: function (oEvent) {
            var aSelectedItems = oEvent.getParameter("selectedItems"),
                oMultiInput = this.getView().byId("DocTypeInput");

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        text: oItem.getTitle()
                    }));
                });
            }
        },
        openBatchVH: function () {
            let oView = this.getView();

            if (!this._pBatchVHDialog) {
                this._pBatchVHDialog = Fragment.load({
                    
                    name: "com.belysse.bartender.print.view.fragments.BatchVH",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }

            this._pBatchVHDialog.then(function (oValueHelpDialog) {

                // open value help dialog filtered by the input value
                oValueHelpDialog.open();
            });
        },
        _handleBatchVHClose: function (oEvent) {
            var aSelectedItems = oEvent.getParameter("selectedItems"),
                oMultiInput = this.getView().byId("BatchInput");

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        text: oItem.getTitle()
                    }));
                });
            }
        },
        openMaterialVH: function () {
            let oView = this.getView();

            if (!this._pMaterialVHDialog) {
                this._pMaterialVHDialog = Fragment.load({
                   
                    name: "com.belysse.bartender.print.view.fragments.MaterialVH",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }

            this._pMaterialVHDialog.then(function (oValueHelpDialog) {

                // open value help dialog filtered by the input value
                oValueHelpDialog.open();
            });
        },
        _handleMaterialVHClose: function (oEvent) {
            var aSelectedItems = oEvent.getParameter("selectedItems"),
                oMultiInput = this.getView().byId("MaterialInput");

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        text: oItem.getTitle()
                    }));
                });
            }
        },
        openHUNoVH: function () {
            let oView = this.getView();

            if (!this._pHUNoVHDialog) {
                this._pHUNoVHDialog = Fragment.load({
                   
                    name: "com.belysse.bartender.print.view.fragments.HUNoVH",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }

            this._pHUNoVHDialog.then(function (oValueHelpDialog) {

                // open value help dialog filtered by the input value
                oValueHelpDialog.open();
            });
        },
        _handleHUVHClose: function (oEvent) {
            var aSelectedItems = oEvent.getParameter("selectedItems"),
                oMultiInput = this.getView().byId("HUInput");

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        text: oItem.getTitle()
                    }));
                });
            }
        },
    });
});