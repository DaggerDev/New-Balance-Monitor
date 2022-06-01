const axios = require ('axios');
const cheerio =  require ('cheerio');
const https = require ('https');
const fs = require('fs');
const { Console } = require('console');


let baseURL = "https://www.newbalance.com/men/shoes/all-shoes/";
let allURL = "https://www.newbalance.com/men/shoes/all-shoes/?start=0&sz="; // this link will show every shoe in existence on New Balances website at once
let totalShoes = 317;

// allURL + totalShoes

let currentPage = 1;
let maxPages = 1; // set this to 10 or something later when we're no longer testing/debugging
let canContinue = true;

const ShoesPerPage = 24;

const ShoeIDs = [];
const ShoeName = [];
const ShoeLinks = [];
const ShoePicLinks = [];
const ShoePrices = [];


// TODO
// create a way to loop through all pages
// 24 shoes per page
// divide total shoes by 24
// 
// (Just use link that shows every shoe on the page)
//
// create a json table or something to log what shoes we've seen before
// create a discord announcement when a new shoe is created

function getShoes() // should probably send this request every 5 seconds?
{
    console.log('Page: ' +currentPage + '/'+maxPages+ ': Sending HTTP Request...');
    axios.get(baseURL)
        .then((response) => {

            //CREATE A WAY TO DEBUG RESPONSE .HTML FILE
            const output = fs.createWriteStream('./response.html');
            const errorOutput = fs.createWriteStream('./response.html');
            // custom simple logger
            const logger = new Console(output, errorOutput);
            logger.log(response);

            // NOW USE CHEERIO TO FIND GIFS
            console.log("Request sent looping through data...")
            const $ = cheerio.load(response.data);
            $('.pgptiles', response.data).each(function(){

                //console.log($(this).attr("data-product-position"));
                let t = $(this).find('.product').attr('data-pid')
                ShoeIDs.push(t);
                //let name = $(this).find('.product w-100').find('.product-tile w-100').find('.tile-body').find('.row pgp-grid pb-2 pr-2').find('.col-12 col-lg-7 pl-2 fw-search').find('.pdp-link').find('a').attr('href');
                let name = $(this).find('.product').find('.product-tile').find('.tile-body').find('.row').find('.col-12').find('.pdp-link').find('a').text();
                let link = $(this).find('.product').find('.product-tile').find('.tile-body').find('.row').find('.col-12').find('.pdp-link').find('a').attr('href');
                let price = $(this).find('.product').find('.product-tile').find('.tile-body').find('.row').find('.col-lg-5').find('.price').find('.price-value').find('.sales').text();
                let imgLink = $(this).find('.product').find('.product-tile').find('.image-container').find('a').find('picture').find('img').attr('data-src');
                ShoeName.push(name);
                ShoeLinks.push(link);
                ShoePicLinks.push(imgLink);
                ShoePrices.push(price);

            })
            currentPage++;
            if(currentPage < maxPages)
            {
                // recursively loop through getShoes() again.
            }
            else
            {
                // do nothing.
            }
        });
}

getShoes();