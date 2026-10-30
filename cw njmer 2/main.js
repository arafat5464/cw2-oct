
const API_URL =
  "https://jsonplaceholder.typicode.com/users";

const loadBtn = document.getElementById("loadBtn");
const promiseBtn = document.getElementById("promiseBtn");
const searchInput = document.getElementById("searchInput");
const usersContainer = document.getElementById("users");
const messageBox = document.getElementById("message");

let users = [];

// Сообщения
function showMessage(text, type = "success") {
  messageBox.textContent = text;
  messageBox.className = type;
}

// Рекурсия
function recursiveSearch(list, searchText, index = 0) {
  if (index >= list.length) return [];

  const user = list[index];

  const matches = (
    user.name + " " + user.email
  ).toLowerCase().includes(searchText.toLowerCase());

  const current = matches ? [user] : [];

  return current.concat(
    recursiveSearch(list, searchText, index + 1)
  );
}

// Регулярное выражение
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Создание карточки
function createUserCard(user) {
  const card = document.createElement("article");
  card.className = "user-card";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = user.name.charAt(0).toUpperCase();

  const info = document.createElement("div");
  info.className = "user-info";

  const name = document.createElement("h3");
  name.textContent = user.name;

  const email = document.createElement("p");
  email.textContent = "Email: ";

  const emailLink = document.createElement("a");
  emailLink.textContent = user.email;

  if (isValidEmail(user.email)) {
    emailLink.href = "mailto:" + user.email;
  }

  email.appendChild(emailLink);

  const phone = document.createElement("p");
  phone.textContent = "Phone: " + user.phone;

  const company = document.createElement("p");
  company.textContent = "Company: " + user.company.name;

  info.append(name, email, phone, company);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete";
  deleteBtn.textContent = "Удалить";

  deleteBtn.addEventListener("click", () => {
    deleteUser(user.id);
  });

  card.append(avatar, info, deleteBtn);

  return card;
}

// Вывод карточек
function renderUsers() {
  const query = searchInput.value.trim();

  const filteredUsers = query
    ? recursiveSearch(users, query)
    : users;

  usersContainer.replaceChildren();

  if (filteredUsers.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";

    empty.textContent = users.length
      ? "Ничего не найдено."
      : "Пользователей пока нет.";

    usersContainer.appendChild(empty);
    return;
  }

  filteredUsers.forEach(user => {
    usersContainer.appendChild(createUserCard(user));
  });
}

// Загрузка async/await
async function loadUsers() {
  loadBtn.disabled = true;
  loadBtn.textContent = "Загрузка...";

  showMessage("Получаем данные с сервера...");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Ошибка сервера: " + response.status);
    }

    const data = await response.json();

    users = data;
    renderUsers();

    showMessage(
      "Успешно загружено пользователей: " + users.length
    );

  } catch (error) {
    showMessage(
      "Ошибка загрузки: " + error.message,
      "error"
    );

    usersContainer.textContent =
      "Не удалось получить список.";

  } finally {
    loadBtn.disabled = false;
    loadBtn.textContent = "Загрузить пользователей";
  }
}

// Удаление
function deleteUser(userId) {
  const user = users.find(item => item.id === userId);

  users = users.filter(item => item.id !== userId);

  renderUsers();

  showMessage(
    user
      ? "Пользователь «" + user.name + "» удалён."
      : "Пользователь не найден."
  );
}

// Promise и then()
function promiseExample() {
  showMessage("Запущен пример Promise...");

  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error("Ошибка HTTP: " + response.status);
      }

      return response.json();
    })
    .then(data => {
      showMessage(
        "Promise выполнен! Загружено пользователей: " +
        data.length
      );
    })
    .catch(error => {
      showMessage(
        "Ошибка Promise: " + error.message,
        "error"
      );
    });
}

// Обработчики кнопок
loadBtn.addEventListener("click", loadUsers);

promiseBtn.addEventListener("click", promiseExample);

searchInput.addEventListener("input", renderUsers);
