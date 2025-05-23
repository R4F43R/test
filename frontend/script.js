(() => {
  const API_BASE = 'http://localhost:4000';

  // Cached elements
  const loginContainer = document.getElementById('loginContainer');
  const appContainer = document.getElementById('appContainer');
  const formLogin = document.getElementById('formLogin');
  const loginError = document.getElementById('loginError');
  const btnLogout = document.getElementById('btnLogout');

  // Client elements
  const formQuoteRequest = document.getElementById('formQuoteRequest');
  const fileInput = document.getElementById('files');
  const fileListElem = document.getElementById('fileList');
  const clientQuotesContainer = document.getElementById('clientQuotesContainer');
  const clientEmailInput = document.getElementById('clientEmail');
  const clientNameInput = document.getElementById('clientName');
  const clientPhoneInput = document.getElementById('clientPhone');

  const profileForm = document.getElementById('formProfile');
  const profileNameInput = document.getElementById('profileName');
  const profilePhoneInput = document.getElementById('profilePhone');
  const profileEmailInput = document.getElementById('profileEmail');

  // Company elements
  const companyQuotesList = document.getElementById('companyQuotesList');
  const companyQuoteDetail = document.getElementById('companyQuoteDetail');
  const quoteDetailContent = document.getElementById('quoteDetailContent');
  const formSendQuote = document.getElementById('formSendQuote');
  const btnBackToQuotes = document.getElementById('btnBackToQuotes');
  const messagesContainer = document.getElementById('messagesContainer');
  const formCompanyMessage = document.getElementById('formCompanyMessage');
  const messageInput = document.getElementById('messageInput');

  const companyOrdersList = document.getElementById('companyOrdersList');
  const companyOrderDetail = document.getElementById('companyOrderDetail');
  const orderDetailContent = document.getElementById('orderDetailContent');
  const formUpdateOrder = document.getElementById('formUpdateOrder');
  const btnBackToOrders = document.getElementById('btnBackToOrders');

  // Authentication state
  let authToken = null;
  let currentUser = null;
  let currentQuoteId = null;
  let currentOrderQuoteId = null;

  // Utilities
  function showToast(message, type = 'info', delay = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    const toastId = 'toast-' + Date.now();
    const toastElem = document.createElement('div');
    toastElem.classList.add(
      'toast',
      'align-items-center',
      'text-bg-' + (type === 'error' ? 'danger' : type),
      'border-0'
    );
    toastElem.id = toastId;
    toastElem.setAttribute('role', 'alert');
    toastElem.setAttribute('aria-live', 'assertive');
    toastElem.setAttribute('aria-atomic', 'true');
    toastElem.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    toastContainer.appendChild(toastElem);
    const bsToast = new bootstrap.Toast(toastElem, { delay });
    bsToast.show();
    toastElem.addEventListener('hidden.bs.toast', () => {
      toastElem.remove();
    });
  }

  function setAuth(token, user) {
    authToken = token;
    currentUser = user;
    if (token && user) {
      loginContainer.style.display = 'none';
      appContainer.style.display = '';
      updateUIByRole();
      loadProfile();
      if (user.role === 'client') {
        loadClientQuotes();
      } else if (user.role === 'company') {
        loadCompanyQuotes();
        loadCompanyOrders();
      }
    } else {
      loginContainer.style.display = '';
      appContainer.style.display = 'none';
    }
  }

  function getAuthHeaders() {
    return {
      Authorization: 'Basic ' + authToken,
      'Content-Type': 'application/json',
    };
  }

  async function apiFetch(url, options = {}) {
    options.headers = options.headers || {};
    Object.assign(options.headers, getAuthHeaders());
    const res = await fetch(API_BASE + url, options);
    if (!res.ok) {
      let errorText = 'Error en la solicitud';
      try {
        const errorJson = await res.json();
        if (errorJson.error) errorText = errorJson.error;
      } catch {}
      throw new Error(errorText);
    }
    return res.json();
  }

  // [Continue with all functions as in the single-file script, referencing elements now externally]

  // Add event listeners and DOM ready initialization at bottom

  window.addEventListener('load', () => {
    // Initialize auth from localStorage (if any)
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (token && user) {
        setAuth(token, user);
      } else {
        setAuth(null, null);
      }
    } catch {
      setAuth(null, null);
    }
  });

  formLogin.addEventListener('submit', async e => {
    e.preventDefault();
    if (!formLogin.checkValidity()) {
      formLogin.classList.add('was-validated');
      return;
    }
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    loginError.classList.add('d-none');
    try {
      const res = await fetch(API_BASE + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setAuth(data.token, data);
      formLogin.reset();
      formLogin.classList.remove('was-validated');
    } catch (err) {
      loginError.textContent = err.message;
      loginError.classList.remove('d-none');
    }
  });


  document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("miBoton");
  if (boton) {
    boton.addEventListener("click", () => {
      console.log("Botón clicado");
    });
  }
});

  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null, null);
  });

  // Continue with other event handlers and functions...

})();
