import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ModalProvider } from '../contexts/ModalContext'
import Modal from 'react-modal'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

Modal.setAppElement('#__next');

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </>
  )
}

export default MyApp
