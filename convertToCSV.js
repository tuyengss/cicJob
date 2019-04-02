var xlsx = require('xlsx');
var fs = require('fs');
//var SheetJSSQL = require('./SheetJSSQL');


/*var path = "C:/Users/Binh/Desktop/webextensions-examples-master/borderify/cicdata"
var output = "C:/Users/Binh/Desktop/webextensions-examples-master/borderify/cicdata-csv"*/
var path = "d:/cicdata"
var output = "d:/cicdata-csv/data1.txt"

fs.readdir(path, async function (err, items) {
    var data = []
    for (var i = 0; i < items.length; i++){
        var rows = [];
        var writeStr = "";
        var obj = xlsx.readFile(path + '/' + items[i]); // parses a file
        var queries = SheetJSSQL.book_to_sql(obj, "MYSQL");
        var temp = queries.join('\n')
        await writeData({fileName:output, data:temp})
        console.log('success')
    }
    //writeMultiFiles(items, 0, data)

});
function writeData(params){
    return new Promise((resolve,reject)=>{
      /*fs.writeFile(params.fileName,params.data,'utf8',(err)=>{
         if(err)
            reject(err);
         else
            resolve();
        });*/
        fs.appendFile(params.fileName, params.data, function (err) {
            if(err)
            reject(err);
         else
            resolve();        
      
          });
   });
}
function writeMultiFiles(fileArr, iFile, data){
    if (iFile >= fileArr.length){
        return
    }
    fs.writeFile(fileArr[iFile], data[iFile], function(error){
        if (error){
            console.log(error)
        }
        else{
            iFile++
            writeMultiFiles(fileArr, iFile, data)
        }
    })
}

//creates the csv string to write it to a file



/* xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
/* global XLSX, require, module */
var SheetJSSQL = (function() {

    var X;
    if(typeof XLSX !== "undefined") X = XLSX;
    else if(typeof require !== 'undefined') X = require('xlsx');
    else throw new Error("Could not find XLSX");
    
    var _TYPES = {
      "PGSQL":  { t:"text", n:"float8", d:"timestamp", b:"boolean" },
      "MYSQL":  { t:"TEXT", n:"REAL",   d:"DATETIME",  b:"TINYINT" },
      "SQLITE": { t:"TEXT", n:"REAL",   d:"TEXT",      b:"REAL"    }
    }
    function sheet_to_sql(ws, sname, mode) {
      var TYPES = _TYPES[mode || "SQLITE"]
      if(!ws || !ws['!ref']) return;
      var range = X.utils.decode_range(ws['!ref']);
      if(!range || !range.s || !range.e || range.s > range.e) return;
      var R = range.s.r, C = range.s.c;
    
      var names = new Array(range.e.c-range.s.c+1);
      for(C = range.s.c; C<= range.e.c; ++C){
        var addr = X.utils.encode_cell({c:C,r:R});
        names[C-range.s.c] = ws[addr] ? ws[addr].v : X.utils.encode_col(C);
      }
    
      for(var i = 0; i < names.length; ++i) if(names.indexOf(names[i]) < i)
        for(var j = 0; j < names.length; ++j) {
          var _name = names[i] + "_" + (j+1);
          if(names.indexOf(_name) > -1) continue;
          names[i] = _name;
        }
    
      var types = new Array(range.e.c-range.s.c+1);
      for(C = range.s.c; C<= range.e.c; ++C) {
        var seen = {}, _type = "";
        for(R = range.s.r+1; R<= range.e.r; ++R)
          seen[(ws[X.utils.encode_cell({c:C,r:R})]||{t:"z"}).t] = true;
        if(seen.s || seen.str) _type = TYPES.t;
        else if(seen.n + seen.b + seen.d + seen.e > 1) _type = TYPES.t;
        else switch(true) {
          case seen.b: _type = TYPES.b; break;
          case seen.n: _type = TYPES.n; break;
          case seen.e: _type = TYPES.t; break;
          case seen.d: _type = TYPES.d; break;
        }
        types[C-range.s.c] = _type || TYPES.t;
      }
    
      var out = [];
    
      var BT = mode == "PGSQL" ? "" : "`";
      var Q  = mode == "PGSQL" ? "'" : '"';
      var J  = mode == "PGSQL" ? /'/g : /"/g;
      //out.push("DROP TABLE IF EXISTS " + BT + sname + BT );
      //out.push("CREATE TABLE " + BT + sname + BT + " (" + names.map(function(n, i) { return BT + n + BT + " " + (types[i]||"TEXT"); }).join(", ") + ");" );
    
      for(R = range.s.r+1; R<= range.e.r; ++R) {
        var fields = [], values = [];
        for(C = range.s.c; C<= range.e.c; ++C) {
          var cell = ws[X.utils.encode_cell({c:C,r:R})];
          if(!cell) continue;
          //fields.push(BT + names[C-range.s.c] + BT);
          var val = cell.v;
          /*switch(types[C-range.s.c]) {
            //case TYPES.n: if(cell.t == 'b' || typeof val == 'boolean' ) val = +val; break;
            default: val = "'" + val.toString() + "'";
          }*/
          val = "'" + val.toString() + "'";
          values.push(val);
        }
        out.push("insert into user_cic_old(id, cic,cmt, name, address,phone) VALUES (" + values.join(",") + ");");
      }
    
      return out;
    }
    
    function book_to_sql(wb, mode) {
      return wb.SheetNames.reduce(function(acc, n) {
        return acc.concat(sheet_to_sql(wb.Sheets[n], n, mode));
      }, []);
    }
    
    return {
      book_to_sql: book_to_sql,
      sheet_to_sql: sheet_to_sql
    };
    })();
    if(typeof module !== 'undefined') module.exports = SheetJSSQL;