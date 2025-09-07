const output = document.getElementById('output');

const btnLeggi = document.getElementById('scanNFC');
const btnScrivi = document.getElementById('writeNFC');

btnLeggi.addEventListener('click', async () => {
  await readNfc();
});
btnScrivi.addEventListener('click', async () => {
  try {
    const messaggio = "Ciao NFC!"; // o dati presi da input utente`
    console.log(messaggio)
    const result = await writeNfc(messaggio);
    output.textContent = result;
  } catch (e) {
    output.textContent = "Errore scrittura: " + e.message;
  }
});

async function readNfc() {
  if (!('NDEFReader' in window)) {
    output.textContent = "Web NFC non supportato su questo dispositivo.";
    return;
  }
  try {
    const ndef = new NDEFReader();
    await ndef.scan();

    output.textContent = "In attesa di un tag NFC...";

    ndef.onreadingerror = () => {
      output.textContent = "Errore nella lettura del tag NFC.";
    };

    ndef.onreading = event => {
      const decoder = new TextDecoder();
      let message = '';
      for (const record of event.message.records) {
        if (record.recordType === "text") {
          message += decoder.decode(record.data) + '\n';
        }
      }
      output.textContent = "Tag letto:\n" + message;
    };
  } catch (error) {
    output.textContent = "Errore: " + error;
  }

}
async function writeNfc(data) {
  if (!('NDEFReader' in window)) {
    output.textContent = "Web NFC non supportato su questo dispositivo.";
    return;
  }

  try {
    const ndef = new NDEFReader();
    await ndef.write(data);
    return "Tag scritto:\n" + data;
  } catch (error) {
    throw new Error(error);
  }
}
