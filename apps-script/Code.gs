const SHEET_NAME = 'DashboardData';
const AUTH_SECRET = 'CHANGE_ME_TO_A_STRONG_SECRET';
const ALLOWED_ORIGINS = ['https://akim730.github.io', 'http://localhost:8000'];

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Dashboard upload API is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const origin = e && e.parameter && e.parameter.origin ? e.parameter.origin : null;
    const request = JSON.parse(e.postData.contents || '{}');

    if (!request || !request.token) {
      return errorResponse('Missing auth token', 401);
    }

    if (request.token !== AUTH_SECRET) {
      return errorResponse('Invalid auth token', 401);
    }

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return errorResponse('Origin not allowed', 403);
    }

    const payload = request.payload || [];
    if (!Array.isArray(payload) || payload.length === 0) {
      return errorResponse('No records to import', 400);
    }

    const sheet = getOrCreateSheet(SHEET_NAME);
    const headers = [
      'Task ID',
      'Task Name',
      'Phase',
      'Task Status',
      'Area',
      'Code',
      'Trade',
      'Trade Def',
      'DMD Outstanding',
      'Basic Hrs',
      'TS Mhrs',
      'Creation Dt',
      'Complete Dt',
      'Updated At'
    ];

    const existing = sheet.getDataRange().getValues();
    if (existing.length === 0) {
      sheet.appendRow(headers);
    }

    const rowsToAppend = payload.map((row) => [
      row.TaskID || '',
      row.TaskName || '',
      row.Phase || '',
      row.TaskStatus || '',
      row.Area || '',
      row.Code || '',
      row.Trade || '',
      row.TradeDef || '',
      row.DMDOutstanding ?? 0,
      row.BasicHrs ?? 0,
      row.TSMhrs ?? 0,
      row.CreationDt || '',
      row.CompleteDt || '',
      new Date().toISOString()
    ]);

    if (rowsToAppend.length) {
      sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAppend.length, rowsToAppend[0].length).setValues(rowsToAppend);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, saved: rowsToAppend.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return errorResponse(error.message || 'Upload failed', 500);
  }
}

function errorResponse(message, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: message, statusCode }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  return sheet;
}

function setScriptProperties() {
  PropertiesService.getScriptProperties().setProperty('AUTH_SECRET', AUTH_SECRET);
}
