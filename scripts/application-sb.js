let spDetail = null;

const redAgMap = {
  "002001": "M",
  "002002": "N",
  "002003": "S",
  "002004": "s'",
  "002007": "Mia",
  "003001": "P1",
  "004002": "C",
  "004003": "E",
  "004004": "c'",
  "004005": "e",
  "006001": "K",
  "006002": "k'",
  "007001": "Lea",
  "007002": "Leb",
  "008001": "Fya",
  "008002": "Fyb",
  "009001": "Jka",
  "009002": "Jkb",
  "010001": "Dia"
};

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
            noteDiv.innerText = "...";

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

        loadOrderNote();

        // Stop observing once we've processed the update
        observer.disconnect();
    });

    // Start watching for changes to the table content
    observer.observe(resultBoxDiv, { childList: true, subtree: true });
}


/**
 * Load notes to note divs
 */
async function loadOrderNote() {
    if (!spDetail) {
        spDetail = await querySpBloodOrder();
    }

    const orderEle = document.querySelectorAll("#queryResultBox table tbody tr td:nth-child(2)");
    orderEle.forEach((ele) => {
        const orderNum = ele.getElementsByClassName("orderNum")[0].innerText;
        const noteDiv = ele.getElementsByClassName("note")[0];
        const result = spDetail.results.filter(order => order.spBldOrdNo === orderNum)[0];

        // rbcAgneg
        const rbcAg = [];
        for(i=1; i<11;i++) {
            const ag = result["rbcAgneg"+i];
            if (ag) {
                rbcAg.push(redAgMap[ag]);
            }
        };

        noteDiv.innerText = rbcAg.join(",")
    });
}