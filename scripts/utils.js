// Modify UI events

/**
 * Builds the plugin status indicator and appends it to the document body. 
 * The status indicator displays a message indicating that the Blood Order Genius plugin is working. 
 * Clicking on the status indicator will hide it temporarily.
 */
function buildPluginStatus() {
  const statusDiv = document.createElement("div");
  statusDiv.setAttribute("id", "plugin_status");
  statusDiv.innerHTML = "<label>☺ 血庫小精靈工作中....</label>";
  document.body.appendChild(statusDiv);

  statusDiv.addEventListener("click", () => hideStatus());
}


/**
 * Hides the plugin status indicator temporarily. 
 * The status indicator will reappear after 1 second.
 */
function hideStatus() {
  const statusDiv = document.getElementById("plugin_status");
  statusDiv.className = "hide";
  setTimeout(() => {
    statusDiv.className = "";
  }, 1000);
}


// quick phrases
/**
 * Builds the quick notes section with a dropdown for quick phrases and a date picker.
 * @param {HTMLTextAreaElement} textarea - The textarea element to append the quick notes to.
 */
async function buildQuickNotes(textarea) {
  const btnBar = document.createElement("div");
  btnBar.className = "dropbtn-bar";

  // create quick phrases dropdown button
  let dropdownDiv = document.createElement('div');
  dropdownDiv.className = "dropdown";
  
  let dropdownBtn = document.createElement('a');
  dropdownBtn.className = 'btn-del dropbtn';
  dropdownBtn.innerText = '快速輸入';

  let dropdownContent = document.createElement("div");
  dropdownContent.className = "dropdown-content";

  for(let ele of await createPhraseElements()) {
    ele.addEventListener("click", e =>{
      textarea.value += e.target.innerText + " ";
      textarea.focus();
    })
    dropdownContent.appendChild(ele);
  }

  dropdownDiv.appendChild(dropdownBtn);
  dropdownDiv.appendChild(dropdownContent);

  btnBar.appendChild(dropdownDiv);

  // create date picker button
  const datepickerDiv = document.createElement('div');
  datepickerDiv.className = "dropdown";

  const datePickerBtn = document.createElement('a');
  datePickerBtn.className = "btn-del dropbtn";
  datePickerBtn.setAttribute("id", "datepicker-btn");
  datePickerBtn.innerText = "輸入日期";

  const calendarDiv = document.createElement('div');
  calendarDiv.setAttribute("id", "calendar");
  calendarDiv.className = "calendar";

  datepickerDiv.appendChild(datePickerBtn);
  datepickerDiv.appendChild(calendarDiv);
  btnBar.appendChild(datepickerDiv);


  // show dropdown menu bar
  textarea.parentNode.appendChild(btnBar);

  // jquery should be loaded after the element is created, otherwise it will not work
  $("#calendar").hide();

  $("#calendar").datepicker({
    dateFormat: "mm/dd(DD)",
    changeYear: true,
    changeMonth: true,
    dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
    dayNames: ["日", "一", "二", "三", "四", "五", "六"],
    minDate: new Date(),
    onSelect: function(dateText) {
      textarea.value += " " + dateText;
    }
  });

  $("#datepicker-btn").on("mouseenter", function() {
    $("#calendar").show();
  });

  $("#calendar").on("mouseleave", function() {
    $("#calendar").hide();
  });

  document.addEventListener("click", function(event) {
    if (!datepickerDiv.contains(event.target)) {
      $("#calendar").hide();
    }
  });
}


/**
 * Creates the HTML elements for the quick phrases dropdown.
 * @returns {Promise<Array>} A promise that resolves to an array of HTML anchor elements.
 */
async function createPhraseElements() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate()+1);

  let phrases = [
    `今天(${formatSimpleDate(today)})`,
    `明天(${formatSimpleDate(tomorrow)})`,
  ];

  phrases.push(...await loadQuickPhrases());

  let phraseElements = Array();
  for(let p of phrases) {
    let element = document.createElement('a');
    element.innerText = p;
    phraseElements.push(element);
  }

  return phraseElements;
}


/**
 * Loads the quick phrases from Chrome's synchronized storage.
 * @returns {Promise<Array>} A promise that resolves to an array of quick phrases.
 */
async function loadQuickPhrases() {
  let data = await chrome.storage.sync.get(['quick_phrases']);
  return data["quick_phrases"];
}


/**
 * Updates the quick phrases in Chrome's synchronized storage.
 * @param {object} data 
 */
async function updateQuickPhrases(data) {
  await chrome.storage.sync.set({['quick_phrases']: data});
}


// Other
/**
 * Pauses execution for a specified number of milliseconds.
 * @param {number} s - The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 */
function sleep(s) {
  return new Promise((resolve) => {
    setTimeout(resolve, s);
  });
}


/**
 * Checks if the extension is deactivated by retrieving the "deactivate" value from Chrome's synchronized storage.
 * @returns {Promise<boolean>} A promise that resolves to true if the extension is deactivated, false otherwise.
 */
async function isExtensionOff() {
  let data = await chrome.storage.sync.get(["deactivate"]);
  return data["deactivate"];
}


