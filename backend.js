 /* This is actually written in Google App Scripts, but
 * it is essentially javascript with some extra stuff
 * added by Google. */

/* This app was accurate for the Fall 2018 campaigns and is NOT 
* up to date for any semesters after that. */
 
 //[START] https://stackoverflow.com/questions/15668119/linking-to-another-html-page-in-google-apps-script


/**
 * Get the URL for the Google Apps Script running as a WebApp.
 */
function getScriptUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}

/**
 * Get "home page", or a requested page.
 * Expects a 'page' parameter in querystring.
 *
 * @param {event} e Event passed to doGet, with querystring
 * @returns {String/html} Html to be served
 */
function doGet(e) {
  //Logger.log( Utilities.jsonStringify(e) );
  if (!e.parameter.page) {
    // When no specific page requested, return "home page"
    return HtmlService.createTemplateFromFile('listgen').evaluate();
  }
  // else, use page parameter to pick an html file from the script
  return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate();
  
  }
 // [END]
  
function getContent(filename) {
    return HtmlService.createTemplateFromFile(filename).getRawContent();
}
  
function createFilteredList(campaign, info){
  console.log(campaign.campaign);
  var mastersheet = SpreadsheetApp.openById([REDACTED FOR GITHUB]); //masterlist document  
  var originalSheet = mastersheet.getSheetByName("Master Sheet");
  var campaignSheetID;
  
  var word = campaign.campaign; // Saves the campaign that the user selected 
  var recruitingCampaign; // Declares the campaign to be used in the if/else chain below
  
  /*
  * Based on what the user picked on the front end, this will assign campaignSheetID to 
  * the ID of the corresponding campaign.
  *
  * recruitingCampaign will be the index of the column for the campaign (indices
  * start at 0). For example, the 0th column on the spreadsheet is currently "First Name".
  * At some point, we'll want to come up with a default option in case someone wants a list
  * that is not specialised for a certain campaign, but that can be done in the future.
  */
  if(word == "Affordable Textbooks"){
    recruitingCampaign = 10;
    campaignSheetID = [REDACTED FOR GITHUB];
  } else if(word == "Labor Conditions"){
    recruitingCampaign = 11;
    campaignSheetID = [REDACTED FOR GITHUB];
  } else if(word == "Survey Corps"){
    recruitingCampaign = 12;
    campaignSheetID = [REDACTED FOR GITHUB];
  } else if(word == "Save the Bay"){
    recruitingCampaign = 13;
  } else if(word == "Zero Hunger on Campus"){
    recruitingCampaign = 14;
    campaignSheetID = [REDACTED FOR GITHUB];
  }
  
  /* creates date in format MM/DD */
  var shortDate = info.date.toString().substring(0,5);
  var title = info.location + " " + shortDate; //title will be "location MM/DD" ex: "North Campus 02/15"
  
  
  //var temp = workbook.copy(title); // creates a new spreadsheet document in user's terpmail drive
  var campaignSheet = SpreadsheetApp.openById(campaignSheetID);
  var sheet = originalSheet.copyTo(campaignSheet).setName(title); // creates a sheet with the title from above
  //var newID = temp.getId(); // saves the ID of the new spreadsheet
  //var newURL = temp.getUrl();

  //workbook = SpreadsheetApp.openById(newID); // opens the new spreadsheet that was just created
  campaignSheet.deleteSheet(campaignSheet.getSheets()[0]); // deletes the master sheet from the copy bc we don't need it there

  sheet = campaignSheet.getSheets()[0]; // selects the sheet we made so that it can be filtered
  
  /* The following three lines select the cells we want to iterate over */
  var rows = sheet.getDataRange(); // Selects all cells that have things in them
  var numRows = rows.getNumRows(); // Stores the number of rows that have things in them
  var values = rows.getValues(); // Stores the data in a giant array (I think)

//  var word = campaign.campaign; // Saves the campaign that the user selected 
//  var recruitingCampaign; // Declares the campaign to be used in the if/else chain below
  
  var newURL = campaignSheet.getUrl();
  
  
  console.log("recruitingCampaign: "+recruitingCampaign);

  
  var criteria = info.criteria; // info is an object passed in from the front end
  var resultArray = []; // objects will be added to this array below

    
    /*
    * This for loop goes through each row in the sheet and checks to see 
    * if the person in that row matches the criteria selected by the user 
    * via the front end. For example, if the user selected "volunteering"
    * and "Labor Conditions", then this loop will be looking for people with
    * a 1 in the "volunteer" column and a 1 in the "Labor Conditions" column.
    * It also checks that the phone number column is filled out. All other
    * rows are hidden on the sheet.
    */
    for (var i=1;i<numRows;i++){
      var row = values[i]; 
      var volunteer = parseInt(row[6]); // finds the number in the volunteer column.
      Logger.log(volunteer);
      var camp = parseInt(row[recruitingCampaign]); // finds the number in the specified campaign column 
      var lastContacted = row[17]; // finds the last contacted date
      var deleted = 0;
      
        // hides row if volunteering is 0
      if(!(volunteer == 1)){ 
          sheet.hideRows(i+1);
        }
      
        // hides row if chosen campaign is 0
        if(!(camp == 1)){
          sheet.hideRows(i+1);
        }
        
        // hides row if phone number is not provided
        if(!(row[2])){
          sheet.hideRows(i+1);
        }
        
//        if(sheet.isRowHiddenByUser(i+1)){
//          sheet.deleteRow(i+1);
//        }
        
        
    }
    
    /*
    * This loop goes through the sheet and deletes the hidden rows
    * from the sheet.
    */
    for (var i=1;i<numRows;i++){
      if(sheet.isRowHiddenByUser(i+1)){
        sheet.deleteRow(i+1);
        i--;
       }
    }
    
    return newURL;
}



