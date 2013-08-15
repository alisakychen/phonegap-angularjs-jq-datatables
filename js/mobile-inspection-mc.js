var dialogApp = angular.module("fieldInspectionApp", ["swiper"]);

dialogApp.directive("spryDataTable", function() {
  return function(scope, element, attrs) {
    // apply DataTable options, use defaults if none specified by user
    var options = {};
    if (attrs.spryDataTable.length > 0) {
      options = scope.$eval(attrs.spryDataTable);
    } else {
      options = {
        "bStateSave": true,
        "iCookieDuration": 2419200, /* 1 month */
        "bJQueryUI": false,
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": false,
        "bInfo": false,
        "bDestroy": true
      };
    }

    // Tell the dataTables plugin what columns to use
    // We can either derive them from the dom, or use setup from the controller           
    var explicitColumns = [];
    element.find('th').each(function(index, elem) {
      explicitColumns.push($(elem).text());
    });
    if (explicitColumns.length > 0) {
      options["aoColumns"] = explicitColumns;
    } else if (attrs.aoColumns) {
      options["aoColumns"] = scope.$eval(attrs.aoColumns);
    }

    // aoColumnDefs is dataTables way of providing fine control over column config
    if (attrs.aoColumnDefs) {
      options["aoColumnDefs"] = scope.$eval(attrs.aoColumnDefs);
    }
    
    if (attrs.fnRowCallback) {
      options["fnRowCallback"] = scope.$eval(attrs.fnRowCallback);
    }

    // apply the plugin
    var oDataTable = element.dataTable(options);
    //var oFixedColumns = false;

    // apply the FixedColumns extra only on smaller devices
    if (attrs.fixedColumns && document.width <= 480) {
      var fixedColOptions = {};
    
      if (attrs.fixedColumns.length > 0) {
        fixedColOptions = scope.$eval(attrs.fixedColumns);
      } // else show defaults here

      oFixedColumns = new FixedColumns(oDataTable, fixedColOptions);
    }

    // watch for any changes to our data, rebuild the DataTable
    scope.$watch(attrs.aaData, function(value) {
      var val = value || null;
      if (val) {
        oDataTable.fnClearTable();
        oDataTable.fnAddData(scope.$eval(attrs.aaData));
        //if (oFixedColumns) {
        //  alert("here");
        //  oFixedColumns.fnUpdate();
       // }

      }
    });

  };
});

function InspectionTableCtrl($scope) {
  // model
  $scope.columnDefs = [ 
    { "sTitle": "AP Type", "mDataProp": "apType", "aTargets":[0], "sWidth": "6em" },
    { "sTitle": "AP #", "mDataProp": "apNum", "aTargets":[1], "sWidth": "4.5em" },
    { "sTitle": "Insp #", "mDataProp": "inspNum", "aTargets":[2], "sWidth": "4.5em" },
    { "sTitle": "Type", "mDataProp": "type", "aTargets":[3], "sWidth": "4em" },
    { "sTitle": "Desc", "mDataProp": "desc", "aTargets":[4] },
    { "sTitle": "#", "mDataProp": "count", "aTargets":[5], "sWidth": "2em"},
    { "sTitle": "Result", "mDataProp": "result", "aTargets":[6]},
    { "sTitle": "Address", "mDataProp": "address", "aTargets":[7], "sWidth": "14em"}
  ];

  $scope.overrideOptions = {
    "bStateSave": true,
    "iCookieDuration": 2419200, /* 1 month */
    "bJQueryUI": true,
    "bPaginate": false,
    "bLengthChange": false,
    "bFilter": true,
    "bInfo": true,
    "bDestroy": true,
    "sScrollX": "100%",
    "bScrollCollapse": true,
  };
  if (document.width > 480) {
    $scope.overrideOptions["sScrollX"] = "";
  };
  
  $scope.fixedColumnOptions = {
    "iLeftColumns": 3
  };
  $scope.inspectionsData = [
    { apType: "Building", apNum: "xxx424", inspNum: "xxx7101", type: 951,
      desc: "Permit Expiration Inspection", count: 1, result: "Waived",
      address: "4xxx Saul Rd, Kensington",
      comments: ""},
    { apType: "Building", apNum: "xxx016", inspNum: "xxx7050", type: 951,
      desc: "Permit Expiration Inspection", count: 1, result: "Waived",
      address: "4xxx Cushing Dr, Kensington",
      comments: ""},
    { apType: "Electrical", apNum: "xxx425", inspNum: "xxx2875", type: 101,
      desc: "Heavy Up", count: 1, result: "Failed",
      address: "4xxx Aspen Hill Rd, Rockville",
      comments: ""},
    { apType: "Building", apNum: "xxx330", inspNum: "xxx1380", type: 251,
      desc: "Final", count: 3, result: "Passed",
      address: "4xxx Mercury Dr, Rockville",
      comments: "This will be done with electrical final"},
  
    { apType: "Building", apNum: "xxx524", inspNum: "xxx0984", type: 251,
      desc: "Final", count: 2, result: "Cancelled",
      address: "3xxx Woodridge Ave, Silver Spring",
      comments: ""},
    { apType: "Building", apNum: "xxx724", inspNum: "xxx6888", type: 101,
      desc: "Final", count: 1, result: "Passed",
      address: "1xxx Queensguard Rd, Silver Spring",
      comments: ""},
    { apType: "Electrical", apNum: "xxx307", inspNum: "xxx3476", type: 104,
      desc: "Concealment (Rough Wiring, Trenc", count: 1, result: "Passed",
      address: "5xxx Druid Dr, Kensington",
      comments: ""},
    { apType: "Electrical", apNum: "xxx388", inspNum: "xxx1379", type: 251,
      desc: "Final", count: 2, result: "Passed",
      address: "4xxx Mercury Dr, Rockville",
      comments: ""}
  ];
}