/**
 * Formats a date object into a datetime string.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted datetime string.
 */
function formatDateTime(date) {
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let day = date.getDate();
  let h = `0${date.getHours()}`.slice(-2);
  let m = `0${date.getMinutes()}`.slice(-2);
  return `${year}/${month}/${day} ${h}:${m}`;
}

/**
 * Formats a date object into a simple date string.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
function formatSimpleDate(date) {
  let month = date.getMonth()+1;
  let day = date.getDate();
  return `${month}/${day}`;
}

/**
 * Builds the inventory section of the plugin, including the legend, source link, and inventory data.
 * @returns {HTMLElement} The constructed inventory section as a fieldset element.
 */
function buildInventory() {
    // build inventory section
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'fieldsetStyle1';
    fieldset.appendChild(document.createElement('legend')).innerText = '庫存資訊';

    // build figure legned
    const figLegend = document.createElement('div');
    figLegend.className = 'legend';
    figLegend.innerHTML = `
        <div class="legend-item status-Normal"><span class="indicator status-Normal"></span> 正常 (>7 Days)</div>
        <div class="legend-item status-Low"><span class="indicator status-Low"></span> 偏低 (4-7 Days)</div>
        <div class="legend-item status-Urgent"><span class="indicator status-Urgent"></span> 急缺 (<4 Days)</div>`;

    // build source link
    const sourceLink = document.createElement('div');
    sourceLink.className = 'source-link';
    sourceLink.innerHTML = `<a href="https://www.blood.org.tw/" target="_blank">資料來源: 血液基金會</a>`;
    const updateTime = document.createElement('div');
    updateTime.className = 'update-time';
    updateTime.innerText = '更新時間: 請稍候...';
    

    // build inventory data
    const inventoryContainer = document.createElement('div');
    inventoryContainer.id = 'inventory-container';
    inventoryContainer.innerHTML = `<div class="loading-spinner">載入中...</div>`;

    const centerNames = ['台北捐血中心', '新竹捐血中心', '台中捐血中心', '高雄捐血中心'];
    const bloodTypes = ['A','B','O','AB'];
    const stockLevels = {
        '偏低': 'status-Low',
        '正常': 'status-Normal',
        '急缺': 'status-Urgent'
    };

    getInventoryData().then(data => {
        inventoryContainer.innerHTML = '';
        centerNames.forEach(center => {
            const centerDiv = document.createElement('div');
            centerDiv.className = 'center-card';
            centerDiv.innerHTML = `<div class="center-name">${center}</div>`;
            inventoryContainer.appendChild(centerDiv);

            const bloodGrid = document.createElement('div');
            bloodGrid.className = 'blood-grid';
            centerDiv.appendChild(bloodGrid);

            bloodTypes.forEach(bt => {
                const bloodTypeDiv = document.createElement('div');
                bloodTypeDiv.className = `blood-type`;
                bloodTypeDiv.textContent = bt;
                bloodTypeDiv.title = data.content[center][bt] || '未知';
                bloodTypeDiv.classList.add(stockLevels[data.content[center][bt]] || 'status-Unknown');
                bloodGrid.appendChild(bloodTypeDiv);
            });
            inventoryContainer.appendChild(centerDiv);
        });
        updateTime.innerText = `${data.date}`;
    }).catch(error => {
        console.error('Error fetching inventory data:', error);
        inventoryContainer.innerHTML = `<div class="error-message">無法載入庫存資訊，請稍後再試。</div>`;
    });
    

    fieldset.appendChild(inventoryContainer);
    fieldset.appendChild(figLegend);
    fieldset.appendChild(sourceLink);
    sourceLink.appendChild(updateTime);

    return fieldset;
}

/**
 * Parse the inventory data from the blood website and return it as an object.
 * @returns {Promise<Object>} The parsed inventory data.
 * @throws Will throw an error if the HTML structure is not as expected.
 */
async function getInventoryData() {
    const response = await chrome.runtime.sendMessage({ type: "FETCH_INVENTORY" });

    if (!response.ok) {
        throw new Error(`Failed to fetch inventory data. ${response.error}`);
    }

    const data = {};


    //parse HTML
    const htmlText = response.htmlText;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const inventoryGroup = doc.querySelector('.InventoryGroup');
    if (!inventoryGroup) {
        throw new Error('Could not find inventory data on the page.');
    }

    // Extract Date
    data.date = inventoryGroup.querySelector('.date')?.textContent.trim() || 'Unknown';

    // Extract Centers, blood types, and stock
    const content = {};
    const inventoryList = inventoryGroup.querySelector('.InventoryList');
    const centerItems = inventoryList.querySelectorAll('.item');

    centerItems.forEach(item => {
        const centerName = item.querySelector('.titleBar a')?.textContent.trim() || 'Unknown';
        content[centerName] = {};
        
        const bloodTypeList = item.querySelectorAll('li');

        bloodTypeList.forEach(bt => {
            const bloodtype = bt.querySelector('.text').textContent.trim() || '?';
            const stock = bt.querySelector('.icon img').getAttribute('alt') || '??';
            content[centerName][bloodtype] = stock;
        })
    });

    data.content = content;
    return data;
}