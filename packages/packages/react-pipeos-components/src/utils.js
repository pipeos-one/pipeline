export const clipboardCopy = (text) => {
  const aux = document.createElement('input');
  aux.setAttribute('value', text);
  document.body.appendChild(aux);
  clipboardCopyElem(aux);
  document.body.removeChild(aux);
};

export const clipboardCopyElem = (element) => {
  element.select();
  document.execCommand('copy');
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export function pfunctionColorClass(gapi) {
  let colorClass = '';
  const constant = gapi.stateMutability === 'view' || gapi.stateMutability === 'pure';
  if (gapi.type === 'event') {
    colorClass = 'event';
  } else if (gapi.payable || gapi.stateMutability === 'payable') {
    colorClass = 'payable';
  } else if (gapi.constant || constant) {
    colorClass = 'constant';
  } else {
    colorClass = 'nonconstant';
  }
  return colorClass;
};

export const colorMap = {
  event: '#C9DEBB',
  payable: '#CDE0F2',
  nonconstant: '#E9DEDE',
  constant: 'rgb(240, 239, 245)',
};

export function pfunctionColor(gapi) {
  const colorClass = pfunctionColorClass(gapi);
  return colorMap[colorClass];
};
