let spDetail = null;

window.addEventListener("load", async function() {
    if(await isExtensionOff()) return;

    buildPluginStatus();
    connectSubmitBtn();
});


function connectSubmitBtn() {
    document.getElementById('submit').addEventListener("click", () => {
        buildNoteDivs();
    });
}


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

            const agDiv = document.createElement("div");
            agDiv.className = 'antigen';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'pt-name';

            const productDiv = document.createElement("div");
            productDiv.className = 'product';

            noteDiv.appendChild(agDiv);
            noteDiv.append(nameDiv);
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

        loadOrderDetails();
        loadProductQuantity();

        // Stop observing once we've processed the update
        observer.disconnect();
    });

    // Start watching for changes to the table content
    observer.observe(resultBoxDiv, { childList: true, subtree: true });
}


/**
 * Loading antigen, patient name and remark of special orders to note divs
 */
async function loadOrderDetails() {
    if (!spDetail) {
        spDetail = await querySpBloodOrder();
    }

    const orderEle = document.querySelectorAll("#queryResultBox table tbody tr td:nth-child(2)");
    orderEle.forEach((ele) => {
        const orderNum = ele.getElementsByClassName("orderNum")[0].innerText;
        const agDiv = ele.querySelector(".note .antigen");
        const result = spDetail.results.filter(order => order.spBldOrdNo === orderNum)[0];
        const nameDiv = ele.querySelector(".note .pt-name");

        queryPatientsDetails(result.bldUserSeqNo).then(pt => {
            nameDiv.innerText = pt.bldUserName;
        });

        let tooltip ="無";
        if (result['bldOrdRemark']) {
            tooltip = result['bldOrdRemark'];
        }

        ele.setAttribute("title", tooltip);

        // rbcAgneg
        const rbcAg = [];
        for(i=1; i<11;i++) {
            const ag = result["rbcAgneg"+i];
            if (ag) {
                rbcAg.push(redAgMap[ag]);
            }
        };

        //hla
        const hlaA = [];
        const hlaB = [];

        for(i=1;i<3;i++) {
            const aAg = result['spReqHlaA'+i];
            const bAg = result['spReqHlaB'+i];

            if(aAg) {hlaA.push("A"+aAg)};
            if(bAg) {hlaB.push("B"+bAg)};
        }

        let notes = rbcAg.join(",") + " " + hlaA.join(",") + " " + hlaB.join(",");
        agDiv.innerText = notes.trim();
    });
}


/**
 * Loading the product and quantity of special blood orders to note divs
 */
async function loadProductQuantity() {
    const orderEle = document.querySelectorAll("#queryResultBox table tbody tr td:nth-child(2)");
    orderEle.forEach((ele) => {
        const orderNum = ele.getElementsByClassName("orderNum")[0].innerText;
        const productDiv = ele.querySelector(".note .product");

        querySpOrderDetail(orderNum).then(data => {
            let note = `${bloodProductsMap[data[0].bldItemNo]}(${data[0].bldOrderQty})`;
            productDiv.innerText = note.trim();
        });
    });
}