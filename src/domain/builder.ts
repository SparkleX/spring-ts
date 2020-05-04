#!/usr/bin/env node

import { argv } from 'yargs';
import { Validator } from 'jsonschema';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as jsonfile from 'jsonfile';

if (!argv.in || !argv.out) {
	console.info("domain-builder --in=[input json folder] --out=[output folder]")
	process.exit(-1);
}

var v = new Validator();
var schema = jsonfile.readFileSync(`${__dirname}/../../resources/schema/table.json`, 'utf8');

var source = fs.readFileSync(`${__dirname}/../../resources/template/table.handlebars`, 'utf8');
var template = handlebars.compile(source);
handlebars.registerHelper('type', function(value, options) {
	switch(value){
		case "string":
		case "guid":
		case "datetime":
			 return "string";
		case "decimal" : 
		case "number" : 
			return "number";
	}
	return "any";
});


function validate(content: any, schema: any) {
	var errors = v.validate(content, schema).errors;
	if(errors.length!=0) {
		console.debug(errors);
		process.exit(-1);
	}
}

function buildSourceCode(json: object, outFile: string) {
	var sourceCode = template(json);
	fs.writeFileSync(outFile,sourceCode);
}

let dir = argv.in;
let files= fs.readdirSync(dir as string);	
var indexContent = "";
files.forEach(file => {
	var fullFilePath = `${dir}/${file}`;
	console.info(fullFilePath);
	var content = jsonfile.readFileSync(fullFilePath, 'utf8');
	validate(content, schema);
	var tableName = file.split(".")[0];
	var outFile = `${argv.out}/${tableName}.ts`;
	buildSourceCode(content, outFile);
	indexContent+= `export * from './${tableName}';\n`;

});



fs.writeFileSync(`${argv.out}/index.ts`, indexContent);

