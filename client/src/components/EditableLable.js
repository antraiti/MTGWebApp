import React from "react";

function EditableLable(props) {
  return (
    <span>
      {
        props.showInputEle ? (
          <input 
            type="text"
            value={props.value}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            autoFocus
            style={{color:"white", background:"transparent", fontSize: "2em", border:0, outline:0}}
          />
        ) : (
          <span 
            onDoubleClick={props.handleDoubleClick}
            style={{ 
              display: "inline-block", 
              height: "25px", 
              minWidth: "300px", 
              color: "white",
              fontSize: "2em"
            }}
          >
            {props.value}
          </span>
        )
      }
    </span>
  );
}

export default EditableLable;