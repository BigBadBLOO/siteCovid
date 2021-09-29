import React from 'react'
import PropTypes from "prop-types";
import clsx from "clsx";

Button.propTypes = {
  icon: PropTypes.string,
  type: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  classNameText: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default function Button({icon, type, text, onClick, className, disabled, classNameText}) {
  let classes = [className,
    'rounded-md px-2 py-1 m-2 place-content-center focus:outline-none text-base border'
  ];

  if (type === 'primary') {
    classes.push('text-white bg-blue-600 bg-opacity-75 hover:bg-opacity-100 border-blue-600')
  } else if (type === 'success') {
    classes.push('text-white bg-green-600 bg-opacity-75 hover:bg-opacity-100 border-green-600')
  } else if (type === 'secondary') {
    classes.push('bg-gray-300 bg-opacity-75 hover:bg-opacity-100 border-gray-300')
  } else if (type === 'danger') {
    classes.push('text-white bg-red-600 bg-opacity-75 hover:bg-opacity-100 border-red-600')
  } else if (type === 'warning') {
    classes.push('text-white bg-yellow-600 bg-opacity-75 hover:bg-opacity-100 border-yellow-600')
  } else if (type === 'link') {
    classes = [className,'my-auto p-2 hover:underline text-blue-500 outline-none  focus:outline-none']
  }

  if(disabled){
    classes.push(
        'cursor-default bg-opacity-100'
    )
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
      className={clsx("p-1 text-center outline-none", props.className)}
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