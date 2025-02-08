console.log("Hello Kiddo");

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".header-right").style.visibility="visible";
    document.querySelector(".header-right").style.zIndex="100";
    document.querySelector(".close").style.visibility ="visible";
    // document.querySelector(".header-right").style.left = "53%";
});

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".header-right").style.visibility="hidden";
    document.querySelector(".header-right").style.zIndex="-100";
});

// document.querySelector(".container").addEventListener("click", () => {
//     document.querySelector(".header-right").style.visibility="hidden";
//     document.querySelector(".header-right").style.zIndex="-100";   
// });

let string = ""; 

let numbers = document.querySelectorAll(".number");

Array.from(numbers).forEach((number) => {
    number.addEventListener("click", (e) => {
        if (e.target.innerHTML == "=") {
            string = eval(string); 
            document.querySelector("input").value = string;
        }
        else if(e.target.innerHTML == 'Clear'){
            string = ''
            document.querySelector("input").value = string;
        }
         else {
            console.log(e.target);
            string = string + e.target.innerHTML;
            document.querySelector("input").value = string;
        }
    });
});
