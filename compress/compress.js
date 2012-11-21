var fs  = require('fs');
var jsp = require("./uglify-js").parser;
var pro = require("./uglify-js").uglify;

var compressFile = function(flieIn, fileOut) {
    var origCode = fs.readFileSync(__dirname+"\\store\\"+flieIn,"utf-8");
    var ast = jsp.parse(origCode);
    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);

    var finalCode = pro.gen_code(ast);

    fs.writeFileSync(__dirname+"\\store\\"+fileOut,finalCode,'utf8');

    console.log("文件"+flieIn+"压缩完毕！"+"\n文件目录："+__dirname+"\\store\\"+fileOut);
};

compressFile("jquery-1.8.2.js", "jquery-1.8.2.min.js");

