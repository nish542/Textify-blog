 import React from 'react'

function Alert(props){
    return(
        props.alert && <div className={`alert alert-${props.alert.type} my-3 mx-4`} role="alert">
            {props.alert.msg}
        </div>
    );
}

export default Alert