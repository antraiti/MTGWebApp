import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/esm/Button";


// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{textDecoration:"none", color:"white"}}
  >
    {children}
  </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

export const LabelDropdown = ({value, items, selected}) => {
    const [title, setTitle] = useState(value);
    
    return(
        <Dropdown onSelect={selected}>
          <Dropdown.Toggle as={CustomToggle}>
            {title}
          </Dropdown.Toggle>
      
          <Dropdown.Menu as={CustomMenu} style={{color:"white", textDecoration:"none"}}>
            {items != null && items.map((i) => (
                <Dropdown.Item eventKey={i}>{i}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )
}