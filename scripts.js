// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let input;
  let results;
  function erase(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
  function el(type, text) {
    const element = document.createElement(type);
    if (text) {
      element.appendChild(document.createTextNode(text));
    }
    return element;
  }
  function showMessage(message) {
    erase(results);
    const elem = el('p', message);
    results.appendChild(elem);
  }
  function breyta(dagur) {
    const dags = new Date(dagur);
    const dag = dags.getDate();
    const man = parseInt(dags.getMonth()) + 1;  // eslint-disable-line
    const ar = dags.getFullYear();
    dagur = `${ar}-${man}-${dag}`;  // eslint-disable-line
    return dagur;
  }
  function birta(dataObj, listi, key) {
    const dlElement = document.createElement('dl');
    // console.log(key);
    if (key === 'registered') {
      dataObj[key] = breyta(dataObj[key]);  // eslint-disable-line
    }
    if (key === 'expires') {
      dataObj[key] = breyta(dataObj[key]);  // eslint-disable-line
    }
    if (key === 'lastChange') {
      dataObj[key] = breyta(dataObj[key]);  // eslint-disable-line
    }

    const dt = el('dt', listi[key]);
    const dd = el('dd', dataObj[key]);
    dlElement.appendChild(dt);
    dlElement.appendChild(dd);
    results.appendChild(dlElement);
  }
  function showResults(data) {
    erase(results);
    const dataObj = data[0];
    const translate = {
      domain: 'Lén',
      registrantname: 'Skráningaraðili',
      address: 'Heimilisfang',
      country: 'Land',
      email: 'Netfang',
      registered: 'Skráð',
      expires: 'Rennur út',
      lastChange: 'Seinast breytt',
    };
    const nytt = JSON.parse(JSON.stringify(translate, ['domain', 'registered', 'expires', 'lastChange'], 4));
    const auka = JSON.parse(JSON.stringify(translate, ['registrantname', 'email', 'address', 'country'], 4));
    for (const key in nytt) {  // eslint-disable-line
      birta(dataObj, nytt, key);
    }
    for (const key in auka) {  // eslint-disable-line
      if (dataObj[key]) {
        birta(dataObj, auka, key);
      }
    }
  }
  function fetchResults(side) {
    if (side === '') {
      showMessage('Lén verður að vera strengur');
    } else {
      fetch(`${API_URL}${side}`)  // eslint-disable-line
        .then((data) => {
          if (!data.ok) {
            showMessage('Villa við að sækja gögn');
            throw new Error('Non 200 status');
          }
          return data.json();
        })
        .then(data => showResults(data.results))
        .catch((error) => {  // eslint-disable-line
          showMessage('Lén er ekki skráð');
        });
    }
  }
  function showloading() {
    erase(results);
    const img = el('img');
    img.setAttribute('alt', 'loading gif');
    img.setAttribute('src', 'loading.gif');

    const imageDiv = el('div');
    imageDiv.classList.add('loading');
    imageDiv.appendChild(img);
    const loadtexti = document.createElement('p');
    loadtexti.appendChild(document.createTextNode('Leita að léni...'));
    imageDiv.appendChild(loadtexti);
    results.appendChild(imageDiv);
  }
  function onSubmit(e) {
    e.preventDefault();
    const side = input.value;
    showloading();
    fetchResults(side);
  }
  function init(domains) {
    const form = domains.querySelector('form');
    input = form.querySelector('input');
    results = domains.querySelector('.results');
    form.addEventListener('submit', onSubmit);
  }
  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
