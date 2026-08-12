/**
 * Focus LP — קליטת לידים לגיליון "Focus Leads — قائمة التوزيع"
 *
 * התקנה:
 * 1. פותחים את הגיליון:
 *    https://docs.google.com/spreadsheets/d/1JFvYx9a_KB1_U0LSE69Ln29vswUavsv3179UIkiL2BA/edit
 * 2. Extensions -> Apps Script, מוחקים הכל ומדביקים את הקובץ הזה.
 * 3. Deploy -> New deployment -> Type: Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 4. מעתיקים את ה-Web app URL ומדביקים ב-focus.html במשתנה ENDPOINT.
 *
 * לעדכון עתידי: Deploy -> Manage deployments -> עריכה -> New version
 * (חשוב: אותו deployment, אחרת ה-URL משתנה)
 */

var SHEET_ID = '1JFvYx9a_KB1_U0LSE69Ln29vswUavsv3179UIkiL2BA';
var TAB_NAME = 'Leads';
var HEADERS = ['תאריך', 'שם', 'טלפון', 'אימייל', 'תחום', 'מקור'];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.business || '',
      data.source || ''
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, status: 'alive' });
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(TAB_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(TAB_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
