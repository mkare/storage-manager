import "./style.css";
import { local } from "./core/local";
import { session } from "./core/session";
import { eventEmitter } from "./core/eventEmitter"; // Olay emitteri ekleyin

// HTML yapısını oluşturma
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <h1>Storage Manager</h1>
    
    <div class="input-group flex">
      <div class="col-2">
        <label for="idInput">ID</label>
        <input id="idInput" type="text" placeholder="###" />
      </div>
      <div class="col-8">
        <label for="titleInput">Title</label>
        <input id="titleInput" type="text" placeholder="Enter a title" />
      </div>
    </div>

    <div class="input-group">
      <label for="messageInput">Message</label>
      <input id="messageInput" type="text" placeholder="Enter a message" />
    </div>

    <div class="input-group">
      <button id="saveLocal" class="btn">Save to Local Storage</button>
      <button id="saveSession" class="btn">Save to Session Storage</button>
    </div>

    <hr />

    <div class="footer">
      <button class="btn" onclick="window.location.reload()">Refresh</button>
      <button class="btn" onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload()">Clear Storage</button>
    </div>

    <div class="storage-list">
      <h2>Stored Data</h2>
      <ul id="dataList"></ul>
    </div>
    <div id="notification" class="notification"></div>
  </div>
`;

// Bildirim gösterme işlevi
const showNotification = (message: string) => {
  const notification = document.getElementById("notification")!;
  notification.innerText = message;
  notification.classList.add("show");

  // 3 saniye sonra bildirim kaybolur
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
};

// Kaydedilen verileri listeleme işlevi
const updateDataList = async () => {
  const dataList = document.querySelector<HTMLUListElement>("#dataList")!;
  dataList.innerHTML = ""; // Listeyi boşalt

  // Local Storage'dan değerleri getir
  const localSync = await local.loadSyncMethods();
  const localData = localSync.get("localValue", []); // Dizi olarak alıyoruz

  // Session Storage'dan değerleri getir
  const sessionSync = await session.loadSyncMethods();
  const sessionData = sessionSync.get("sessionValue", []); // Dizi olarak alıyoruz

  // Local veriyi listeye ekleme
  localData.forEach(
    ({
      id,
      title,
      message,
    }: {
      id: string;
      title: string;
      message: string;
    }) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
      <h3>
        <span>id : ${id}</span>
        <span>${title}</span>
      </h3>
      <p>${message}</p>
    `;
      dataList.appendChild(card);
    }
  );

  // Session veriyi listeye ekleme
  sessionData.forEach(
    ({
      id,
      title,
      message,
    }: {
      id: string;
      title: string;
      message: string;
    }) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
      <h3>
        <span>id : ${id}</span>
        <span>${title}</span>
      </h3>
      <p>${message}</p>
    `;
      dataList.appendChild(card);
    }
  );
};

// Local Storage'a nesne olarak veri kaydetme
document
  .querySelector<HTMLButtonElement>("#saveLocal")!
  .addEventListener("click", async () => {
    const titleInput = document.querySelector<HTMLInputElement>("#titleInput")!;
    const messageInput =
      document.querySelector<HTMLInputElement>("#messageInput")!;
    const idInput = document.querySelector<HTMLInputElement>("#idInput")!;

    const localValue = {
      title: titleInput.value,
      message: messageInput.value,
      id: idInput.value,
    };

    const localAsync = await local.loadAsyncMethods();

    // Var olan local verileri al
    const existingLocalData: { title: string; message: string; id: string }[] =
      await localAsync.get("localValue", []); // Varsayılan olarak boş bir dizi döner

    // Yeni değeri diziye ekleyin
    existingLocalData.push(localValue);

    // Güncellenmiş diziyi kaydedin
    await localAsync.set("localValue", existingLocalData);
    updateDataList(); // Kaydedilen verileri güncelle

    // Olayı yay
    eventEmitter.emit("itemSaved", { key: "localValue", value: localValue });
  });

// Session Storage'a nesne olarak veri kaydetme
document
  .querySelector<HTMLButtonElement>("#saveSession")!
  .addEventListener("click", async () => {
    const titleInput = document.querySelector<HTMLInputElement>("#titleInput")!;
    const messageInput =
      document.querySelector<HTMLInputElement>("#messageInput")!;
    const idInput = document.querySelector<HTMLInputElement>("#idInput")!;

    const sessionValue = {
      title: titleInput.value,
      message: messageInput.value,
      id: idInput.value,
    };

    const sessionAsync = await session.loadAsyncMethods();

    // Var olan session verileri al
    const existingSessionData: {
      title: string;
      message: string;
      id: string;
    }[] = await sessionAsync.get("sessionValue", []); // Varsayılan olarak boş bir dizi döner

    // Yeni değeri diziye ekleyin
    existingSessionData.push(sessionValue);

    // Güncellenmiş diziyi kaydedin
    await sessionAsync.set("sessionValue", existingSessionData);
    updateDataList(); // Kaydedilen verileri güncelle

    // Olayı yay
    eventEmitter.emit("itemSaved", {
      key: "sessionValue",
      value: sessionValue,
    });
  });

// Olay dinleyicileri
eventEmitter.on("itemSaved", ({ key, value }) => {
  console.log(`Item saved to ${key}`, value);
  showNotification(`Item saved to ${key}`);
});

// Sayfa yüklendiğinde kayıtlı verileri göster
updateDataList();
