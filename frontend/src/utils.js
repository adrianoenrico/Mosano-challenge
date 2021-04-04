function getAge(bday){
    // Age calculation:
    let ageDifMilli = Date.now() - new Date(bday).getTime();
    let ageDate = new Date(ageDifMilli);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}


export { getAge }