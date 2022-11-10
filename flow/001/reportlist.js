const express = require("express");
const router = express.Router();
var mongodb = require('../../function/mongodb');
var mssql = require('./../../function/mssql');


//----------------- DATABASE

let MAIN_DATA = 'MAIN_DATA';
let MAIN = 'MAIN';

let PATTERN = 'PATTERN';
let PATTERN_01 = 'PATTERN_01';
let master_FN = 'master_FN';
let ITEMs = 'ITEMs';
let METHOD = 'METHOD';
let MACHINE = 'MACHINE';

//-----------------

let day = d;

Number.prototype.pad = function (n) {
  if (n === undefined)
    n = 2;

  return (new Array(n).join('0') + this).slice(-n);
}

//-----------------


router.get('/report01', async (req, res) => {
  res.json("report01");
});


router.post('/ReportList', async (req, res) => {

  var d = new Date();
  d.setFullYear(d.getFullYear(), d.getMonth(), 1);

  var dc = new Date();
  dc.setFullYear(dc.getFullYear(), dc.getMonth(), 7);

  // day = `${d.getFullYear()}-${(d.getMonth() + 1).pad(2)}-${(d.getDate()).pad(2)}`
  // dayC = `${dc.getFullYear()}-${(dc.getMonth() + 1).pad(2)}-${(dc.getDate()).pad(2)}`
  // tim = `${(d.getHours()).pad(2)}:${(d.getMinutes()).pad(2)}:${(d.getSeconds()).pad(2)}`

  out = {
    "ALL_DONE": 'DONE',
    "dateG":
    {
      "$gte": d,
      "$lt": dc
    }
  }
  // console.log(out)
  let find = await mongodb.find(MAIN_DATA, MAIN, out);
  let masterITEMs = await mongodb.find(master_FN, ITEMs, {});

  for (i = 0; i < find.length; i++) {
    //
    // console.log(Object.getOwnPropertyNames(find[i]["FINAL"]));
    let INS = Object.getOwnPropertyNames(find[i]["FINAL"]);
    for (j = 0; j < INS.length; j++) {
      let Item = find[i]["FINAL"][INS[j]];
      let Itemlist = Object.getOwnPropertyNames(find[i]["FINAL"][INS[j]]);
      // console.log(Object.getOwnPropertyNames(find[i]["FINAL"][INS[j]]));
      for (k = 0; k < Itemlist.length; k++) {
        if (Item[Itemlist[k]]["PSC1"] != undefined) {

          if (Item[Itemlist[k]]["PSC1"].length === undefined) {
            console.log(Item[Itemlist[k]]["PSC1"]["PO1"]);
          } else {
            // console.log(Item[Itemlist[k]]["PSC1"].length);
            let deppdata = Item[Itemlist[k]]["PSC1"];
            for (l = 0; l < deppdata.length; l++) {
              if (deppdata[l]["PO1"] === undefined) {
                // console.log(deppdata[l]["PIC1data"]);
                for (s = 0; s < masterITEMs.length; j++) {
                  if (masterITEMs[s]["masterID"] === Itemlist[k]) {
                    console.log(masterITEMs[s]["ITEMs"]);
                    break;
                  }
                }
              } else {
                if (deppdata[l]["PO1"] !== "Mean") {
                  console.log(deppdata[l]["PO1"]);
                }
              }
            }
          }
        }
      }
    }
  }


  return res.json(find.length);
});


router.post('/CopyReport', async (req, res) => {
  //-------------------------------------
  console.log('--CopyReport--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = "NOK";
  //-------------------------------------

  if (input[`original`] !== undefined && input[`new`] !== undefined) {

    let newdataHEAD = {};

    let find = await mongodb.find("ORDER", "ORDER", {});
    if (find.length > 0) {
      let sapdata = find[0][`DATA`];

      for (i = 0; i < sapdata.length; i++) {
        if (input[`new`] === sapdata[i][`PO`]) {
          newdataHEAD = sapdata[i];
          break;
        }
      }

      if (newdataHEAD[`CP`] != undefined) {
        let origianlDB = await mongodb.find(MAIN_DATA, MAIN, { "PO": input[`original`] });
        let NewMATCP = await mongodb.find(PATTERN, PATTERN_01, { "CP": newdataHEAD[`CP`] });

        if (NewMATCP.length > 0 && origianlDB.length >0) {
          let NewMATCPdata = NewMATCP[0];
          let origianlDBdata = origianlDB[0];



          let newINSERT = {
            "PO": input[`new`],
            "CP": NewMATCPdata[`CP`],
            "MATCP": NewMATCPdata[`CP`],
            "CUSTOMER": NewMATCPdata[`CUSTOMER`],
            "PART": NewMATCPdata[`PART`],
            "PARTNAME": NewMATCPdata[`PARTNAME`],
            "MATERIAL": NewMATCPdata[`MATERIAL`],
            
            //
            "QTY": newdataHEAD[`QUANTITY`],
            "PROCESS": newdataHEAD[`PROCESS`],
            "CUSLOT": newdataHEAD[`CUSLOTNO`],
            "TPKLOT": newdataHEAD[`FG_CHARG`],
            "QUANTITY": newdataHEAD[`QUANTITY`],
            "CUSLOTNO": newdataHEAD[`CUSLOTNO`],
            "FG_CHARG": newdataHEAD[`FG_CHARG`],
            "CUSTNAME": newdataHEAD[`CUSTNAME`],
            //
            "PARTNAME_PO": origianlDBdata[`PARTNAME_PO`],
            "PART_PO": origianlDBdata[`PART_PO`],
            "RESULTFORMAT": origianlDBdata[`RESULTFORMAT`],
            "GRAPHTYPE": origianlDBdata[`GRAPHTYPE`],
            "GAP": origianlDBdata[`GAP`],
            "dateupdatevalue": origianlDBdata[`dateupdatevalue`],
            "FINAL": origianlDBdata[`FINAL`],
            "CHECKlist": origianlDBdata[`CHECKlist`],
            "FINAL_ANS": origianlDBdata[`FINAL_ANS`],
            "ALL_DONE": "DONE",
            "PO_judgment": "DONE",
            //
            "ReferFrom": input[`original`],
            "dateG": new Date(),
            "dateGSTR": day,


          };

          let insertdb = await mongodb.insertMany(MAIN_DATA, MAIN, [newINSERT]);
          output = "OK";
        }



      }



    }

  }

  return res.json(output);
});




module.exports = router;