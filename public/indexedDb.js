let db;
const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function (e) {
  const db = request.result;
  db.createObjectStore("transactions", { autoIncrement: true });
};

request.onsuccess = (e) => {
  db = e.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = (e) => {
  console.log(`Error ${e.target.errorCode}`);
};
console.log(data)
const saveTransaction = (data) => {
  const transaction = db.transaction(["transactions"], "readwrite");
  const store = transaction.objectStore("transactions");
  store.add(data);
};

function checkDatabase() {
  const transaction = db.transaction(["transactions"], "readwrite");
  const store = transaction.objectStore("transactions");
  const getAll = store.getAll();

  getAll.onsuccess = async () => {
    try {
      if (getAll.result.length > 0) {
        const response = await fetch("/api/transactions/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        });
        response.json();

        const transaction = db.transaction(["transactions"], "readwrite");

        const store = transaction.objectStore("transactions");

        store.clear();
      }
    } catch (error) {
      console.log(`${error}`);
    }
  };
}

window.addEventListener("online", checkDatabase);
