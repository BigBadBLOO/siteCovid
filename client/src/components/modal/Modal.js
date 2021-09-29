//core
import React from "react";
import PropTypes from "prop-types";
import CSSTransition from "react-transition-group/CSSTransition";

//styles
import './modal.css'
function MyModal({show, showModal, children}) {
  return (
    <CSSTransition in={show} timeout={200} unmountOnExit classNames="myModalAnimation">
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="fixed inset-0 transition-all transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => showModal(false)}/>
        </div>
        <div className="flex justify-center py-12 px-8">
          <div
            className="rounded shadow-xl z-50 my-8 sm:max-w-lg w-full"
            role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            <div className="float-right">
              <span className="m-2 cursor-pointer text-lg" onClick={() => showModal(false)}>×</span>
            </div>
            <div className="bg-white rounded p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}

MyModal.propTypes = {
  show: PropTypes.bool.isRequired,
  showModal: PropTypes.func.isRequired,
};

export default MyModal