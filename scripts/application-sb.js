window.addEventListener("load", async function() {
    if(await isExtensionOff()) return;

    buildPluginStatus();
    connectSubmitBtn();
});


function connectSubmitBtn() {
    document.getElementById("submit").addEventListener("click", () => {
        const resultBoxDiv = document.getElementById("queryResultBox");
        
        
        // Create an observer to watch for DOM changes inside #queryResultBox
        const observer = new MutationObserver((mutationsList, observer) => {
            // DOM has updated! Now grab the numbers:
            const orderEle = resultBoxDiv.querySelectorAll("table tbody tr td:nth-child(2)");
            orderEle.forEach((ele) => {
                console.log(ele);
            });
            

            // Stop observing once we've processed the update
            observer.disconnect();
        });

        // Start watching for changes to the table content
        observer.observe(resultBoxDiv, { childList: true, subtree: true });
    });

}