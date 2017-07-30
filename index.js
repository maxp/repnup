//
//
//


// config params:
const
  MDB_URL = 'mongodb://mdb:27017/repnup';
  PORT    = 3000;
//


const
  http = require('http'),
  csv = require('csv-parse')
  transform = require('stream-transform')
  Busboy = require('busboy'),
  mdb = require('./mdb')
  ;

function html_data(req, res) {
  mdb.fetch(
    {},
    (data) => {
      // NOTE: no html escape!
      res.write("<table>")
      for(const d of data) {
        res.write("<tr>");
        res.write("<td>"+d.name+"</td>\n");
        res.write("<td>"+d.surname+"</td>\n");
        res.write("<td>"+d.email+"</td>\n");
        res.write("</tr>\n");
      }
      res.write("</table>")
      res.end();
    }
  )
}

function process_upload(req, res) {
  let
    linecount = 0;

  const
    busboy = new Busboy({ headers: req.headers })
      .on('file', (fieldname, file, filename, encoding, mimetype) => {
        var parser = csv({delimiter:','})
        var trs = transform((row, cb) => {
          linecount++;
          console.log("row:", linecount, row);
          // prepare record to insert
          let d = {name: row[0], surname: row[1], email: row[2]}
          mdb.insert(d, cb);
        })
        file.pipe(parser).pipe(trs)
      })
      .on('finish', () => {
        res.writeHead(302, "Found", {'Location': '/'});
        res.end();
      });

  return req.pipe(busboy);
}


function handler(req, res)
{
  // NOTE: no url dispatch, no error handling!!!

  if(req.method == "POST") {
    process_upload(req, res);
  }
  else {
    // sorry for raw html w/o templates
    // res.setHeader()
    res.writeHead(200, "OK", {"Content-Type": "text/html;charset=utf-8"});
    res.write("<!DOCTYPE html>"+
      "<hr>"+
      "<form action='/upload' method='POST' enctype='multipart/form-data'>"+
        "<input type='file' name='csv' />"+
        "<input type='submit' value='Upload CSV' />"+
      "</form>"+
      "<hr>"
    );
    html_data(req, res);
  }
}


mdb.init( MDB_URL,
  () => {
    http
      .createServer( handler )
      .listen(PORT, () => {
        console.log('Listening at port:', PORT);
      });
  }
)


//.


/***

The goal of this exercise is to understand what you consider production-quality
code with a small set of requirements. The application will be a web page
containing a form which allows the upload of a CSV file in the following format:

First name, Surname, Email

This file could contain any number of lines!
Create a program that parses the uploaded data and save it in a database
(you may use a SQLite database).
The data should also be displayed on the web page.

Keep in mind that you don't know the length of the file, and it may be very long.

Requirements:
- Node.js (version 6.3 and on)
- Input CSV file can contain very large dataset,
  you don't know the length of the file
- Cover code with some level of unit testing. No need to cover all the code,
  just show ability to write good and well maintainable unit tests

***/
