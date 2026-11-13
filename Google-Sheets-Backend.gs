/** BRANDIX F1 CHALLENGE 2026 - Google Sheets backend
 * 1. Create a Google Sheet, then Extensions > Apps Script.
 * 2. Replace the editor content with this code and Save.
 * 3. Deploy > New deployment > Web app.
 *    Execute as: Me | Who has access: Anyone
 * 4. Deploy, authorize access, copy the Web app URL into the website settings.
 * IMPORTANT: Create this script from the target Google Sheet via Extensions > Apps Script.
 */
const SHEET_NAME = 'Scores';
const HEADERS = ['id','name','s1','s2','s3','s4','total','updatedAt'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}
function output_(e, obj) {
  const callback = e && e.parameter && e.parameter.callback;
  const body = JSON.stringify(obj);
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + body + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}
function doGet(e) {
  try {
    const action = (e.parameter.action || 'list').toLowerCase();
    const sh = getSheet_();
    if (action === 'list') {
      const values = sh.getDataRange().getValues();
      const data = values.slice(1).filter(r => r[0]).map(r => ({
        id:String(r[0]), name:String(r[1]), s1:Number(r[2]), s2:Number(r[3]),
        s3:Number(r[4]), s4:Number(r[5]), total:Number(r[6])
      }));
      return output_(e, {ok:true, data:data});
    }
    if (action === 'upsert') {
      const p = e.parameter;
      const name = String(p.name || '').trim();
      const id = String(p.id || '');
      const s1 = Number(p.s1), s2 = Number(p.s2), s3 = Number(p.s3), s4 = Number(p.s4);
      if (!id || !name || !Number.isInteger(s1) || s1<0 || s1>10 || !Number.isInteger(s2) || s2<0 || s2>10 || !Number.isInteger(s3) || s3<0 || s3>15 || !Number.isInteger(s4) || s4<0 || s4>15) throw new Error('Invalid score data');
      const total = s1+s2+s3+s4;
      const last = sh.getLastRow();
      const ids = last > 1 ? sh.getRange(2,1,last-1,1).getValues().flat().map(String) : [];
      const found = ids.indexOf(id);
      const row = [id,name,s1,s2,s3,s4,total,new Date()];
      if (found >= 0) sh.getRange(found+2,1,1,HEADERS.length).setValues([row]);
      else sh.appendRow(row);
      return output_(e, {ok:true, message:'saved'});
    }
    if (action === 'delete') {
      const id = String(e.parameter.id || '');
      const last = sh.getLastRow();
      if (last > 1) {
        const ids = sh.getRange(2,1,last-1,1).getValues().flat().map(String);
        const found = ids.indexOf(id);
        if (found >= 0) sh.deleteRow(found+2);
      }
      return output_(e, {ok:true, message:'deleted'});
    }
    return output_(e, {ok:false, error:'Unknown action'});
  } catch (err) {
    return output_(e, {ok:false, error:String(err.message || err)});
  }
}
