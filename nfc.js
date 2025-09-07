const output = document.getElementById('output');

const btnLeggi = document.getElementById('scanNFC');
const btnScrivi = document.getElementById('writeNFC');

btnLeggi.addEventListener('click', async () => {
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
function write(data, { timeout } = {}) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    controller.signal.onabort = () =>
      reject(new Error("Time is up, bailing out!"));
    setTimeout(() => controller.abort(), timeout);

    ndef.addEventListener(
      "reading",
      (event) => {
        ndef.write(data, { signal: controller.signal }).then(resolve, reject);
      },
      { once: true },
    );
  });
}

btnScrivi.addEventListener('click', async () => {
  await ndef.scan();
  try {
    // Let's wait for 5 seconds only.
    await write("Hello World", { timeout: 10_000 });
  } catch (err) {
    console.error("Something went wrong", err);
  } finally {
    console.log("We wrote to a tag!");
  }
});
