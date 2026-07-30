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

    // build source link

    // build inventory data

    return fieldset;
}

/**
 * Parse the inventory data from the blood website and return it as an object.
 * @returns {Promise<Object>} The parsed inventory data.
 * @throws Will throw an error if the HTML structure is not as expected.
 */
async function get_inventory_data() {
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