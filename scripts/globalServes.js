const queryBldSupOrdMList_api =
  getOrigin() + "/tbsf-api/bs/bldSupOrdMService/queryBldSupOrdMList";
const checkEDI_api = getOrigin() + "/tbsf-api/bs/bldSupOrdMService/checkEDI";
const downloadEDI_api =
  getOrigin() + "/tbsf-api/bs/bldSupOrdMService/downloadEDI";
const confirm_api = getOrigin() + "/tbsf-api/bs/bldSupOrdMService/confirm";
const checkToken_api = getOrigin() + "/tbsf-api/check_token";
const querySpBloodList_api = getOrigin() + "/tbsf-api/bs/specialbloodOrderMasterService/querySpecialBloodOrderList";
const querySpBloodOrderDetail_api =  getOrigin() + "/tbsf-api/bs/specialbloodOrderMasterService/querySpecialBloodOrderDetails";


// Server methods
/**
 * Gets the origin URL of the current page.
 * @returns {string} The origin URL.
 */
function getOrigin() {
  return document.location.origin;
}


/**
 * Checks if the access token stored in cookies is valid by sending a request to the server.
 * @returns {Promise<boolean>} A promise that resolves to true if the token is valid, false otherwise.
 */
async function isTokenValid() {
  response = await fetch(checkToken_api, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `access_token=${getToken()}`,
  });

  let data = await response.json();

  return data["statusCode"] == "1009";
}


/**
 * Retrieves the value of the 'hos_tk_id' token from the browser's cookies.
 * @returns {string|null} The value of the token if found, otherwise null.
 */
function getToken() {
  let cookies = document.cookie.split(";");
  for (let c of cookies) {
    c = c.trim();
    value = c.split("=");
    if (value[0] == "hos_tk_id") {
      return `${value[1]}`;
    }
  }
  return null;
}


/**
 * Queries the order information from the server.
 * @param {string} orderNumber - The order number to query.
 * @returns {Promise<any>} A promise that resolves to the order information.  
 */
async function queryOrder(orderNumber = "") {
  let payload = {
    bagNoType: 1,
    bldSupOrdNo: orderNumber,
    bldSupOrdShipDate: "",
    bldSupOrdStatus: "",
    iDisplayStart: 0,
    iDisplayLength: 10,
  };

  response = await fetch(queryBldSupOrdMList_api, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization: `bearer ${getToken()}`,
    },
    body: new URLSearchParams(payload).toString(),
  });

  let data = await response.json();
  return data["responseData"];
}


/**
 * Queries the special blood order information from the server.
 * @param {string} orderNumber - The order number to query.
 * @returns {Promise<any>} A promise that resolves to the special blood order information.
 */
async function querySpBloodOrder(orderNumber = "") {
  let payload = {
    bldSupOrdNo: orderNumber,
    spIsIrradiated:"",
    bldOrderDateStartInView:"",
    bldOrderDateEndInView:"",
    bldOrderStatus:"",
    iDisplayStart: 0,
    iDisplayLength:20,
    bldUserHistoryNo:"",
    spReqType:""
  };

  const response = await fetch(querySpBloodList_api, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization: `bearer ${getToken()}`,
    },
    body: new URLSearchParams(payload).toString(),
  });
  const data = await response.json();
  return data["responseData"];
}


/**
 * Query the details of a special blood order from the server.
 * @param {string} orderNumber 
 * @returns {Promise<any>} A promise that resolves to the details of special blood order.
 */
async function querySpOrderDetail(orderNumber) {
  const payload = {
    pk: orderNumber
  };

  const response = await fetch(querySpBloodOrderDetail_api, {
    method:"POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization: `bearer ${getToken()}`,
    },
    body: new URLSearchParams(payload).toString(),
  });

  const data = await response.json();
  return data['responseData'];
}

/**
 * Confirms a shipment on the server.
 * @param {string} orderNumber - The order number to confirm.
 * @returns {Promise<any>} A promise that resolves to the confirmation response.
 */
async function confirmShipment(orderNumber) {
  let payload = `pkAk=${orderNumber}`;

  response = await fetch(confirm_api, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization: `bearer ${getToken()}`,
    },
    body: payload,
  });
  let data = await response.json();
  return data;
}


/**
 * Checks if the EDI file for a given order number is valid.
 * @param {string} orderNumber - The order number to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the EDI file is valid, false otherwise.
 */
async function checkEDI(orderNumber) {
  let payload = {
    bldSupOrdNo: orderNumber,
  };

  response = await fetch(checkEDI_api, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization: `bearer ${getToken()}`,
    },
    body: new URLSearchParams(payload).toString(),
  });

  data = await response.json();
  return data["responseData"]["isCut"];
}


/**
 * Generates the download link for the EDI file for a given order number.
 * @param {string} orderNumber - The order number for which to generate the download link.
 * @returns {string} The download link for the EDI file.
 */
function getEdiLink(orderNumber) {
  let para = `?bldSupOrdNo=${orderNumber}&access_token=${getToken()}`;
  return `${downloadEDI_api}${para}`;
}
