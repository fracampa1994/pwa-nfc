const output = document.getElementById('output');
const btn = document.getElementById('scanNFC');

btn.addEventListener('click', async () => {
  if ('NDEFReader' in window) {
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
  } else {
    output.textContent = "Web NFC non supportato su questo dispositivo.";
  }
});
