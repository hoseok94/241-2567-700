function submitData(){
    let firstNameDOM = document.querySelector('input[name ="firstName"]');
    let lastNameDOM = document.querySelector('input[name ="lastName"]');
    let ageDOM = document.querySelector('input[name ="age"]');
    let genderDOM = document.querySelector('input[name = "gender"]');
    let interestDOM = document.querySelectorAll('input[name = "interest"]');
    let descriptionDOM = document.querySelector('textarea[name = "description"]');

    let interest = '';
    for (let i = 0; i < interestDOM.length; i++){
        interest += interestDOM[i].value;
        if (i != interestDOM.length - 1){
            interest += ',';
        }
    }
    let userData = {
        firstName: firstNameDOM.value,
        lastName: lastNameDOM.value,
        age: ageDOM.value,
        gender: genderDOM.value,
        description: descriptionDOM.value,
        interest: interest
    }
    console.log('submitData',userData);
}