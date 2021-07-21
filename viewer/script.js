window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);

  const formId = urlParams.get('form');
  const submissionId = urlParams.get('submission');

  fetch(`/api/get-submission/${formId}/${submissionId}`)
    .then(response => response.json())
    .then(data => {
  //     var data = {
  //       form: JSON.parse(`{"_id":"601a95d513c0ecfe1fe455ac","type":"form","tags":["common","prockappdev","signing"],"owner":"5fb3d73170a2f9bc828686a4","components":[{"autofocus":false,"input":true,"tableView":false,"label":"Gespeichert am","key":"created","placeholder":"","format":"dd.MM.yyyy hh:mm a","enableDate":true,"enableTime":true,"defaultDate":"","datepickerMode":"day","datePicker":{"showWeeks":true,"startingDay":0,"initDate":"","minMode":"day","maxMode":"year","yearRows":4,"yearColumns":5,"minDate":null,"maxDate":null,"datepickerMode":"day"},"timePicker":{"hourStep":1,"minuteStep":1,"showMeridian":true,"readonlyInput":false,"mousewheel":true,"arrowkeys":true},"protected":false,"persistent":true,"hidden":true,"clearOnHide":false,"validate":{"required":false,"custom":""},"type":"datetime","labelPosition":"top","tags":["pdfHidden"],"conditional":{"show":"","when":null,"eq":""},"properties":{},"lockKey":true,"useLocaleSettings":false},{"autofocus":false,"input":true,"tableView":true,"label":"Leistungsdatum","key":"leistungsdatum","placeholder":"","format":"dd.MM.yyyy a","enableDate":true,"enableTime":true,"defaultDate":"moment()","datepickerMode":"day","datePicker":{"showWeeks":true,"startingDay":0,"initDate":"","minMode":"day","maxMode":"year","yearRows":4,"yearColumns":5,"minDate":null,"maxDate":null,"datepickerMode":"day"},"timePicker":{"hourStep":1,"minuteStep":1,"showMeridian":true,"readonlyInput":false,"mousewheel":true,"arrowkeys":true},"protected":false,"persistent":true,"hidden":false,"clearOnHide":true,"validate":{"required":false,"custom":""},"type":"datetime","labelPosition":"top","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}},{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"Auftraggeber","key":"auftraggeber","placeholder":"","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","labelPosition":"top","inputFormat":"plain","tags":[],"properties":{}},{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"Arbeitsstätte","key":"arbeitsstaette","placeholder":"","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","labelPosition":"top","inputFormat":"plain","tags":[],"properties":{},"lockKey":true},{"autofocus":false,"input":true,"tableView":true,"inputType":"number","label":"Nummer","key":"nummer","placeholder":"","prefix":"","suffix":"","defaultValue":"","protected":false,"persistent":true,"hidden":false,"clearOnHide":true,"validate":{"required":false,"min":"","max":"","step":"any","integer":"","multiple":"","custom":""},"type":"number","labelPosition":"top","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}},{"autofocus":false,"input":true,"tableView":false,"label":"Bericht","key":"bericht","placeholder":"","prefix":"","suffix":"","rows":10,"multiple":false,"defaultValue":"","protected":false,"persistent":true,"hidden":false,"wysiwyg":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":""},"type":"textarea","labelPosition":"top","inputFormat":"plain","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}},{"autofocus":false,"input":true,"tree":true,"components":[{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"Facharbeiter","key":"arbeitszeitFacharbeiter","placeholder":"Max Mustermann","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":true,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","inDataGrid":true,"labelPosition":"top","inputFormat":"plain","tags":[],"properties":{}},{"autofocus":false,"input":true,"tableView":true,"inputType":"number","label":"Stunden","key":"arbeitszeitStunden","placeholder":"","prefix":"","suffix":"","defaultValue":"","protected":false,"persistent":true,"hidden":false,"clearOnHide":true,"validate":{"required":true,"min":0,"max":"","step":"any","integer":"","multiple":"","custom":""},"type":"number","inDataGrid":true,"labelPosition":"top","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{},"decimalLimit":2}],"tableView":false,"label":"Arbeitszeit","key":"arbeitszeit","protected":false,"persistent":true,"hidden":false,"clearOnHide":true,"type":"datagrid","addAnotherPosition":"bottom","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}},{"input":true,"tableView":false,"label":"Signature","key":"signature2","placeholder":"","footer":"Unterschrift Auftragnehmer","width":"100%","height":"150px","penColor":"black","backgroundColor":"rgb(245,245,235)","minWidth":"0.5","maxWidth":"2.5","protected":false,"persistent":true,"hidden":false,"clearOnHide":true,"validate":{"required":false},"type":"signature","hideLabel":true,"tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}},{"autofocus":false,"input":true,"tableView":false,"label":"Unterschrieben am","key":"signingDate","placeholder":"","format":"yyyy-MM-dd hh:mm a","enableDate":true,"enableTime":true,"defaultDate":"","datepickerMode":"day","datePicker":{"showWeeks":true,"startingDay":0,"initDate":"","minMode":"day","maxMode":"year","yearRows":4,"yearColumns":5,"minDate":null,"maxDate":null,"datepickerMode":"day"},"timePicker":{"hourStep":1,"minuteStep":1,"showMeridian":true,"readonlyInput":false,"mousewheel":true,"arrowkeys":true},"protected":false,"persistent":true,"hidden":true,"clearOnHide":false,"validate":{"required":false,"custom":""},"type":"datetime","labelPosition":"top","tags":["signing"],"conditional":{"show":"","when":null,"eq":""},"properties":{},"lockKey":true},{"input":true,"tableView":false,"label":"Signature","key":"signature","placeholder":"","footer":"Unterschrift Auftraggeber","width":"100%","height":"150px","penColor":"black","backgroundColor":"rgb(245,245,235)","minWidth":"0.5","maxWidth":"2.5","protected":false,"persistent":true,"hidden":false,"clearOnHide":true,"validate":{"required":false},"type":"signature","hideLabel":true,"tags":["signing"],"conditional":{"show":"","when":null,"eq":""},"properties":{}},{"autofocus":false,"input":true,"inputType":"checkbox","tableView":true,"label":"Unterschrieben","dataGridLabel":false,"key":"signed","defaultValue":false,"protected":false,"persistent":true,"hidden":true,"name":"","value":"","clearOnHide":false,"validate":{"required":false},"type":"checkbox","labelPosition":"right","tags":["pdfHidden"],"conditional":{"show":"","when":null,"eq":""},"properties":{},"hideLabel":false},{"autofocus":false,"input":true,"label":"Speichern","tableView":false,"key":"submit","size":"md","leftIcon":"","rightIcon":"","block":false,"action":"submit","disableOnInvalid":false,"theme":"primary","type":"button","tags":["pdfHidden"],"conditional":{"show":"","when":null,"eq":""},"properties":{}}],"display":"form","submissionAccess":[{"roles":["5fb3d73070a2f93418868697"],"type":"create_own"},{"roles":["5fb3d73070a2f93418868697"],"type":"read_own"},{"roles":["5fb3d73070a2f93418868697"],"type":"update_own"},{"roles":["5fb3d73070a2f93418868697"],"type":"delete_own"}],"title":"Regiebericht DEV","name":"regieberichtDev","path":"regiebericht-dev","access":[{"roles":["5fb3d73070a2f910e8868696","5fb3d73070a2f93418868697","5fb3d73070a2f92c84868698"],"type":"read_all"}],"created":"2021-02-03T12:23:49.689Z","modified":"2021-02-03T22:12:45.430Z","machineName":"regieberichtDev"}`),
  //       submission: JSON.parse(`{
  //       "_id": "601d8dd013c0ecec33e455cf",
  //       "owner": "5fb414daeae72d66e042e7b6",
  //       "roles": [],
  //       "data": {
  //           "created": "2021-02-05T18:26:14.000Z",
  //           "leistungsdatum": "2021-02-05T18:24:42.000Z",
  //           "auftraggeber": "Max Mustermann",
  //           "arbeitsstaette": "Musterstr. 1",
  //           "nummer": 50,
  //           "bericht": "- Tafeln abmontiert\\n- Löcher verspachtelt\\n- Dinge getan\\n- andere Dinge getan",
  //           "arbeitszeit": [
  //               {
  //                   "arbeitszeitFacharbeiter": "Max Mustermann",
  //                   "arbeitszeitStunden": 5
  //               },
  //               {
  //                   "arbeitszeitFacharbeiter": "Erika Mustermann",
  //                   "arbeitszeitStunden": 2
  //               },
  //               {
  //                   "arbeitszeitFacharbeiter": "Jonas Mustermann-Schnarrenberger",
  //                   "arbeitszeitStunden": 10
  //               }
  //           ],
  //           "signature2": "YES",
  //           "signingDate": "2021-02-05T18:26:22.000Z",
  //           "signature": "YES",
  //           "signed": true
  //       },
  //       "access": [],
  //       "metadata": {
  //           "timezone": "Europe/Berlin",
  //           "offset": 60,
  //           "origin": "http://localhost:3200",
  //           "referrer": "http://localhost:3200/form/regiebericht-dev",
  //           "browserName": "Netscape",
  //           "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36",
  //           "pathName": "/form/regiebericht-dev/create",
  //           "onLine": true
  //       },
  //       "form": "601a95d513c0ecfe1fe455ac",
  //       "externalIds": [],
  //       "created": "2021-02-05T18:26:24.884Z",
  //       "modified": "2021-02-05T18:26:24.885Z"
  //   }`),
  //     }


      let output = '';

      output += `<h1>${data.form.title}</h1>`;

      output += '<div class="component-list">';

      const hiddenComponents = [
        'button',
      ];

      output += data.form.components.map(item => {
        if (hiddenComponents.indexOf(item.type) !== -1 || item.hasOwnProperty('tags') && item.tags.indexOf('pdfHidden') !== -1) {
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
            value = moment(value).tz("Europe/Berlin").format('DD.MM.yyyy HH:mm') + ' Uhr';
            break;

          case 'datagrid':
            let headers = '';

            item.components.forEach(component => {
              headers += `<th>${component.label}</th>`;
            });

            let rows = '';

            value.forEach(val => {
              let cells = '';

              item.components.forEach(component => {
                cells += `<td>${val[component.key]}</td>`
              });

              rows += `<tr>${cells}</tr>`;
            });


            value = `<table class="datagrid">
              <thead>
                <tr>${headers}</tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>`;

            break;

          case 'aufmass':
            value = renderAufmass(value);
            break;
        }

        let inlineTypes = ['datetime', 'number', 'textfield'];

        let inlineClass = inlineTypes.indexOf(item.type) !== -1 ? 'is-inline' : '';

        return `<div class="component component--${item.type} ${inlineClass}">
                  <div class="component__label">${label}:</div>
                  <div class="component__value">${value}</div>
                </div>`;
      }).join('');

      output += '</div>';

      document.querySelector('#form').innerHTML = output;
    });
};

