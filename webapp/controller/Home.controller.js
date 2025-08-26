sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
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

        }
    });
});