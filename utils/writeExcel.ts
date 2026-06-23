import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

async function writeExcelData() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Login Data');

  sheet.columns = [
    { header: 'Username', key: 'username', width: 20 },
    { header: 'Password', key: 'password', width: 20 },
    { header: 'Role', key: 'role', width: 15 },
  ];

  sheet.addRow({ username: 'admin', password: 'admin123', role: 'user' });
  sheet.addRow({ username: 'tester', password: 'test123', role: 'qa' });
  sheet.addRow({username:'developer',password:'developer123',role:'developer'});
  //delete specified row
  //sheet.spliceRows(4, 1); 
  //add row
  sheet.spliceRows(5,1,['tester','tester123','qa']);

  // ✅ Ensure the folder exists before writing
  const dirPath = path.join(__dirname, '../testdata');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, 'loginData.xlsx');
  await workbook.xlsx.writeFile(filePath);

  console.log('✅ Excel file created!');
}

writeExcelData();