function renderAufmass(value) {
  console.log(value);

  let rows = ``;

  let positionNr = 0;
  value.positions.forEach(position => {
    positionNr++;
    let positionResult = 0;

    let rowNr = 0;
    position.rows.forEach(row => {
      rowNr++;
      console.log(row);
      let rowResult = calculateRow(row);

      if (rowResult !== null) {
        positionResult = positionResult + rowResult;
      }

      rows += `<tr>
        <td>${rowNr === 1 ? positionNr : ''}</td>
        <td class="text-left">${row.label !== null && row.label !== '' ? row.label : ''}</td>
        <td>${row.type === 'add' && row.count !== null && row.count !== 0 ? row.count : ''}</td>
        <td>${row.type === 'subtract' && row.count !== null && row.count !== 0 ? row.count : ''}</td>
        <td class="text-left cell-dimensions">${row.dimensions !== null && row.dimensions !== '' ? formatDimensions(row.dimensions) : ''}</td>
        <td>${row.type === 'add' && rowResult !== null ? Math.abs(rowResult).toFixed(2) : ''}</td>
        <td>${row.type === 'subtract' && rowResult !== null ? Math.abs(rowResult).toFixed(2) : ''}</td>
        <td></td>
      </tr>`;
    });

    rows += `<tr>
      <td></td>
      <td class="text-left"><strong>Summe</strong></td>
      <td></td>
      <td></td>
      <td class="text-left cell-dimensions"></td>
      <td></td>
      <td></td>
      <td>${positionResult.toFixed(2)}</td>
    </tr>`;

    rows += `<tr>
      <td></td>
      <td class="text-left">&nbsp;</td>
      <td></td>
      <td></td>
      <td class="text-left cell-dimensions"></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>`;
  });

  let output = `
  <table class="aufmass">
    <thead>
      <tr>
        <th rowspan="2">Pos.<br>Nr.</th>
        <th rowspan="2" class="text-left">Bezeichnung</th>
        <th colspan="2">Stück</th>
        <th rowspan="2" class="text-left cell-dimensions">Abmessungen</th>
        <th rowspan="2">Messgehalt</th>
        <th rowspan="2">Abzug</th>
        <th rowspan="2">reiner Messgehalt</th>
      </tr>
      <tr>
        <th>+</th>
        <th>-</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
  `;

  return output;
}


function formatDimensions(dimensions) {
  if (!dimensions) {
    return '';
  }

  const allowedPunctuation = '+-*/()';

  allowedPunctuation.split('').forEach(item => {
    // @ts-ignore
    dimensions = dimensions.replaceAll(item, ' '+item+' ');
  })

  // @ts-ignore
  dimensions = dimensions.replaceAll('  ', ' ');

  return dimensions;
}


function calculateRow(row) {
  if (row.dimensions) {
    let result;
    try {
      result = math.evaluate(row.dimensions);
    } catch (error) {
      return null;
    }

    if (result === Infinity) {
      return null;
    }

    result = row.count * result;

    if (row.type === 'subtract') {
      result = 0 - result;
    }

    return result;
  }

  return null;
}
