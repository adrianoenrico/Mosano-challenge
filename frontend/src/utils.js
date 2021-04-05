/* eslint-disable import/prefer-default-export */
function getAge(bday) {
  // Age calculation:
  const ageDifMilli = Date.now() - new Date(bday).getTime();
  const ageDate = new Date(ageDifMilli);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export { getAge };
