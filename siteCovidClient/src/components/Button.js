import React from 'react'
import PropTypes from "prop-types";

Button.propTypes = {
  icon: PropTypes.string,
  type: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  classNameText: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
}

export default function Button({icon, type, text, onClick, className, disabled, classNameText}) {
  const classes = [
    'rounded-md px-2 py-1 m-2 place-content-center focus:outline-none '
  ];

  classes.push(className);

  if (type === 'primary') {
    classes.push('text-white bg-blue-500 bg-opacity-75 hover:bg-opacity-100')
  } else if (type === 'success') {
    classes.push('text-white bg-green-600')
  } else if (type === 'secondary') {
    classes.push('text-white bg-gray-600')
  } else if (type === 'danger') {
    classes.push('text-white bg-red-600')
  } else if (type === 'warning') {
    classes.push('text-white bg-yellow-600')
  }

  return (
    <button className={classes.join(' ')} onClick={onClick} disabled={disabled}>
      {icon ? <i className="material-icons mx-1 float-left">{icon}</i> : ''}
      <span className={"my-auto " + classNameText}>{text}</span>
    </button>
  )
}


const InputForDatePicker = (props) => {
  return (
    <input
      className="rounded border border-blue-700 p-1"
      onClick={props.onClick}
      value={props.value}
      type="text"
      readOnly={true}
    />
  )
};

export {
  InputForDatePicker
}