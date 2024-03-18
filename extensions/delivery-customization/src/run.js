// @ts-check

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Operation} Operation
 */

// The configured entrypoint for the 'purchase.delivery-customization.run' extension target
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  // The message to be added to the delivery option
  const message = "May be delayed due to weather conditions";

  let countryCode = input.localization.country.isoCode;
  let todayDate = input.shop.localTime.date;

  // console.log('countryCode', countryCode);

  // console.log('dateStandard', input.shop.localTime.date);
  // console.log('startDatePriority', startDatePriority);
  // console.log('endDatePriority', endDatePriority);
  // console.log('textDatePriority', textDatePriority);

  const configuration = JSON.parse(
    input.shop.metafield?.value ?? "{}"
  );

  const countryArray = configuration.Sheet1;

  // console.log('metafield', input.shop.metafield.value);

  const countryObject = getCountryObject(countryCode, countryArray);

  let dateStandard = countryObject[0]["Standard"] != undefined ? getShippingDate(parseInt(countryObject[0]["Standard"]), todayDate) : '';
  let endDatePriority = countryObject[0]["Priority_max"] != undefined ? getShippingDate(countryObject[0]["Priority_max"], todayDate) : '';
  let startDatePriority = countryObject[0]["Priority_min"] != undefined ? getShippingDate(countryObject[0]["Priority_min"], todayDate) : '';
  let endDateExpress = countryObject[0]["Express_max"] != undefined ? getShippingDate(countryObject[0]["Express_max"], todayDate) : '';
  let startDateExpress = countryObject[0]["Express_min"] != undefined ? getShippingDate(countryObject[0]["Express_min"], todayDate) : '';
  let dateCollect = countryObject[0]["Collect"] != undefined ? getShippingDate(parseInt(countryObject[0]["Collect"]), todayDate) : '';

  let textDateStandard, textDatePriority, textDateExpress, textDateCollect;

  if (dateStandard != '') {
    textDateStandard = 'Delivery by ' + formatDate(dateStandard);
  }
  if (startDatePriority != '') {
    textDatePriority = endDatePriority == '' ? 'Delivery by '  + formatDate(startDatePriority) : 'Delivery between  ' + formatDate(startDatePriority) + ' and ' + formatDate(endDatePriority);
  }
  if (startDateExpress != '') {
    textDateExpress = endDateExpress == '' ? 'Delivery by ' + formatDate(startDateExpress) : 'Delivery between ' + formatDate(startDateExpress) + ' and ' + formatDate(endDateExpress);
  }

  if (dateCollect != '') {
    textDateCollect = formatDate(dateCollect);
  }

  // console.log(parseInt(countryObject[0]["Standard"]));

  // let dateStandard = getShippingDate(5);
  // let startDatePriority = getShippingDate(5, todayDate);
  // let endDatePriority = getShippingDate(8, todayDate);
  // let textDatePriority = '';

  // if (startDatePriority != '') {
  //   textDatePriority = 'between  ' + formatDate(startDatePriority) + ' and ' + formatDate(endDatePriority);
  // }

  // console.log('textDateStandard', textDateStandard);
  // console.log('textDatePriority', textDatePriority);
  // console.log('textDateExpress', textDateExpress);
  // console.log('textDateCollect', textDateCollect);

  let toRename = input.cart.deliveryGroups
    .flatMap(group => group.deliveryOptions)
    .map(option => /** @type {Operation} */({
      rename: {
        deliveryOptionHandle: option.handle,
        title: option.title.startsWith('Standard') > 0 && textDateStandard != undefined ? `${option.title} - ${textDateStandard}` :
               option.title.startsWith('Priority') > 0 && textDatePriority != undefined ? `${option.title} - ${textDatePriority}` :
               option.title.startsWith('Express') > 0 && textDateExpress != undefined ? `${option.title} - ${textDateExpress}` :
               option.title.startsWith('Click & Collect') && textDateCollect != undefined > 0 ? `${option.title} - ${textDateCollect}`:
               `${option.title}`
      }
  }));

  // let toRename = input.cart.deliveryGroups
  //   // Filter for delivery groups with a shipping address containing the affected state or province
  //   .filter(group => group.deliveryAddress?.provinceCode &&
  //     group.deliveryAddress.provinceCode == "NC")
  //   // Collect the delivery options from these groups
  //   .flatMap(group => group.deliveryOptions)
  //   // Construct a rename operation for each, adding the message to the option title
  //   .map(option => /** @type {Operation} */({
  //     rename: {
  //       deliveryOptionHandle: option.handle,
  //       title: option.title ? `${option.title} - ${message}` : message
  //     }
  //   }));

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    operations: toRename
  };
};

function getShippingDate(noOfDaysToAdd, todayDate) {
  var holidayArray2023 = ['6/1/2023', '10/4/2023', '1/5/2023', '18/5/2023', '29/5/2023', '8/6/2023', '15/8/2023', '26/10/2023', '1/11/2023', '8/12/2023', '25/12/2023', '26/12/2023', '27/12/2023', '28/12/2023', '29/12/2023'];
  var holidayArray2024 = ['1/1/2024', '1/4/2024', '9/5/2024', '20/5/2024', '30/5/2024', '15/8/2024', '1/11/2024', '8/12/2024', '25/12/2024', '26/12/2024']

  // var startDate = preOrderShippingDate == false ? new Date() : new Date(preOrderShippingDate);

  var dateParts = todayDate.split('-');
  var startDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

  var startDateFormat = startDate.getDate() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear();
  var endDate = "",
    count = 0;

  // var time_delay = checkProductsInCart();
  var time_delay = 0;
  noOfDaysToAdd = +noOfDaysToAdd + time_delay;

  if (startDate.getHours() >= 12 || holidayArray2023.includes(startDateFormat) || holidayArray2024.includes(startDateFormat)) {
    noOfDaysToAdd++;
  }

  while(count < noOfDaysToAdd){
    endDate = new Date(startDate.setDate(startDate.getDate() + 1));
    let endDateFormat = endDate.getDate() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getFullYear();

    if ((holidayArray2023.includes(endDateFormat) || holidayArray2024.includes(endDateFormat)) && endDate.getDay() != 0 && endDate.getDay() != 6) {
      noOfDaysToAdd++;
    }

    if(endDate.getDay() != 0 && endDate.getDay() != 6){
      count++;
    }
  }

  return endDate;
}

function formatDate(date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()];
}

function getCountryObject(country_code, countryArray) {
  var currentCountryObject = countryArray.filter(function (obj) {
    var object_country_code = obj['Country Code'].trim();
    return object_country_code == country_code;
  });

  return currentCountryObject;
}
