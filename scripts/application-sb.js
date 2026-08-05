window.addEventListener("load", async function() {
    if(await isExtensionOff()) return;

    buildPluginStatus();
    connectSubmitBtn();
});


function connectSubmitBtn() {
    document.getElementById("submit").addEventListener("click", () => {
        console.log("clicked");
        
        const parentDiv = document.getElementById("queryResultBox");
        const orderEle = parentDiv.querySelectorAll("table tbody tr td:nth-child(2)");

        orderEle.forEach((ele) => {
            console.log(ele);
        });
    });

}