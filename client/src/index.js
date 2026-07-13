import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/ReduxStore.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
//Finds <div id="root"></div> in public/index.html.
//Creates the React root.

root.render(//Everything inside this becomes your React application.
  <React.StrictMode>
    <Provider store={store}> //Makes the Redux store available to every component.

      <BrowserRouter>//Enables routing (/login, /home, etc.).
        <Routes>
          <Route path='*' element= {<App />} />
          {/* * means every URL goes to App.
               So whether the URL is
              /
              or
              /login
              or
              /profile
              React first renders:App.js */
}
        </Routes>
      </BrowserRouter>

    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
