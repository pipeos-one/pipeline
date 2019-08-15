export function pfunctionColorClass(gapi) {
  let colorClass = '';
  if (gapi.type === 'event') {
    colorClass = 'event';
  } else if (gapi.payable) {
    colorClass = 'payable';
  } else if (!gapi.constant) {
    colorClass = 'nonconstant';
  }
  return colorClass;
};
