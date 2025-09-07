const output = document.getElementById('output');

const btnLeggi = document.getElementById('scanNFC');
const btnAddValue = document.getElementById('btnAddValue');
const btnRemoveValue = document.getElementById('btnRemoveValue');

let currentValue = 0; // stato valore letto dal tag

btnLeggi.addEventListener('click', async () => {
  await readNfc();
});

btnAddValue.addEventListener('click', async () => {
  try {
    currentValue += 1;
    const result = await writeNfc(currentValue.toString());
    output.textContent = result;
  } catch (e) {
    output.textContent = "Errore scrittura: " + e.message;
  }
});

btnRemoveValue.addEventListener('click', async () => {
  try {
    currentValue -= 1;
    const result = await writeNfc(currentValue.toString());
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

    return new Promise((resolve, reject) => {
      ndef.onreadingerror = () => {
        output.textContent = "Errore nella lettura del tag NFC.";
        reject(new Error("Errore lettura"));
      };

      ndef.onreading = event => {
        const decoder = new TextDecoder();
        let message = '';
        for (const record of event.message.records) {
          if (record.recordType === "text") {
            message += decoder.decode(record.data);
          }
        }
        output.textContent = "Tag letto:\n" + message;
        currentValue = parseInt(message) || 0; // salva valore letto come numero
        resolve(currentValue);
      };
    });
  } catch (error) {
    output.textContent = "Errore: " + error;
  }
}

async function writeNfc(data) {
  if (!('NDEFReader' in window)) {
    throw new Error("Web NFC non supportato su questo dispositivo.");
  }
  try {
    const ndef = new NDEFReader();
    await ndef.write(data);
    return "Tag scritto:\n" + data;
  } catch (error) {
    throw new Error(error);
  }
}
