"use strict";
window.addEventListener("DOMContentLoaded", start);

let bookingInfo = {
    jagtperiode: "",
    jaegere: "",
    ledsagere: "",
    fuldenavn: "",
    email: "",
    telefon: "",
    besked: "",
    total_pris: ""
}

let nyBookingInfo;
let customerForm;

function start() {

    customerForm = document.querySelector("#booking_jagt_form");
    //creating new booking object
    nyBookingInfo = Object.create(bookingInfo);
    //calling my eventhandler


    eventhandler();

    function eventhandler() {
        //calling function for showing the cart
        showCart();

        //eventlisteners for input fields that effect the cart display
        const jagtperiodeselect = customerForm.elements.valgjagt;
        const jaegereinput = customerForm.elements.jaegere;
        const ledsagerinput = customerForm.elements.ledsagere;

        jagtperiodeselect.addEventListener('input', updateCustomerOrder);
        jaegereinput.addEventListener('input', updateCustomerOrder);
        ledsagerinput.addEventListener('input', updateCustomerOrder);

        // eventlistener for eror messages to all fields upon input
        errorMessages();


        //here i add click eventlistener, if form is valid it prevents default submit, and calls proceed to cart
        //its to make sure that form is still checked for validity, and only prevents default (refresh) once everything IS valid
        document.querySelector(".send_btn").addEventListener("click", function (event) {
            console.log("submit clicked");
            if (customerForm.checkValidity()) {

                event.preventDefault();
                saveCustomerOrder();

            } else {
                console.log("not valid yet");
            }
        });
    }

}


function errorMessages() {
   const ledsagerinput = customerForm.elements.ledsagere;
   const jaegereinput = customerForm.elements.jaegere;


   //så bare kopier dette format hvert input felt
   jaegereinput.addEventListener('input', () => {

    //Error message for jægere input
    const jaegereinput = customerForm.elements.jaegere.value;

    if (jaegereinput == 0) {
        document.getElementById("subTextUnderJagtTo").style.display = "block";
    } else if (jaegereinput > 16) {
        document.getElementById("subTextUnderJagt").style.display = "block";
    } else {
        document.getElementById("subTextUnderJagtTo").style.display = "none";
        document.getElementById("subTextUnderJagt").style.display = "none";
    }
     }); 

     ledsagerinput.addEventListener('input', () => {

        //Error message for jægere input
        const ledsagerinput = customerForm.elements.ledsagere.value;
    
        if (ledsagerinput > 6 ) {
            document.getElementById("ledsagerError").style.display = "block";
        } else {
            document.getElementById("ledsagerError").style.display = "none";
        }

         });

}



//updating the booking object based on the latest input from the user
function updateCustomerOrder() {
    console.log("updating the order");
    let t = document.getElementById('valgjagt_periode');
    let jagtperiodeText = t.options[t.selectedIndex].text;
    //only saving the values into the booking object if the input is valid
    if (customerForm.elements.jaegere.checkValidity()) {
        nyBookingInfo.antalJaegere = customerForm.elements.jaegere.value;

    }
    if (customerForm.elements.valgjagt.checkValidity()) {
        nyBookingInfo.jagtperiode = jagtperiodeText;

    }
    if (customerForm.elements.ledsagere.checkValidity()) {
        nyBookingInfo.antalLedsagere = customerForm.elements.ledsagere.value;

    }

    //calling update cart
    updateCart();
}

//calculating the base prise of the jagt
function jagtPrisen() {
    const prisJagtTo = 1890;
    const prisJagtTre = 2380;
    let jagtpris;


    //udregner jagtpris 
    if (nyBookingInfo.jagtperiode == 4) {
        jagtpris = prisJagtTo;
    } else {
        jagtpris = prisJagtTre;

    }

    return (jagtpris);

}

//showing the cart, this happens before input, so it only shows the initial base price.
function showCart() {

    const template = document.getElementById('cart');
    const clone = template.content.cloneNode(true);

    console.log("show cart");

    //udregner jagtpris
    const prisJagtTo = 1890;
    const prisJagtTre = 2380;
    let jagtpris = jagtPrisen();

    const jagtPeriode = nyBookingInfo.jagtperiode;

    if (jagtPeriode === 4) {
        jagtpris = prisJagtTo;
    } else {
        jagtpris = prisJagtTre;
    }

    //displaying the basis jagtpris

    clone.querySelector("[data-field=cart_jagt_periode_pris]").textContent = "€" + jagtpris + " pr. Jæger";

    document.querySelector("#cart_table").appendChild(clone);

}


//updating the cart display based on the updated information
function updateCart() {

    //Here we get the value from the select and are only getting the text string from the options instead of the value
    let t = document.getElementById('valgjagt_periode');
    let jagtperiodeText = t.options[t.selectedIndex].text;


    const antalJaegere = nyBookingInfo.antalJaegere;
    const antalLedsagere = nyBookingInfo.antalLedsagere;
    let jagtpris = jagtPrisen();
    let jagt_total_pris = jagtpris * antalJaegere;

    nyBookingInfo.total_pris = jagt_total_pris;

    console.log(nyBookingInfo);

    // Update the cart with the latest information
    const cart = document.querySelector("#cart_table");
    cart.querySelector("[data-field=cart_jagt_periode_pris]").textContent = "€" + jagtpris + " pr. Jæger";
    cart.querySelector("[data-field=cart_jagt_periode]").textContent = jagtperiodeText;

    cart.querySelector("[data-field=cart_jaegere_antal]").textContent = antalJaegere;
    cart.querySelector("[data-field=cart_ledsagere_antal]").textContent = antalLedsagere;

// Check for validity before dispalying price
    if (customerForm.elements.jaegere.checkValidity()) {
        cart.querySelector("[data-field=cart_total_pris]").textContent = "for " + antalJaegere + " jægere er " + "€" + nyBookingInfo.total_pris;
    }else{
        cart.querySelector("[data-field=cart_total_pris]").textContent = " ";
    }
}

//saves all the information form the forms inputs (that has not already been saved at ) into the booking object
//this function can only be called when the form is valid
// the first 3 elements (jagtperiode, jægere, ledsagere) have already been saved earlier at updateCustomerOrder
function saveCustomerOrder() {
    console.log("save_customer_order function");
    customerForm = document.querySelector("#booking_jagt_form");

    let fuldeNavn = customerForm.elements.fornavn.value + "  " + customerForm.elements.efternavn.value;
    let email = customerForm.elements.mail.value;
    let telefon = customerForm.elements.phone.value;
    let dinBesked = customerForm.elements.besked.value;

    //combining all of the new the information into the new booking object
    nyBookingInfo.fuldeNavn = fuldeNavn;
    nyBookingInfo.email = email;
    nyBookingInfo.telefon = telefon;
    nyBookingInfo.dinBesked = dinBesked;



    console.log(customerForm.checkValidity());
    if (customerForm.checkValidity()) {
        console.log("woohoo order confirmed yo");
        console.log(nyBookingInfo);

    } else {
        console.log("naaah");
    }

}