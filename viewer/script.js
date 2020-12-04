window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);

  const formId = urlParams.get('form');
  const submissionId = urlParams.get('submission');

  fetch(`/api/get-submission/${formId}/${submissionId}`)
    .then(response => response.json())
    .then(data => {
      let output = '';

      output += `<h1>${data.form.title}</h1>`;

      output += '<div class="component-list">';

      const hiddenComponents = [
        'button',
      ];

      output += data.form.components.map(item => {
        if (hiddenComponents.indexOf(item.type) !== -1 || item.tags.indexOf('pdfHidden') !== -1) {
          return '';
        }

        let label = item.label;
        let value = data.submission.data[item.key];

        switch (item.type) {
          case 'signature':
            value = `<img src="${value}">`;
            label = item.footer;
            break;

          case 'textarea':
            value = value.replace(/(?:\r\n|\r|\n)/g, '<br>');
            break;

          case 'datetime':
            //console.log(item);
            //let date = new Date(value);
            //value = date.getDay().toString().padStart(2, '0') + '.' + date.getMonth().toString().padStart(2, '0') + '.' + date.getFullYear() + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ' Uhr';
            value = moment(value).tz("Europe/Berlin").format('DD.MM.yyyy HH:mm') + ' Uhr';
        }

        return `<div class="component component--${item.type}">
                          <div class="component__label">${label}:</div>
                          <div class="component__value">${value}</div>
                      </div>`;
      }).join('');

      output += '</div>';

      document.querySelector('#form').innerHTML = output;
    });
};
