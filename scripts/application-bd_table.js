window.addEventListener("load", async function() {
    if(await isExtensionOff()) return;
    buildPluginStatus();

    // connect submit button
    document.getElementById('submit').addEventListener("click", () => {
        buildNoteDivs();
    });
    
});


/**
 *  Build note divs below the order number
 */
function buildNoteDivs() {
    const resultBoxDiv = document.getElementById("queryResultBox");
        
    // Create an observer to watch for DOM changes inside #queryResultBox
    const observer = new MutationObserver((mutationsList, observer) => {
        // DOM has updated! Now grab the order number elements:
        const orderEle = resultBoxDiv.querySelectorAll("table tbody tr td:nth-child(2)");
        orderEle.forEach((ele) => {
            const orderDiv = document.createElement("div");
            orderDiv.className = "orderNum"
            orderDiv.innerText = ele.innerText;

            const noteDiv = document.createElement("div");
            noteDiv.className = "note";

            const productDiv = document.createElement("div");
            productDiv.className = 'product';

            noteDiv.appendChild(productDiv);

            ele.innerHTML = "";
            ele.appendChild(orderDiv);
            ele.appendChild(noteDiv);
        });

        // add event to pager div
        const pagerDiv = document.getElementsByClassName("pager")[0];
        const pagerBtn = pagerDiv.querySelectorAll("li");

        pagerBtn.forEach((btn) => {
            btn.addEventListener("click", () => {
                buildNoteDivs();
            });
        });

        loadProductQuantity();

        // Stop observing once we've processed the update
        observer.disconnect();
    });

    // Start watching for changes to the table content
    observer.observe(resultBoxDiv, { childList: true, subtree: true });
}


async function loadProductQuantity() {
    const orderEle = document.querySelectorAll("#queryResultBox table tbody tr td:nth-child(2)");
    orderEle.forEach((ele) => {
        const orderNum = ele.getElementsByClassName("orderNum")[0].innerText;
        const productDiv = ele.querySelector(".note .product");

        queryOrderDetail(orderNum).then(data => {

            const grouped = data.reduce((acc, item) => {
                const itemNo = item.bldItemNo;
                const detail = `${item.bldTypeAbo}${rhMap[item.bldRHTyp]}(${item.bldOrdQty})`;

                if (!acc[itemNo]) {
                    acc[itemNo] = [];
                }
                acc[itemNo].push(detail);

                return acc;
            }, {});

            const result = Object.entries(grouped)
                .map(([itemNo, details]) => `${bloodProductsMap[itemNo]}: ${details.join(' ')}`)
                .join('\n');

            productDiv.innerText = result;
        });
    });
}