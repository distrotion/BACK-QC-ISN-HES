const express = require("express");
const router = express.Router();
var mongodb = require('../../function/mongodb');


router.post('/upqcdata', async (req, res) => {
  //-------------------------------------
  console.log('--upqcdata--');
  console.log(req.body);
  //-------------------------------------


  //-------------------------------------
  res.json(output);
});

router.post('/rugamplitude', async (req, res) => {
  //-------------------------------------
  console.log('--rugamplitude--');
  console.log(req.body);
  let input = req.body;
  let output = '';
  //-------------------------------------
  let memeP = ''
  let memeN = ''
  let coutP = 0
  let coutN = 0

  if (input['data'] != undefined && input['limit'] != undefined) {



    for (let i = 0; i < input['data'].length; i++) {


      // console.log(parseFloat(input['data'][i]['Z']));


      if (parseFloat(input['data'][i]['Z']) >= parseFloat(`${input['limit']}`)) {
        if (memeP === '') {
          memeP = 'alresdy'
          coutP++
        }
      } else {
        memeP = ''
      }

      if (parseFloat(input['data'][i]['Z']) <= -parseFloat(`${input['limit']}`)) {
        if (memeN === '') {
          memeN = 'alresdy'
          coutN++
        }
      } else {
        memeN = ''
      }






    }

    output = { "P": coutP, "N": coutN, "CP": coutP+coutN, }

  }




  //-------------------------------------
  res.json(output);
});


module.exports = router;