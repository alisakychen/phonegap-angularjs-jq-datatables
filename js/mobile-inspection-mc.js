var dialogApp = angular.module("fieldInspectionApp", []);

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

function InspectionCtrl($scope) {
  // view
    $scope.iColDefs = [ 
      { "sTitle": "AP Type", "aTargets":[0], "mData": "apType",
        "sWidth": "6em", "sClass": "mobile-apInfo" },
      { "sTitle": "AP #", "aTargets":[1], "mData": "apNum", 
        "sWidth": "4.5em", "sClass": "tCenter" },
      { "sTitle": "Insp #", "aTargets":[2], "mData": "inspNum",
        "sWidth": "4.5em", "sClass": "tCenter" },
      { "sTitle": "Type", "aTargets":[3], "mData": "type",
        "sWidth": "4.5em", "sClass": "tRight" },
      { "sTitle": "Desc", "aTargets":[4], "mData": "desc",
        "sWidth": "10em" },
      { "sTitle": "#", "aTargets":[5], "mData": "count",
        "sWidth": "2em", "sClass": "tCenter" },
      { "sTitle": "Result", "aTargets":[6], "mData": "result",
        "mRender": function (data, type, oRow) {
          if (type === "display" && data === null) {
            return "<a ng-click=''><img src='test.jpg' /></a>";
          } // else
          return data;
        },
        "sClass": "mobile-initial tCenter" },
      { "sTitle": "Address", "aTargets":[7], "mData": "address",
        "sWidth": "14em"}
    ];

  $scope.iDataTableOptions = {
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
  if (document.width <= 480) {
    // combine AP Type and AP # into one column
    // NOTE: May need to adjust sorting/filtering, check with client
    $scope.iColDefs[0].sTitle = "AP Type <span class='indent'> AP #</span>";
    $scope.iColDefs[0].mRender = function (data, type, oRow) {
      if (type === "display") {
          return data + "<span class='indent'>" + oRow.apNum + "</span>";
      } else {
          return data + " " + oRow.apNum;
      }
    };

    // remove AP# column from view;
    // hiding the column doesn't work
    // if you want to keep the column order
    $scope.iColDefs.splice(1, 1);

    // correct the aTargets for the remaining columns
    for (var i = $scope.iColDefs.length - 1; i > 0; i--) {
      $scope.iColDefs[i].aTargets = [i];
    }

    // truncate data to first letter in result column
    $scope.iColDefs[5].mRender = function (data, type, oRow) {
      if (type === "display") {
        if (data === null) {
          return "<a ng-click=''><img src='test.jpg' /></a>";
        } //else
        return data[0];
      } else {
        return data;
      }
    }
  } else {
    // scroll not needed on larger screens
    $scope.iDataTableOptions["sScrollX"] = "";
  };
  
  $scope.ifixedColOptions = {
    "iLeftColumns": 2,
    "sHeightMatch": "none"
  };

  // model, data
  $scope.iData = [
    { apType: "Building", apNum: "xxx424", inspNum: "xxx7101", type: 951,
      desc: "Permit Expiration Inspection", count: 1, result: null,
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
      comments: ""},

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